import { T } from '@start9labs/start-sdk'
import {
  peerHostId as btcPeerHostId,
  peerPortInternal as btcPeerPort,
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
import { socksHostId, socksPort } from 'tor-startos/startos/utils'
import { sdk } from './sdk'

// Container mountpoints
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'
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

// Derived paths
export const nbxCookiePath = `${nbxMountpoint}/Main/.cookie`
export const bitcoindCookiePath = `${bitcoindMountpoint}/.cookie`
export const xmrWalletDir = `${dataDir}/btcpayserver/altcoins/monero/wallets`

// btcpay's own bundled Monero wallet-rpc (loopback, not a dependency).
export const xmrWalletDaemonUri = 'http://127.0.0.1:18082'

// Postgres
export const PG_MOUNT = '/var/lib/postgresql'

export function pgConnectionString(appName: string, database: string) {
  return `User ID=postgres;Host=127.0.0.1;Port=5432;Application Name=${appName};Database=${database}`
}

export const nbxPostgres = pgConnectionString('nbxplorer', 'nbxplorer')
export const btcpayPostgres = pgConnectionString('btcpayserver', 'btcpayserver')

// Loopback placeholders: the file-model `.catch()` defaults, and the value
// written when a dependency isn't installed. Each is a dead address
// (connection-refused) that the reactive bridge resolvers below heal at startup
// once the dependency appears.
export const bitcoindRpcUrl = 'http://127.0.0.1:8332/'
export const bitcoindPeerEndpoint = '127.0.0.1:8333'
export const xmrDaemonUri = 'http://127.0.0.1:18089'
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
export const isLnd = (s?: string | null) => !!s?.startsWith(LND_CONN_PREFIX)
export const isCln = (s?: string | null) => s === clnConnectionString

export function getEnabledAltcoin(altcoin: string, list: string) {
  return list.split(',').includes(altcoin)
}

/**
 * Bridge address (`<osIp>:<assigned external port>`) of a dependency's binding,
 * as a minimal reactive value. Chain `.const()` in main: the mapped string only
 * changes when the assigned port itself does, so main restarts exactly on
 * dependency install / uninstall / port-change and never on dependency updates.
 * Chain `.once()` in an action context. `fallbackPort` keeps the value non-null
 * while the dependency is absent — sanctioned only for tor's allocator-
 * guaranteed SOCKS 9050. Drop-in for the planned SDK `sdk.host.getBridgeAddress`.
 */
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort: number
  },
): { const(): Promise<string>; once(): Promise<string> }
export function bridgeAddress(
  effects: T.Effects,
  opts: { packageId: string; hostId: string; internalPort: number },
): { const(): Promise<string | null>; once(): Promise<string | null> }
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort?: number
  },
) {
  const watchable = async () => {
    const osIp = await sdk.getOsIp(effects)
    return sdk.host.get(
      effects,
      { packageId: opts.packageId, hostId: opts.hostId },
      (host) => {
        const port =
          host?.bindings[opts.internalPort]?.net.assignedPort ??
          opts.fallbackPort
        return port != null ? `${osIp}:${port}` : null
      },
    )
  }
  return {
    const: async () => (await watchable()).const(),
    once: async () => (await watchable()).once(),
  }
}

/** btcpayserver's own Web UI `host:port` over the bridge (for the monerod block-notify callback). */
export const selfUiBridge = (effects: T.Effects) => ({
  const: async () => {
    const osIp = await sdk.getOsIp(effects)
    return sdk.host
      .getOwn(effects, mainHostId, (host) => {
        const port = host?.bindings[uiPort]?.net.assignedPort
        return port != null ? `${osIp}:${port}` : null
      })
      .const()
  },
})

/** Tor's SOCKS proxy `host:port` over the bridge. The 9050 fallback keeps it constant, so main never restarts on tor churn. */
export const torSocksBridge = (effects: T.Effects) =>
  bridgeAddress(effects, {
    packageId: 'tor',
    hostId: socksHostId,
    internalPort: socksPort,
    fallbackPort: socksPort,
  })

/** LND's REST base URL over the bridge; `null` until LND's first wallet unlock. */
export const lndRestBridge = (effects: T.Effects) => {
  const addr = bridgeAddress(effects, {
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

/** bitcoind's RPC URL over the bridge; `null` when bitcoind isn't installed. */
export const bitcoindRpcBridge = (effects: T.Effects) => {
  const addr = bridgeAddress(effects, {
    packageId: 'bitcoind',
    hostId: btcRpcHostId,
    internalPort: btcRpcPort,
  })
  return {
    const: async () => {
      const h = await addr.const()
      return h && `http://${h}/`
    },
  }
}

/** bitcoind's P2P `host:port` over the bridge; `null` when bitcoind isn't installed. */
export const bitcoindPeerBridge = (effects: T.Effects) =>
  bridgeAddress(effects, {
    packageId: 'bitcoind',
    hostId: btcPeerHostId,
    internalPort: btcPeerPort,
  })

/** monerod's restricted-RPC URL over the bridge; `null` when monerod isn't installed. */
export const monerodRpcBridge = (effects: T.Effects) => {
  const addr = bridgeAddress(effects, {
    packageId: 'monerod',
    hostId: xmrRpcHostId,
    internalPort: xmrRpcPort,
  })
  return {
    const: async () => {
      const h = await addr.const()
      return h && `http://${h}`
    },
  }
}
