import { matches, FileHelper } from '@start9labs/start-sdk'
import { dotenvToJson, jsonToDotenv } from '../utils'
const { object, string } = matches

// @TODO can i use matches to have any additional optional keys?
const shape = object(
  {
    BTCPAY_NETWORK: string,
    BTCPAY_BIND: string,
    BTCPAY_NBXPLORER_COOKIE: string,
    BTCPAY_SOCKSENDPOINT: string,
    BTCPAY_HOST: string,
    REVERSEPROXY_DEFAULT_HOST: string,
    BTCPAY_ADDITIONAL_HOSTS: string,
    BTCPAY_BTCLIGHTNING: string,
  },
  ['BTCPAY_BTCLIGHTNING'],
)

export type BTCPSEnv = {
  BTCPAY_NETWORK: string
  BTCPAY_BIND: string
  BTCPAY_NBXPLORER_COOKIE: string
  BTCPAY_SOCKSENDPOINT: string
  BTCPAY_HOST: string
  REVERSEPROXY_DEFAULT_HOST: string
  BTCPAY_ADDITIONAL_HOSTS: string
  BTCPAY_BTCLIGHTNING?: string
  [key: string]: string | undefined
}

export const btcpsEnvFile = FileHelper.raw(
  '/media/startos/volumes/main/btcpay.env',
  jsonToDotenv<BTCPSEnv>,
  dotenvToJson<BTCPSEnv>,
)
