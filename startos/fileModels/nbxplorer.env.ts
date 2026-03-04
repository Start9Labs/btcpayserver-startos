import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { nbxPort } from '../utils'

const shape = z.object({
  NBXPLORER_NETWORK: z.literal('mainnet').catch('mainnet'),
  NBXPLORER_PORT: z.literal(`${nbxPort}`).catch(`${nbxPort}`),
  NBXPLORER_BTCNODEENDPOINT: z
    .literal('bitcoind.startos:8333')
    .catch('bitcoind.startos:8333'),
  NBXPLORER_BTCRPCURL: z
    .literal('http://bitcoind.startos:8332/')
    .catch('http://bitcoind.startos:8332/'),
  NBXPLORER_BTCRESCAN: z.enum(['0', '1']).catch('0'),
  NBXPLORER_BTCSTARTHEIGHT: z.string().catch('-1'),
  NBXPLORER_BTCRPCCOOKIEFILE: z
    .literal('/root/.bitcoin/.cookie')
    .catch('/root/.bitcoin/.cookie'),
  NBXPLORER_DATADIR: z.literal('/datadir').catch('/datadir'),
})

export const nbxEnvDefaults = {
  NBXPLORER_BTCRESCAN: '0' as const,
  NBXPLORER_BTCSTARTHEIGHT: '-1',
}

export const NBXplorerEnv = FileHelper.env(
  {
    base: sdk.volumes.main,
    subpath: '/nbxplorer.env',
  },
  shape,
)
