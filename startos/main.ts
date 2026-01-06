import { sdk } from './sdk'
import { readFile } from 'fs/promises'
import { HealthCheckResult } from '@start9labs/start-sdk/package/lib/health/checkFns'
import { BTCPSEnv } from './fileModels/btcpay.env'
import {
  clnMountpoint,
  getEnabledAltcoin,
  lndMountpoint,
  nbxEnvDefaults,
  uiPort,
  nbxPort,
} from './utils'
import { storeJson } from './fileModels/store.json'
import { NBXplorerEnv } from './fileModels/nbxplorer.env'

/**
 * ======================== Mounts ========================
 */
const btcpayMountsDefault = sdk.Mounts.of()
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

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   */
  console.info('Starting BTCPay Server...')

  // ========================
  // Get store values
  // ========================

  const store = await storeJson.read().const(effects)
  if (!store) throw new Error('Store not found')

  const { plugins, lightning } = store

  // ========================
  // Dependency setup & checks
  // ========================

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

  const chains = await BTCPSEnv.read((e) => e.BTCPAY_CHAINS).const(effects)
  if (!chains) throw new Error('BTCPay chains does not exist')

  let btcpayMounts = btcpayMountsDefault
  if (getEnabledAltcoin('xmr', chains)) {
    btcpayMounts = btcpayMounts.mountDependency({
      dependencyId: 'monerod',
      volumeId: 'main',
      subpath: null,
      mountpoint: '/mnt/monero',
      readonly: false,
    })
  } else {
    btcpayMounts = btcpayMountsDefault
  }

  switch (lightning) {
    case 'lnd':
      btcpayMounts = btcpayMounts.mountDependency({
        dependencyId: 'lnd',
        volumeId: 'main',
        subpath: null,
        mountpoint: lndMountpoint,
        readonly: true,
      })
      break
    case 'cln':
      btcpayMounts = btcpayMounts.mountDependency({
        dependencyId: 'c-lightning',
        volumeId: 'main',
        subpath: null,
        mountpoint: clnMountpoint,
        readonly: true,
      })
      break
    default:
      btcpayMounts = btcpayMountsDefault
      break
  }

  // ========================
  // Set containers
  // ========================

  const btcpayContainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'btcpay' },
    btcpayMounts,
    'btcpay',
  )

  const nbxContainer = await sdk.SubContainer.of(
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

  const postgresContainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: 'postgresql',
      mountpoint: '/var/lib/postgresql',
      readonly: false,
    }),
    'postgres',
  )

  /**
   *  ======================== Daemons ========================
   */
  const daemons = sdk.Daemons.of(effects)
    .addDaemon('postgres', {
      subcontainer: postgresContainer,
      exec: {
        command: sdk.useEntrypoint(['-c', 'random_page_cost=1.0']),
        env: {
          POSTGRES_HOST_AUTH_METHOD: 'trust',
        },
      },
      ready: {
        display: null,
        fn: async () => {
          const status = await postgresContainer.execFail([
            '/usr/lib/postgresql/13/bin/pg_isready',
            '-q',
            '-h',
            'localhost',
            '-d',
            'btcpayserver',
            '-U',
            'postgres',
          ])
          if (status.stderr) {
            console.error('Error running postgres: ', status.stderr.toString())
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
      subcontainer: nbxContainer,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          ...(await NBXplorerEnv.read().const(effects)),
        },
        sigtermTimeout: 60_000,
      },
      ready: {
        display: 'UTXO Tracker',
        fn: async () =>
          sdk.healthCheck.checkPortListening(effects, nbxPort, {
            successMessage: 'The explorer is reachable',
            errorMessage: 'The explorer is unreachable',
          }),
      },
      requires: ['postgres'],
    })
    .addOneshot('reset-start-height', {
      subcontainer: nbxContainer,
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
        gracePeriod: 10_000,
        fn: async () => {
          const auth = await readFile(
            `${nbxContainer.rootfs}/datadir/Main/.cookie`,
            {
              encoding: 'base64',
            },
          )
          const res = await fetch(
            `http://0.0.0.0:${nbxPort}/v1/cryptos/BTC/status`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${auth}`,
              },
            },
          )
            .then(async (res) => {
              const jsonRes = (await res.json()) as NbxStatusRes
              return jsonRes
            })
            .catch((e) => {
              console.log(e)
              throw new Error(e)
            })
          return nbxHealthCheck(res)
        },
      },
      requires: ['nbxplorer'],
    })
    .addDaemon('webui', {
      subcontainer: btcpayContainer,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          ...(await BTCPSEnv.read().const(effects)),
          BTCPAY_EXPLORERPOSTGRES:
            'User ID=postgres;Host=localhost;Port=5432;Application Name=nbxplorer;Database=nbxplorer',
          BTCPAY_POSTGRES:
            'User ID=postgres;Host=localhost;Port=5432;Application Name=btcpayserver;Database=btcpayserver',
          BTCPAY_SHOPIFY_PLUGIN_DEPLOYER: 'http://localhost:5000/',
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
            `http://0.0.0.0:${uiPort}/api/v1/health`,
            {
              successMessage: `The web interface is reachable`,
              errorMessage: `The web interface is unreachable`,
            },
          ),
      },
      requires: ['nbxplorer', 'postgres'],
    })

  // Add Shopify app daemon if enabled
  if (plugins.shopify) {
    daemons.addDaemon('shopify', {
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
      requires: ['webui'],
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
    const progress = ((syncHeight / chainHeight) * 100).toFixed(2)
    return {
      result: 'loading',
      message: `The UTXO tracker is syncing. Sync progress: ${progress}%`,
    }
  } else {
    return {
      result: 'starting',
      message: 'BTCPay is starting',
    }
  }
}
