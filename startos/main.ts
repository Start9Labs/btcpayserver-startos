import { HealthCheckResult } from '@start9labs/start-sdk/package/lib/health/checkFns'
import { readFile } from 'fs/promises'
import { BTCPSEnv } from './fileModels/btcpay.env'
import { nbxEnvDefaults, NBXplorerEnv } from './fileModels/nbxplorer.env'
import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'
import {
  clnConnectionString,
  clnMountpoint,
  getEnabledAltcoin,
  lndConnectionString,
  lndMountpoint,
  nbxPort,
  pgMounts,
  uiPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   */
  console.info('Starting BTCPay Server...')

  // ========================
  // Read config
  // ========================

  const shopifyEnabled = await storeJson
    .read((s) => s.plugins.shopify)
    .const(effects)

  const btcpayEnv = await BTCPSEnv.read().const(effects)
  if (!btcpayEnv) throw new Error('BTCPay env not found')

  const nbxEnv = await NBXplorerEnv.read().const(effects)
  if (!nbxEnv) throw new Error('NBXplorer env not found')

  // ========================
  // Dependency mounts
  // ========================

  let mounts = sdk.Mounts.of()
    .mountVolume({
      volumeId: 'main',
      subpath: 'btcpayserver',
      mountpoint: '/datadir',
      readonly: false,
    })
    .mountVolume({
      volumeId: 'main',
      subpath: 'plugins',
      mountpoint: '/root/.btcpayserver/Plugins',
      readonly: false,
    })
    .mountVolume({
      volumeId: 'main',
      subpath: 'nbxplorer',
      mountpoint: '/root/.nbxplorer',
      readonly: false,
    })

  if (getEnabledAltcoin('xmr', btcpayEnv.BTCPAY_CHAINS)) {
    mounts = mounts.mountDependency({
      dependencyId: 'monerod',
      volumeId: 'main',
      subpath: null,
      mountpoint: '/mnt/monero',
      readonly: false,
    })
  }

  if (btcpayEnv.BTCPAY_BTCLIGHTNING === lndConnectionString) {
    mounts = mounts.mountDependency({
      dependencyId: 'lnd',
      volumeId: 'main',
      subpath: null,
      mountpoint: lndMountpoint,
      readonly: true,
    })
  } else if (btcpayEnv.BTCPAY_BTCLIGHTNING === clnConnectionString) {
    mounts = mounts.mountDependency({
      dependencyId: 'c-lightning',
      volumeId: 'main',
      subpath: null,
      mountpoint: clnMountpoint,
      readonly: true,
    })
  }

  // ========================
  // Set subcontainers
  // ========================

  const btcpaySub = await sdk.SubContainer.of(
    effects,
    { imageId: 'btcpay' },
    mounts,
    'btcpay',
  )

  const nbxSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'nbx' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: 'nbxplorer',
        mountpoint: '/datadir',
        readonly: false,
      })
      .mountDependency({
        dependencyId: 'bitcoind',
        volumeId: 'main',
        subpath: null,
        mountpoint: '/root/.bitcoin',
        readonly: false,
      }),
    'nbx',
  )

  const postgresSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    pgMounts,
    'postgres',
  )

  /**
   *  ======================== Daemons ========================
   */
  const daemons = sdk.Daemons.of(effects)
    .addDaemon('postgres', {
      subcontainer: postgresSub,
      exec: {
        command: sdk.useEntrypoint(['-c', 'listen_addresses=127.0.0.1']),
        env: {
          POSTGRES_HOST_AUTH_METHOD: 'trust',
        },
      },
      ready: {
        display: null,
        fn: async () => {
          const result = await postgresSub.exec([
            'pg_isready',
            '-q',
            '-h',
            '127.0.0.1',
            '-d',
            'postgres',
            '-U',
            'postgres',
          ])
          if (result.exitCode !== 0) {
            return {
              result: 'loading',
              message: 'Waiting for PostgreSQL to be ready',
            }
          }
          return {
            result: 'success',
            message: 'PostgreSQL is ready',
          }
        },
      },
      requires: [],
    })
    .addDaemon('nbxplorer', {
      subcontainer: nbxSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          ...nbxEnv,
          NBXPLORER_POSTGRES:
            'User ID=postgres;Host=127.0.0.1;Port=5432;Application Name=nbxplorer;Database=nbxplorer',
        },
        sigtermTimeout: 60_000,
      },
      ready: {
        display: 'UTXO Tracker',
        gracePeriod: 30_000,
        fn: async () =>
          sdk.healthCheck.checkPortListening(effects, nbxPort, {
            successMessage: 'The explorer is reachable',
            errorMessage: 'The explorer is unreachable',
          }),
      },
      requires: ['postgres'],
    })
    .addOneshot('reset-start-height', {
      subcontainer: nbxSub,
      exec: {
        fn: async () => {
          await NBXplorerEnv.merge(effects, {
            NBXPLORER_BTCRESCAN: nbxEnvDefaults.NBXPLORER_BTCRESCAN,
            NBXPLORER_BTCSTARTHEIGHT: nbxEnvDefaults.NBXPLORER_BTCSTARTHEIGHT,
          })
          return null
        },
      },
      requires: ['nbxplorer'],
    })
    .addHealthCheck('utxo-sync', {
      ready: {
        display: 'UTXO Tracker Sync',
        fn: async () => {
          const auth = await readFile(`${nbxSub.rootfs}/datadir/Main/.cookie`, {
            encoding: 'base64',
          })

          const fetchStatus = async () => {
            const res = await fetch(
              `http://127.0.0.1:${nbxPort}/v1/cryptos/BTC/status`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Basic ${auth}`,
                },
              },
            )
            return (await res.json()) as NbxStatusRes
          }

          try {
            let res = await fetchStatus()

            if (!res.bitcoinStatus) {
              // Retry once if bitcoinStatus is missing. This happens when bitcoind closes idle pooled
              // TCP connections, causing "response ended prematurely" errors that leave bitcoinStatus undefined.
              // This is an issue with how .NET handles tcp/http connection pooling.
              res = await fetchStatus()
            }

            return nbxHealthCheck(res)
          } catch (e) {
            return {
              result: 'failure',
              message: 'Failed to get UTXO tracker status.',
            }
          }
        },
      },
      requires: ['nbxplorer'],
    })
    .addDaemon('btcpay', {
      subcontainer: btcpaySub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          ...btcpayEnv,
          BTCPAY_EXPLORERPOSTGRES:
            'User ID=postgres;Host=127.0.0.1;Port=5432;Application Name=nbxplorer;Database=nbxplorer',
          BTCPAY_POSTGRES:
            'User ID=postgres;Host=127.0.0.1;Port=5432;Application Name=btcpayserver;Database=btcpayserver',
          BTCPAY_SHOPIFY_PLUGIN_DEPLOYER: 'http://127.0.0.1:5000/',
          LC_ALL: 'C',
          BTCPAY_DEBUGLOG: 'btcpay.log',
          BTCPAY_DOCKERDEPLOYMENT: 'false',
        },
        sigtermTimeout: 60_000,
      },
      ready: {
        display: 'Web Interface',
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://127.0.0.1:${uiPort}/api/v1/health`,
            {
              successMessage: 'The web interface is reachable',
              errorMessage: 'The web interface is unreachable',
            },
          ),
      },
      requires: ['nbxplorer', 'postgres'],
    })

  // Add Shopify app daemon if enabled
  if (shopifyEnabled) {
    return daemons.addDaemon('shopify', {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'shopify' },
        null,
        'shopify',
      ),
      exec: {
        command: sdk.useEntrypoint(),
      },
      ready: {
        display: 'Shopify Plugin',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, 5000, {
            successMessage: 'The Shopify app is running',
            errorMessage: 'The Shopify app is not running',
          }),
      },
      requires: ['btcpay'],
    })
  }

  return daemons
})

