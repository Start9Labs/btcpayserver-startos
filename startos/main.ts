import { HealthCheckResult } from '@start9labs/start-sdk/lib/health/checkFns'
import { manifest as bitcoinManifest } from 'bitcoin-core-startos/startos/manifest'
import { manifest as clnManifest } from 'cln-startos/startos/manifest'
import { manifest as lndManifest } from 'lnd-startos/startos/manifest'
import { manifest as monerodManifest } from 'monerod-startos/startos/manifest'
import { readFile } from 'fs/promises'
import { btcpayConfig } from './fileModels/btcpay.config'
import {
  nbxConfigDefaults,
  nbxplorerConfig,
} from './fileModels/nbxplorer.config'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  bitcoindMountpoint,
  bitcoindPeerBridge,
  bitcoindRpcBridge,
  clnMountpoint,
  dataDir,
  getEnabledAltcoin,
  isCln,
  isLnd,
  lndConnectionString,
  lndMountpoint,
  lndRestBridge,
  monerodRpcBridge,
  nbxMountpoint,
  nbxPort,
  PG_MOUNT,
  shopifyPort,
  torSocksBridge,
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

  const config = await btcpayConfig.read().const(effects)
  if (!config) throw new Error('BTCPay config not found')

  const nbxConfig = await nbxplorerConfig.read().const(effects)
  if (!nbxConfig) throw new Error('NBXplorer config not found')

  // ========================
  // Resolve dependency addresses over the LXC bridge
  // ========================
  // The `<pkg>.startos` DNS is gone in 2.0 — containers reach each other over
  // the bridge. Each resolver is a reactive `.const()` keyed on the dependency's
  // assigned external port: it re-runs main on dependency install / uninstall /
  // port-change, but never on a dependency update. When a dependency is absent
  // the resolver is null and we omit its value (the file-model fields are
  // optional), letting the app fail into a red health check; the `.const()`
  // heals it once the dependency appears.

  const btcRpc = await bitcoindRpcBridge(effects).const()
  const btcPeer = await bitcoindPeerBridge(effects).const()
  await nbxplorerConfig.merge(
    effects,
    {
      'btc.rpc.url': btcRpc ?? undefined,
      'btc.node.endpoint': btcPeer ?? undefined,
    },
    { allowWriteAfterConst: true },
  )

  // Tor SOCKS over the bridge. The allocator-guaranteed 9050 fallback keeps this
  // constant across tor install/update/uninstall, so it never restarts BTCPay; a
  // dead address is just connection-refused, so onion routing is always safe to enable.
  const btcpayPatch: {
    socksendpoint: string
    btclightning?: string
    XMR_daemon_uri?: string
  } = {
    socksendpoint: await torSocksBridge(effects).const(),
  }
  if (isLnd(config.btclightning)) {
    const restUrl = await lndRestBridge(effects).const()
    if (restUrl) btcpayPatch.btclightning = lndConnectionString(restUrl)
  }
  if (getEnabledAltcoin('xmr', config.chains)) {
    btcpayPatch.XMR_daemon_uri =
      (await monerodRpcBridge(effects).const()) ?? undefined
  }
  await btcpayConfig.merge(effects, btcpayPatch, { allowWriteAfterConst: true })

  // ========================
  // Dependency mounts
  // ========================

  let mounts = sdk.Mounts.of()
    .mountVolume({
      volumeId: 'btcpayserver',
      subpath: null,
      mountpoint: dataDir,
      readonly: false,
    })
    .mountVolume({
      volumeId: 'btcpayserver',
      subpath: 'Plugins',
      mountpoint: '/root/.btcpayserver/Plugins',
      readonly: false,
    })
    .mountVolume({
      volumeId: 'nbxplorer',
      subpath: null,
      mountpoint: nbxMountpoint,
      readonly: false,
    })

  if (getEnabledAltcoin('xmr', config.chains)) {
    mounts = mounts.mountDependency<typeof monerodManifest>({
      dependencyId: 'monerod',
      volumeId: 'main',
      subpath: null,
      mountpoint: '/mnt/monero',
      readonly: false,
    })
  }

  if (isLnd(config.btclightning)) {
    mounts = mounts.mountDependency<typeof lndManifest>({
      dependencyId: 'lnd',
      volumeId: 'main',
      subpath: null,
      mountpoint: lndMountpoint,
      readonly: true,
    })
  } else if (isCln(config.btclightning)) {
    mounts = mounts.mountDependency<typeof clnManifest>({
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

  const btcpaySub = sdk.SubContainer.of(
    effects,
    { imageId: 'btcpay' },
    mounts,
    'btcpay',
  )

  const nbxSub = sdk.SubContainer.of(
    effects,
    { imageId: 'nbx' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'nbxplorer',
        subpath: null,
        mountpoint: dataDir,
        readonly: false,
      })
      .mountDependency<typeof bitcoinManifest>({
        dependencyId: 'bitcoind',
        volumeId: 'main',
        subpath: null,
        mountpoint: bitcoindMountpoint,
        readonly: false,
      }),
    'nbx',
  )

  const pgMounts = sdk.Mounts.of().mountVolume({
    volumeId: 'db',
    subpath: null,
    mountpoint: PG_MOUNT,
    readonly: false,
  })

  const postgresSub = sdk.SubContainer.of(
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
              message: null,
            }
          }
          return {
            result: 'success',
            message: null,
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
          NBXPLORER_DATADIR: dataDir,
        },
        sigtermTimeout: 60_000,
      },
      ready: {
        display: i18n('UTXO Tracker'),
        gracePeriod: 30_000,
        fn: async () =>
          sdk.healthCheck.checkPortListening(effects, nbxPort, {
            successMessage: i18n('The explorer is reachable'),
            errorMessage: i18n('The explorer is unreachable'),
          }),
      },
      requires: ['postgres'],
    })
    .addOneshot('reset-start-height', {
      subcontainer: nbxSub,
      exec: {
        fn: async () => {
          await nbxplorerConfig.merge(effects, {
            'btc.rescan': nbxConfigDefaults['btc.rescan'],
            'btc.startheight': nbxConfigDefaults['btc.startheight'],
          })
          return null
        },
      },
      requires: ['nbxplorer'],
    })
    .addHealthCheck('utxo-sync', {
      ready: {
        display: i18n('UTXO Tracker Sync'),
        fn: async () => {
          const nbxRootfs = await nbxSub.rootfs
          const auth = await readFile(`${nbxRootfs}${dataDir}/Main/.cookie`, {
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
              message: i18n('Failed to get UTXO tracker status.'),
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
          BTCPAY_DATADIR: dataDir,
          BTCPAY_SHOPIFY_PLUGIN_DEPLOYER: `http://127.0.0.1:${shopifyPort}/`,
          LC_ALL: 'C',
        },
        sigtermTimeout: 60_000,
      },
      ready: {
        display: i18n('Web Interface'),
        gracePeriod: 60_000,
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://127.0.0.1:${uiPort}/api/v1/health`,
            {
              successMessage: i18n('The web interface is reachable'),
              errorMessage: i18n('The web interface is unreachable'),
            },
          ),
      },
      requires: ['nbxplorer', 'postgres'],
    })

  // Add Shopify app daemon if enabled
  if (shopifyEnabled) {
    return daemons.addDaemon('shopify', {
      subcontainer: sdk.SubContainer.of(
        effects,
        { imageId: 'shopify' },
        null,
        'shopify',
      ),
      exec: {
        command: sdk.useEntrypoint(),
      },
      ready: {
        display: i18n('Shopify Plugin'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, shopifyPort, {
            successMessage: i18n('The Shopify app is running'),
            errorMessage: i18n('The Shopify app is not running'),
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
      message: i18n('Synced to the tip of the Bitcoin blockchain'),
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
      message: i18n('Failed to connect to Bitcoin node.'),
    }
  }
}
