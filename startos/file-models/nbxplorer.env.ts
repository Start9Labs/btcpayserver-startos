import { FileHelper, matches } from '@start9labs/start-sdk'
import { dotenvToJson, jsonToDotenv } from '../utils'
const { object, string } = matches

// ts matches will preserve existing keys, wont throw an error for extra keys
const shape = object({
  NBXPLORER_NETWORK: string,
  NBXPLORER_PORT: string,
  NBXPLORER_BTCNODEENDPOINT: string,
  NBXPLORER_BTCRPCURL: string,
  NBXPLORER_BTCRPCUSER: string,
  NBXPLORER_BTCRPCPASSWORD: string,
  NBXPLORER_RESCAN: string,
  NBXPLORER_STARTHEIGHT: string,
})

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
  (obj) => shape.unsafeCast(obj),
)
