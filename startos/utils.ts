import { T, utils } from '@start9labs/start-sdk'
import {
  peerHostId as btcPeerHostId,
  peerInterfaceId as btcPeerInterfaceId,
  rpcHostId as btcRpcHostId,
  rpcInterfaceId as btcRpcInterfaceId,
} from 'bitcoin-core-startos/startos/utils'
import {
  controlHostId as lndControlHostId,
  lndconnectRestId,
} from 'lnd-startos/startos/interfaces'
import {
  rpcRestrictedHostId as xmrRpcHostId,
  rpcRestrictedInterfaceId as xmrRpcInterfaceId,
} from 'monerod-startos/startos/utils'
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

// Legacy `.startos` values kept only as the file-model `.catch()` defaults; the
// live addresses are resolved over the LXC bridge and merged in at startup.
export const bitcoindRpcUrl = 'http://bitcoind.startos:8332/'
export const bitcoindPeerEndpoint = 'bitcoind.startos:8333'
export const xmrDaemonUri = 'http://monerod.startos:18089'
export const LND_REST_FALLBACK = 'https://lnd.startos:8080'

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
 * The IPv4 LXC-bridge `{ hostname, port }` for an interface on an already-resolved
 * host. Pure — call it INSIDE an `sdk.host` map fn so `.const()` narrows reactivity
 * to just this address. `.startos` DNS / container IPs are deprecated; containers
 * reach each other over this bridge. `ssl` narrows the http vs https variant.
 */
const bridgeAddr = (
  host: utils.FilledHost | null,
  interfaceId: string,
  ssl?: boolean,
) => {
  const iface =
    host &&
    Object.values(host.bindings)
      .flatMap((b) => Object.values(b.interfaces))
      .find((i) => i.id === interfaceId)
  return iface
    ? iface.addressInfo
        .filter({
          kind: 'bridge',
          predicate: (h) =>
            h.metadata.kind === 'ipv4' && (ssl === undefined || h.ssl === ssl),
        })
        .hostnames[0]
    : undefined
}

/** btcpayserver's own Web UI `host:port` over the bridge (for the monerod block-notify callback). */
export const selfUiBridge = (effects: T.Effects) =>
  sdk.host.getOwn(effects, mainHostId, (host) => {
    const h = bridgeAddr(host, mainInterfaceId, false)
    return h && `${h.hostname}:${h.port}`
  })

/** LND's REST base URL over the bridge (replaces `https://lnd.startos:8080`). */
export const lndRestBridge = (effects: T.Effects) =>
  sdk.host.get(
    effects,
    { hostId: lndControlHostId, packageId: 'lnd' },
    (host) => {
      const h = bridgeAddr(host, lndconnectRestId, true)
      return h && `https://${h.hostname}:${h.port}`
    },
  )

/** bitcoind's RPC URL over the bridge (replaces `http://bitcoind.startos:8332/`). */
export const bitcoindRpcBridge = (effects: T.Effects) =>
  sdk.host.get(
    effects,
    { hostId: btcRpcHostId, packageId: 'bitcoind' },
    (host) => {
      const h = bridgeAddr(host, btcRpcInterfaceId, false)
      return h && `http://${h.hostname}:${h.port}/`
    },
  )

/** bitcoind's P2P `host:port` over the bridge (replaces `bitcoind.startos:8333`). */
export const bitcoindPeerBridge = (effects: T.Effects) =>
  sdk.host.get(
    effects,
    { hostId: btcPeerHostId, packageId: 'bitcoind' },
    (host) => {
      const h = bridgeAddr(host, btcPeerInterfaceId)
      return h && `${h.hostname}:${h.port}`
    },
  )

/** monerod's restricted-RPC URL over the bridge (replaces `http://monerod.embassy:18089`). */
export const monerodRpcBridge = (effects: T.Effects) =>
  sdk.host.get(
    effects,
    { hostId: xmrRpcHostId, packageId: 'monerod' },
    (host) => {
      const h = bridgeAddr(host, xmrRpcInterfaceId, false)
      return h && `http://${h.hostname}:${h.port}`
    },
  )
