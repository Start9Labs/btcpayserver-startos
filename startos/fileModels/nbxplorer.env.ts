import { FileHelper, matches } from '@start9labs/start-sdk'
import { nbxEnvDefaults } from '../utils'
const { object, string, literal, literals, natural } = matches

const {
  NBXPLORER_NETWORK,
  NBXPLORER_PORT,
  NBXPLORER_BTCNODEENDPOINT,
  NBXPLORER_BTCRPCURL,
  NBXPLORER_BTCRESCAN,
  NBXPLORER_BTCSTARTHEIGHT,
  NBXPLORER_BTCRPCCOOKIEFILE,
  NBXPLORER_POSTGRES,
  NBXPLORER_DATADIR,
} = nbxEnvDefaults

// ts matches will preserve existing keys, wont throw an error for extra keys
const shape = object({
  NBXPLORER_NETWORK: literal(NBXPLORER_NETWORK).onMismatch(NBXPLORER_NETWORK),
  NBXPLORER_PORT: literal(NBXPLORER_PORT).onMismatch(NBXPLORER_PORT),
  NBXPLORER_BTCNODEENDPOINT: literal(NBXPLORER_BTCNODEENDPOINT).onMismatch(
    NBXPLORER_BTCNODEENDPOINT,
  ),
  NBXPLORER_BTCRPCURL:
    literal(NBXPLORER_BTCRPCURL).onMismatch(NBXPLORER_BTCRPCURL),
  NBXPLORER_BTCRESCAN: literals('0', '1').onMismatch(NBXPLORER_BTCRESCAN),
  NBXPLORER_BTCSTARTHEIGHT: string.onMismatch(NBXPLORER_BTCSTARTHEIGHT), // @TODO change string -> natural
  NBXPLORER_BTCRPCCOOKIEFILE: literal(NBXPLORER_BTCRPCCOOKIEFILE).onMismatch(
    NBXPLORER_BTCRPCCOOKIEFILE,
  ),
  NBXPLORER_POSTGRES:
    literal(NBXPLORER_POSTGRES).onMismatch(NBXPLORER_POSTGRES),
  NBXPLORER_DATADIR: literal(NBXPLORER_DATADIR).onMismatch(NBXPLORER_DATADIR),
})

export const NBXplorerEnv = FileHelper.env(
  { volumeId: 'main', subpath: '/nbxplorer.env' },
  shape,
)

export type NBXEnv = typeof shape._TYPE
