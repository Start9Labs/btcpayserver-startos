import { Effects } from '@start9labs/start-sdk/base/lib/Effects'
import { sdk } from './sdk'
import { utils } from '@start9labs/start-sdk'
import { bitcoinConfDefaults } from 'bitcoind-startos/startos/utils'

export const uiPort = 23000
export const webInterfaceId = 'webui'
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'
export const btcMountpoint = '/mnt/bitcoind'

export const btcpsEnvDefaults = {
  BTCPAY_NETWORK: 'mainnet',
  BTCPAY_CHAINS: 'btc',
  BTCPAY_BIND: '0.0.0.0:23000',
  BTCPAY_NBXPLORER_COOKIE: `${btcMountpoint}${bitcoinConfDefaults.rpccookiefile}`,
  BTCPAY_SOCKSENDPOINT: 'startos:9050',
}

export const nbxEnvDefaults = {
  NBXPLORER_NETWORK: 'mainnet',
  NBXPLORER_PORT: '24444',
  NBXPLORER_BTCNODEENDPOINT: 'bitcoind.startos:8333',
  NBXPLORER_BTCRPCURL: 'bitcoind.startos:8332',
}

export function getRandomPassword() {
  return utils.getDefaultString({
    charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
    len: 22,
  })
}

export function getEnabledAltcoin(altcoin: string, list: string) {
  return list.split(',').includes(altcoin)
}

export async function getWebHostnames(effects: Effects): Promise<string[]> {
  const webInterface = await sdk.serviceInterface
    .getOwn(effects, webInterfaceId)
    .const()

  return (
    webInterface?.addressInfo?.hostnames.map((h) => {
      if (h.kind === 'onion') {
        return h.hostname.value
      } else if (h.hostname.kind === 'domain') {
        return h.hostname.domain
      } else {
        return `${h.hostname.value}:${h.hostname.sslPort}`
      }
    }) || []
  )
}

export async function query(effects: Effects, statement: string) {
  return sdk.SubContainer.withTemp(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/datadir',
      readonly: false,
    }),
    'query-postgres',
    async (sub) => {
      const res = await sub.exec([
        'psql',
        '-U',
        'postgres',
        '-h',
        'localhost',
        '-d',
        'btcpayserver',
        '-t',
        '-c',
        `"${statement}"`,
      ])
      if (res.stderr) throw new Error(res.stderr.toString())
      return res.stdout.toString()
    },
  )
}
