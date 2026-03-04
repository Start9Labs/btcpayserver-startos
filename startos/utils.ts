import { sdk } from './sdk'

export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'

export const lndConnectionString = `type=lnd-rest;server=https://lnd.startos:8080/;macaroonfilepath=${lndMountpoint}/data/chain/bitcoin/mainnet/admin.macaroon;allowinsecure=true`
export const clnConnectionString = `type=clightning;server=unix:/${clnMountpoint}/bitcoin/lightning-rpc`

export const uiPort = 23000
export const nbxPort = 24444

export const xmrDaemonUri = 'http://monerod.embassy:18089'
export const xmrWalletDaemonUri = 'http://127.0.0.1:18082'
export const xmrWalletDir = '/datadir/btcpayserver/altcoins/monero/wallets'

export const PG_MOUNT = '/var/lib/postgresql'

export const pgMounts = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: 'postgresql',
  mountpoint: PG_MOUNT,
  readonly: false,
})

export function getEnabledAltcoin(altcoin: string, list: string) {
  return list.split(',').includes(altcoin)
}
