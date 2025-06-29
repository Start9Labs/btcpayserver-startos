import { sdk } from './sdk'
import { readFile, writeFile } from 'fs/promises'
import { HealthCheckResult } from '@start9labs/start-sdk/package/lib/health/checkFns'
import { BTCPSEnv } from './fileModels/btcpay.env'
import {
  btcMountpoint,
  clnMountpoint,
  getEnabledAltcoin,
  lndMountpoint,
  nbxEnvDefaults,
  uiPort,
  nbxPort,
  nbxCookieFile,
  nginxConf,
} from './utils'
import { storeJson } from './fileModels/store.json'
import { NBXplorerEnv } from './fileModels/nbxplorer.env'

/**
 * ======================== Mounts ========================
 */
let mainMounts = sdk.Mounts.of()
  .mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/datadir',
    readonly: false,
  })
  .mountDependency({
    dependencyId: 'bitcoind',
    volumeId: 'main',
    subpath: null,
    mountpoint: btcMountpoint,
    // @TODO: this should be readonly, but we need to change its permissions
    readonly: false,
  })

export const main = sdk.setupMain(async ({ effects, started }) => {
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

  switch (lightning) {
    case 'lnd':
      // @TODO mainMounts.mountDependency<typeof LndManifest>
      mainMounts = mainMounts.mountDependency({
        dependencyId: 'lnd',
        volumeId: 'main', //@TODO verify
        subpath: null,
        mountpoint: lndMountpoint,
        readonly: true,
      })
      break
    case 'cln':
      // @TODO mainMounts.mountDependency<typeof ClnManifest>
      mainMounts = mainMounts.mountDependency({
        dependencyId: 'c-lightning',
        volumeId: 'main', //@TODO verify
        subpath: null,
        mountpoint: clnMountpoint,
        readonly: true,
      })
      break
    default:
      break
  }

  if (getEnabledAltcoin('xmr', chains)) {
    // @TODO mainMounts.mountDependency<typeof MoneroManifest>
    mainMounts = mainMounts.mountDependency({
      dependencyId: 'monerod',
      volumeId: 'main', //@TODO verify
      subpath: null,
      mountpoint: '/mnt/monero',
      readonly: false,
    })
  }

  // ========================
  // Set containers
  // ========================

  const btcpayContainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'btcpay' },
    mainMounts,
    'btcpay',
  )
  const nbxContainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'nbx' },
    mainMounts,
    'nbx',
  )
  const nginxContainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'nginx' },
    mainMounts,
    'nginx',
  )

  // ========================
  // Set nginx conf
  // ========================
  await writeFile(
    `${nginxContainer.rootfs}/etc/nginx/conf.d/default.conf`,
    nginxConf,
  )

  /**
   *  ======================== Daemons ========================
   */

  const daemons = sdk.Daemons.of(effects, started)
    .addDaemon('postgres', {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'postgres' },
        mainMounts,
        'postgres',
      ),
      exec: {
        command: [
          'su',
          '-',
          'postgres',
          '-c',
          '/usr/lib/postgresql/13/bin/pg_ctl -D /datadir/postgresql/data start',
        ],
        // user: 'postgres',
        env: {
          POSTGRES_HOST_AUTH_METHOD: 'trust',
          PGDATA: '/datadir/postgresql/data',
        },
      },
      ready: {
        display: null,
        fn: async () => {
          return sdk.SubContainer.withTemp(
            effects,
            { imageId: 'postgres' },
            mainMounts,
            'postgres-ready',
            async (sub) => {
              const status = await sub.execFail(
                [
                  'su',
                  '-',
                  'postgres',
                  '-c',
                  '/usr/lib/postgresql/13/bin/pg_isready -h localhost',
                ],
                {
                  // user: 'postgres',
                },
              )
              if (status.stderr) {
                console.error(
                  'Error running postgres: ',
                  status.stderr.toString(),
                )
                return {
                  result: 'loading',
                  message: 'Waiting for PostgreSQL to be ready',
                }
              }
              return {
                result: 'success',
                message: 'Postgres is ready',
              }
            },
          )
        },
      },
      requires: [],
    })
    .addDaemon('nbxplorer', {
      subcontainer: nbxContainer,
      exec: {
        command: ['dotnet', '/app/NBXplorer.dll'],
        env: {
          ...(await NBXplorerEnv.read().const(effects)),
        },
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
        gracePeriod: 10000,
        fn: async () => {
          const auth = await readFile(
            `${nbxContainer.rootfs}${nbxCookieFile}`,
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
            .then(async (res: any) => {
              const jsonRes = (await res.json()) as NbxStatusRes
              return jsonRes
            })
            .catch((e: any) => {
              throw new Error(e)
            })
          return nbxHealthCheck(res)
        },
      },
      requires: ['nbxplorer'],
    })
    .addDaemon('nginx', {
      subcontainer: nginxContainer,
      exec: {
        command: ['nginx', '-g', 'daemon off;'],
      },
      ready: {
        display: null,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, 80, {
            successMessage: 'Nginx running',
            errorMessage: 'Nginx not running',
          }),
      },
      requires: [],
    })
    .addDaemon('webui', {
      subcontainer: btcpayContainer,
      exec: {
        command: ['dotnet', '/app/BTCPayServer.dll'],
        env: {
          ...(await BTCPSEnv.read().const(effects)),
          BTCPAY_EXPLORERPOSTGRES:
            'User ID=postgres;Host=localhost;Port=5432;Application Name=nbxplorer;Database=nbxplorer',
          BTCPAY_POSTGRES:
            'User ID=postgres;Host=localhost;Port=5432;Application Name=btcpayserver;Database=btcpayserver',
          BTCPAY_PLUGINDIR: '/datadir/plugins',
          BTCPAY_SHOPIFY_PLUGIN_DEPLOYER: 'http://localhost:5000/',
          LC_ALL: 'C',
          BTCPAY_DEBUGLOG: 'btcpay.log',
          BTCPAY_DATADIR: '/datadir/btcpayserver',
          BTCPAY_DOCKERDEPLOYMENT: 'false',
          APPDATA: '/datadir/btcpayserver',
        },
      },
      ready: {
        display: 'Web Interface',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: 'The web interface is reachable',
            errorMessage: 'The web interface is unreachable',
          }),
      },
      requires: ['nbxplorer', 'nginx'],
    })
    .addHealthCheck('data-interface', {
      ready: {
        display: 'Data Interface',
        gracePeriod: 10000,
        fn: () => {
          return sdk.healthCheck.checkWebUrl(
            effects,
            `http://0.0.0.0:${uiPort}/api/v1/health`,
            {
              successMessage: `The API is fully operational`,
              errorMessage: `The API is unreachable`,
            },
          )
        },
      },
      requires: ['webui'],
    })

  // Add Shopify app daemon if enabled
  if (plugins.shopify) {
    daemons.addDaemon('shopify', {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'shopify' },
        mainMounts,
        'shopify',
      ),
      exec: {
        command: ['node', '/app/server.js'],
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
