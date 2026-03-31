// Container mountpoints
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'
export const nbxMountpoint = '/root/.nbxplorer'
export const bitcoindMountpoint = '/root/.bitcoin'
export const dataDir = '/datadir'

export const lndConnectionString = `type=lnd-rest;server=https://lnd.startos:8080/;macaroonfilepath=${lndMountpoint}/data/chain/bitcoin/mainnet/admin.macaroon;allowinsecure=true`
export const clnConnectionString = `type=clightning;server=unix:/${clnMountpoint}/bitcoin/lightning-rpc`

// Derived paths
export const nbxCookiePath = `${nbxMountpoint}/Main/.cookie`
export const bitcoindCookiePath = `${bitcoindMountpoint}/.cookie`
export const xmrWalletDir = `${dataDir}/btcpayserver/altcoins/monero/wallets`

// Ports
export const uiPort = 23000
export const nbxPort = 24444
export const shopifyPort = 3000

// Bitcoin Core
export const bitcoindHost = 'bitcoind.startos'
export const bitcoindRpcUrl = `http://${bitcoindHost}:8332/`
export const bitcoindPeerEndpoint = `${bitcoindHost}:8333`

// Monero
export const xmrDaemonUri = 'http://monerod.embassy:18089'
export const xmrWalletDaemonUri = 'http://127.0.0.1:18082'

// Postgres
export const PG_MOUNT = '/var/lib/postgresql'

export function pgConnectionString(appName: string, database: string) {
  return `User ID=postgres;Host=127.0.0.1;Port=5432;Application Name=${appName};Database=${database}`
}

export const nbxPostgres = pgConnectionString('nbxplorer', 'nbxplorer')
export const btcpayPostgres = pgConnectionString('btcpayserver', 'btcpayserver')

export function getEnabledAltcoin(altcoin: string, list: string) {
  return list.split(',').includes(altcoin)
}