interface NbxStatusRes {
  bitcoinStatus?: {
    blocks: number
    headers: number
    verificationProgress: number // float
    isSynched: boolean
  }
  isFullySynched: boolean
  chainHeight: number
  syncHeight: number
}

const nbxHealthCheck = (res: NbxStatusRes): HealthCheckResult => {
  const { bitcoinStatus, isFullySynched, chainHeight, syncHeight } = res

  if (isFullySynched) {
    return {
      result: 'success',
      message: 'Synced to the tip of the Bitcoin blockchain',
    }
  } else if (!isFullySynched && bitcoinStatus && !bitcoinStatus.isSynched) {
    const percentage = (bitcoinStatus.verificationProgress * 100).toFixed(2)
    return {
      result: 'loading',
      message: `The Bitcoin node is syncing. This must complete before the UTXO tracker can sync. Sync progress: ${percentage}%`,
    }
  } else if (!isFullySynched && bitcoinStatus && bitcoinStatus.isSynched) {
    const progress =
      chainHeight > 0 ? ((syncHeight / chainHeight) * 100).toFixed(2) : '0.00'
    return {
      result: 'loading',
      message: `The UTXO tracker is syncing. Sync progress: ${progress}%`,
    }
  } else {
    return {
      result: 'failure',
      message: 'Failed to connect to Bitcoin node.',
    }
  }
}
