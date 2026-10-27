import { T } from '@start9labs/start-sdk'
import { readFile } from 'fs/promises'
import {
  peerLocalHostId as btcPeerLocalHostId,
  peerPortLocal as btcPeerPortLocal,
  rpcHostId as btcRpcHostId,
  rpcPort as btcRpcPort,
} from 'bitcoin-core-startos/startos/utils'
import {
  controlHostId as lndControlHostId,
  restPort as lndRestPort,
} from 'lnd-startos/startos/interfaces'
import {
  rpcRestrictedHostId as xmrRpcHostId,
  rpcRestrictedPort as xmrRpcPort,
} from 'monerod-startos/startos/utils'
import {
  apiHostId as eclairApiHostId,
  apiPort as eclairApiPort,
} from 'eclair-startos/startos/utils'
import { socksHostId, socksPort } from 'tor-startos/startos/utils'
import { sdk } from './sdk'

// Container mountpoints
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'
export const eclairMountpoint = '/mnt/eclair'
export const nbxMountpoint = '/root/.nbxplorer'
export const bitcoindMountpoint = '/root/.bitcoin'
export const dataDir = '/datadir'

// Host ids (the `sdk.MultiHost.of` groups) — distinct from the interface ids
// exported on them. Used for `sdk.host.getOwn`/`get` lookups.
export const mainHostId = 'main'
export const mainInterfaceId = 'main'

// Ports
export const uiPort = 23000
export const nbxPort = 24444
export const shopifyPort = 5000
export const xmrWalletRpcPort = 18082

// Derived paths
export const nbxCookiePath = `${nbxMountpoint}/Main/.cookie`
export const bitcoindCookiePath = `${bitcoindMountpoint}/.cookie`
export const xmrWalletSubpath = 'btcpayserver/altcoins/monero/wallets'
export const xmrWalletDir = `${dataDir}/${xmrWalletSubpath}`

export const xmrWalletDaemonUri = `http://127.0.0.1:${xmrWalletRpcPort}`

// Postgres
export const PG_MOUNT = '/var/lib/postgresql'

export function pgConnectionString(appName: string, database: string) {
  return `User ID=postgres;Host=127.0.0.1;Port=5432;Application Name=${appName};Database=${database}`
}

export const nbxPostgres = pgConnectionString('nbxplorer', 'nbxplorer')
export const btcpayPostgres = pgConnectionString('btcpayserver', 'btcpayserver')

// Migration-only placeholder for the LND `btclightning` connection string: the
// `up` migration writes it to preserve a pre-existing LND selection, and main
// heals it with the real bridge address on first start. Absent dependencies are
// otherwise omitted (optional file-model fields), never dialed at a fake address.
export const LND_REST_FALLBACK = 'https://127.0.0.1:8080'

// Lightning connection strings written to btcpay's settings.config. CLN is a
// local unix socket (static); LND is reached over the LXC bridge, so its
// `server=` address is resolved at runtime. Node selection is discriminated by
// the stable `type=` prefix, since the LND address varies per install.
export const clnConnectionString = `type=clightning;server=unix:/${clnMountpoint}/bitcoin/lightning-rpc`
const LND_CONN_PREFIX = 'type=lnd-rest'
export function lndConnectionString(restUrl: string) {
  return `${LND_CONN_PREFIX};server=${restUrl}/;macaroonfilepath=${lndMountpoint}/data/chain/bitcoin/mainnet/admin.macaroon;allowinsecure=true`
}
// Eclair authenticates with an empty username and a password, so only `password`
// is set. `bitcoin-host`/`bitcoin-auth` are accepted by BTCPay's parser but never
// reach EclairLightningClient, so passing them would buy nothing.
const ECLAIR_CONN_PREFIX = 'type=eclair'
export function eclairConnectionString(apiUrl: string, password?: string) {
  const base = `${ECLAIR_CONN_PREFIX};server=${apiUrl}/`
  return password ? `${base};password=${password}` : base
}
export const isLnd = (s?: string | null) => !!s?.startsWith(LND_CONN_PREFIX)
export const isCln = (s?: string | null) => s === clnConnectionString
export const isEclair = (s?: string | null) =>
  !!s?.startsWith(ECLAIR_CONN_PREFIX)

export function getEnabledAltcoin(altcoin: string, list: string) {
  return list.split(',').includes(altcoin)
}

/**
 * btcpayserver's own Web UI `host:port` over the bridge (for the monerod
 * block-notify callback). No `packageId` — the lookup is against our own host.
 * `ssl: false` because the UI binds `protocol: 'http'`, which publishes both a
 * plaintext and a TLS address, and the callback curls the plaintext one.
 */
export const selfUiBridge = (effects: T.Effects) =>
  sdk.host.getBridgeAddress(effects, {
    hostId: mainHostId,
    internalPort: uiPort,
    ssl: false,
  })

