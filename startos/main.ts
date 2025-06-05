import { sdk } from './sdk'
import { readFile } from 'fs/promises'
import { HealthCheckResult } from '@start9labs/start-sdk/package/lib/health/checkFns'
import { BTCPSEnv } from './fileModels/btcpay.env'
import {
  btcMountpoint,
  clnMountpoint,
  getCurrentLightning,
  lndMountpoint,
  uiPort,
} from './utils'
import { storeJson } from './fileModels/store.json'
import { bitcoinConfDefaults } from 'bitcoind-startos/startos/utils'

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

  /**
   * ======================== Additional Health Checks ========================
   */

  const apiHealthCheck = sdk.HealthCheck.of(effects, {
    id: 'data-interface',
    name: 'Data Interface',
    fn: () =>
      sdk.healthCheck.checkWebUrl(
        effects,
        'http://btcpayserver.startos:23000/api/v1/health',
        {
          successMessage: `The API is fully operational`,
          errorMessage: `The API is unreachable`,
        },
      ),
  })

  const syncHealthCheck = sdk.HealthCheck.of(effects, {
    id: 'sync',
    name: 'UTXO Tracker Sync',
    fn: async () => {
      const auth = await readFile(
        `${btcMountpoint}${bitcoinConfDefaults.rpccookiefile}`,
        {
          encoding: 'base64',
        },
      )
      const res = await fetch('http://127.0.0.1:24444/v1/cryptos/BTC/status', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
      })
        .then(async (res: any) => {
          const jsonRes = (await res.json()) as NbxStatusRes
          // @TODO remove me after testing
          console.log(`NBX status response is: ${res}`)
          console.log(`NBX status response parsed as json: ${jsonRes}`)
          return jsonRes
        })
        .catch((e: any) => {
          throw new Error(e)
        })
      return nbxHealthCheck(res)
    },
  })

  // ========================
  // Get store values
  // ========================

  const plugins = await storeJson.read((s) => s.plugins).const(effects)

  if (!plugins) throw new Error('Store plugins not found')

  const startHeight = await storeJson.read((s) => s.startHeight).once()

  // reset NBXplorer to scan from current block height (defaults)
  await storeJson.merge(effects, {
    startHeight: -1,
  })

  // ========================
  // Dependency setup & checks
  // ========================

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

  const env = await BTCPSEnv.read().const(effects)
  if (!env) throw new Error('BTCPay environment file unreadable')
  const lnImplementation = getCurrentLightning(env.BTCPAY_BTCLIGHTNING)

  if (lnImplementation === 'lnd') {
    // @TODO mainMounts.mountDependency<typeof LndManifest>
    mainMounts = mainMounts.mountDependency({
      dependencyId: 'lnd',
      volumeId: 'main', //@TODO verify
      subpath: null,
      mountpoint: lndMountpoint,
      readonly: true,
    })
  }

  if (lnImplementation === 'cln') {
    // @TODO mainMounts.mountDependency<typeof ClnManifest>
    mainMounts = mainMounts.mountDependency({
      dependencyId: 'c-lightning',
      volumeId: 'main', //@TODO verify
      subpath: null,
      mountpoint: clnMountpoint,
      readonly: true,
    })
  }

  // TODO check if xmr in btc chains
  if (env.BTCPAY_XMR_DAEMON_URI) {
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

  // ========================
  // Setup environment files
  // ========================

  await btcpayContainer.exec([
    'source',
    '/media/startos/volumes/main/btcpay.env',
  ])
  await nbxContainer.exec([
    'source',
    '/media/startos/volumes/main/nbxplorer.env',
  ])

  /**
   *  ======================== Daemons ========================
   */
  const daemons = sdk.Daemons.of(effects, started, [
    apiHealthCheck,
    syncHealthCheck,
  ])
    .addDaemon('postgres', {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'postgres' },
        mainMounts,
        'postgres',
      ),
      command: [
        'sudo',
        '-u',
        'postgres',
        '/usr/lib/postgresql/13/bin/postgres',
        '-D',
        '/datadir/postgresql/data',
        '-c',
        'random_page_cost=1.0',
        '-c',
        'shared_preload_libraries=pg_stat_statements',
      ],
      env: {
        POSTGRES_HOST_AUTH_METHOD: 'trust',
      },
      ready: {
        display: null,
        fn: async () => {
          const sub = await sdk.SubContainer.of(
            effects,
            { imageId: 'postgres' },
            mainMounts,
            'postgres-ready',
          )
          // TODO convert to TS
          // sub.execFail
          return sdk.healthCheck.runHealthScript(
            ['/media/startos/assets/scripts/postgres-ready.sh'],
            sub,
          )
        },
      },
      requires: [],
    })
    .addDaemon('nbxplorer', {
      subcontainer: nbxContainer,
      command: [
        'dotnet',
        '/nbxplorer/NBXplorer.dll',
        `--btcrescan=${startHeight === -1 ? 0 : 1}`,
        `--btcstartheight=${startHeight}`,
      ],
      env: {},
      ready: {
        display: 'UTXO Tracker Sync',
        fn: async () =>
          sdk.healthCheck.checkPortListening(effects, 24444, {
            successMessage: 'The explorer is reachable',
            errorMessage: 'The explorer is unreachable',
          }),
      },
      requires: ['postgres'],
    })
    .addDaemon('webui', {
      subcontainer: btcpayContainer,
      command: ['dotnet', '/app/BTCPayServer.dll'],
      env: {},
      ready: {
        display: 'Web Interface',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: 'The web interface is reachable',
            errorMessage: 'The web interface is unreachable',
          }),
      },
      requires: ['nbxplorer'],
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
      command: ['node', '/app/server.js'],
      env: {},
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
  bitcoinStatus: {
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
  } else if (!isFullySynched && !bitcoinStatus.isSynched) {
    const percentage = (bitcoinStatus.verificationProgress * 100).toFixed(2)
    return {
      result: 'loading',
      message: `The Bitcoin node is syncing. This must complete before the UTXO tracker can sync. Sync progress: ${percentage}%`,
    }
  } else if (!isFullySynched && bitcoinStatus.isSynched) {
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
