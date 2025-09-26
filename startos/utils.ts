import { Effects } from '@start9labs/start-sdk/base/lib/Effects'
import { sdk } from './sdk'
import { utils } from '@start9labs/start-sdk'
import { bitcoinConfDefaults } from 'bitcoind-startos/startos/utils'
import { Client } from 'pg'

export const uiPort = 23000
export const nbxPort = 24444
export const webInterfaceId = 'webui'
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'
export const btcMountpoint = '/mnt/bitcoind'
export const nbxCookieFile = '/datadir/Main/.cookie'

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
        return h.hostname.value
      } else {
        return `${h.hostname.value}:${h.hostname.sslPort}`
      }
    }) || []
  )
}

export async function query(
  effects: Effects,
  statement: string,
  values?: string[],
) {
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
    },
  )
}

export const nginxConf = `
map $http_x_forwarded_proto $proxy_x_forwarded_proto {
  default $http_x_forwarded_proto;
  ''      $scheme;
}
proxy_set_header Host $http_host;
proxy_set_header X-Forwarded-Proto $proxy_x_forwarded_proto;

server_names_hash_bucket_size 128;
proxy_buffer_size          128k;
proxy_buffers              4 256k;
proxy_busy_buffers_size    256k;
client_header_buffer_size 500k;
large_client_header_buffers 4 500k;

server {
  listen 80 default_server;
  listen [::]:80 default_server;
  client_max_body_size 100M;

  location /notifications/subscribeupdates {
          proxy_pass http://0.0.0.0:23000/notifications/subscribeupdates;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
          proxy_set_header X-Forwarded-Proto http;
  }

  location / {
          proxy_pass http://0.0.0.0:23000;
          proxy_set_header X-Forwarded-Proto https;
          proxy_set_header Host $http_host;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
  }
}
`