/** Tor's SOCKS proxy `host:port` over the bridge. The 9050 fallback keeps it constant, so main never restarts on tor churn. */
export const torSocksBridge = (effects: T.Effects) =>
  sdk.host.getBridgeAddress(effects, {
    packageId: 'tor',
    hostId: socksHostId,
    internalPort: socksPort,
    fallbackPort: socksPort,
  })

/** LND's REST base URL over the bridge; `null` until LND's first wallet unlock. */
export const lndRestBridge = (effects: T.Effects) => {
  const addr = sdk.host.getBridgeAddress(effects, {
    packageId: 'lnd',
    hostId: lndControlHostId,
    internalPort: lndRestPort,
  })
  const url = (h: string | null) => h && `https://${h}`
  return {
    const: async () => url(await addr.const()),
    once: async () => url(await addr.once()),
  }
}

/** Eclair's API base URL over the bridge; `null` when Eclair isn't installed. */
export const eclairApiBridge = (effects: T.Effects) => {
  const addr = sdk.host.getBridgeAddress(effects, {
    packageId: 'eclair',
    hostId: eclairApiHostId,
    internalPort: eclairApiPort,
    ssl: false,
  })
  const url = (h: string | null) => h && `http://${h}`
  return {
    const: async () => url(await addr.const()),
    once: async () => url(await addr.once()),
  }
}

/** bitcoind's RPC URL over the bridge; `null` when bitcoind isn't installed. */
export const bitcoindRpcBridge = (effects: T.Effects) => {
  const addr = sdk.host.getBridgeAddress(effects, {
    packageId: 'bitcoind',
    hostId: btcRpcHostId,
    internalPort: btcRpcPort,
    ssl: false,
  })
  return {
    const: async () => {
      const h = await addr.const()
      return h && `http://${h}/`
    },
  }
}

/**
 * bitcoind's P2P `host:port` over the bridge, for NBXplorer's
 * `btc.node.endpoint`; `null` when bitcoind isn't installed.
 *
 * Resolves bitcoind's `peer-local` host, not `peer`. NBXplorer pulls blocks
 * over this connection, and `peer` maps onto the plain `bind` that anonymous
 * inbound peers share, where the connection earns no permissions: bitcoind may
 * evict it to seat another peer, or cut it off under `maxuploadtarget`.
 * `peer-local` is whitelisted (noban + download), so neither applies.
 */
export const bitcoindPeerBridge = (effects: T.Effects) =>
  sdk.host.getBridgeAddress(effects, {
    packageId: 'bitcoind',
    hostId: btcPeerLocalHostId,
    internalPort: btcPeerPortLocal,
  })

/** monerod's restricted-RPC URL over the bridge; `null` when monerod isn't installed. */
export const monerodRpcBridge = (effects: T.Effects) => {
  const addr = sdk.host.getBridgeAddress(effects, {
    packageId: 'monerod',
    hostId: xmrRpcHostId,
    internalPort: xmrRpcPort,
    ssl: false,
  })
  return {
    const: async () => {
      const h = await addr.const()
      return h && `http://${h}`
    },
  }
}

// Outlasts NBXplorer's own stall watchdog (7–12 min), which never runs in CoreSynching.
const nbxStallMs = 15 * 60_000

const disconnectNbx = async (rpcUrl: string, cookiePath: string) => {
  const auth = Buffer.from(
    (await readFile(cookiePath, 'utf8')).trim(),
  ).toString('base64')
  const rpc = async (method: string, params: unknown[] = []) => {
    const body = await fetch(rpcUrl, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}` },
      body: JSON.stringify({ jsonrpc: '2.0', id: 0, method, params }),
      signal: AbortSignal.timeout(10_000),
    }).then((res) => res.json())
    if (body.error) throw new Error(`${method}: ${body.error.message}`)
    return body.result
  }
  const peers: { id: number; subver: string }[] = await rpc('getpeerinfo')
  for (const { id } of peers.filter((p) => p.subver.startsWith('NBXplorer-')))
    await rpc('disconnectnode', ['', id])
}

/** NBXplorer ignores block `inv`s, so a catch-up bitcoind announces that way strands it in CoreSynching; a dropped P2P link restarts its sync. */
export const nbxStallWatchdog = (rpcUrl: string | null) => {
  let progress = { height: NaN, at: Date.now() }
  let reconnectedAt = 0
  return async (
    status: {
      isFullySynched: boolean
      syncHeight: number
      bitcoinStatus?: { isSynched: boolean }
    },
    cookiePath: string,
  ) => {
    if (
      !status.bitcoinStatus?.isSynched ||
      status.isFullySynched ||
      status.syncHeight !== progress.height
    ) {
      progress = { height: status.syncHeight, at: Date.now() }
      return
    }
    if (
      !rpcUrl ||
      Date.now() - Math.max(progress.at, reconnectedAt) < nbxStallMs
    )
      return
    reconnectedAt = Date.now()
    console.warn(
      `UTXO tracker stuck at block ${status.syncHeight} while Bitcoin is synced; reconnecting it to Bitcoin`,
    )
    await disconnectNbx(rpcUrl, cookiePath).catch(console.error)
  }
}
