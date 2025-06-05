import { FileHelper, matches } from '@start9labs/start-sdk'
import { nbxEnvDefaults } from '../utils'
const { object, string, literal } = matches

const {
  NBXPLORER_NETWORK,
  NBXPLORER_PORT,
  NBXPLORER_BTCNODEENDPOINT,
  NBXPLORER_BTCRPCURL,
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
})

export const NBXplorerEnv = FileHelper.env(
  { volumeId: 'main', subpath: '/nbxplorer.env' },
  shape,
)

export type NBXEnv = typeof shape._TYPE
