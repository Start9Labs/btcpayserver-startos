import { bitcoinConfDefaults } from 'bitcoind-startos/startos/utils'
import { Client } from 'pg'

export const uiPort = 23000
export const nbxPort = 24444
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'
export const btcMountpoint = '/mnt/bitcoind'
export const nbxCookieFile = '/datadir/nbxplorer/Main/.cookie'

export const btcpsEnvDefaults = {
  BTCPAY_NETWORK: 'mainnet',
  BTCPAY_CHAINS: 'btc',
  BTCPAY_BIND: '0.0.0.0:23000',
  BTCPAY_BTCEXPLORERCOOKIEFILE: nbxCookieFile,
  BTCPAY_SOCKSENDPOINT: 'startos:9050',
} as const

export const nbxEnvDefaults = {
  NBXPLORER_NETWORK: 'mainnet',
  NBXPLORER_PORT: '24444',
  NBXPLORER_BTCNODEENDPOINT: 'bitcoind.startos:8333', // p2p
  NBXPLORER_BTCRPCURL: 'http://bitcoind.startos:8332/', // rpc server url
  NBXPLORER_BTCRESCAN: '0',
  NBXPLORER_BTCSTARTHEIGHT: '-1',
  NBXPLORER_BTCRPCCOOKIEFILE: `${btcMountpoint}/${bitcoinConfDefaults.rpccookiefile}`,
  NBXPLORER_POSTGRES:
    'User ID=postgres;Host=localhost;Port=5432;Application Name=nbxplorer;Database=nbxplorer',
  NBXPLORER_DATADIR: '/datadir/nbxplorer',
} as const

export function getEnabledAltcoin(altcoin: string, list: string) {
  return list.split(',').includes(altcoin)
}

export async function query(statement: string, values?: string[]) {
  const postgresClient = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'btcpayserver',
    port: 5432,
  })
  try {
    await postgresClient.connect()
    const res = await postgresClient.query(statement, values)
    return res
  } catch (err) {
    console.error('Database error:', err)
  } finally {
    await postgresClient.end()
  }
}
