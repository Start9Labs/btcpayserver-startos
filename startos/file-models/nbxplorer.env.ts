import { FileHelper } from '@start9labs/start-sdk'
import { dotenvToJson, jsonToDotenv } from '../utils'

export type NBXEnv = {
  NBXPLORER_NETWORK: string
  NBXPLORER_PORT: string
  NBXPLORER_BTCNODEENDPOINT: string
  NBXPLORER_BTCRPCURL: string
  NBXPLORER_BTCRPCUSER: string
  NBXPLORER_BTCRPCPASSWORD: string
  NBXPLORER_RESCAN: string
  NBXPLORER_STARTHEIGHT: string
  [key: string]: string
}

export const NBXplorerEnvFile = FileHelper.raw(
  '/media/startos/volumes/main/nbxplorer.env',
  jsonToDotenv<NBXEnv>,
  dotenvToJson<NBXEnv>,
)
