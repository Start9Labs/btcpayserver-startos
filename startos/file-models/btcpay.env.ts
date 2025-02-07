import { matches, FileHelper } from '@start9labs/start-sdk'
import { dotenvToJson, jsonToDotenv } from '../utils'
const { object, string } = matches

const shape = object({
  BTCPAY_NETWORK: string,
  BTCPAY_BIND: string,
  BTCPAY_NBXPLORER_COOKIE: string,
  BTCPAY_SOCKSENDPOINT: string,
  BTCPAY_HOST: string,
  REVERSEPROXY_DEFAULT_HOST: string.optional(),
  BTCPAY_ADDITIONAL_HOSTS: string,
  BTCPAY_BTCLIGHTNING: string.optional(),
})

export type BTCPSEnv = {
  BTCPAY_NETWORK: string
  BTCPAY_BIND: string
  BTCPAY_NBXPLORER_COOKIE: string
  BTCPAY_SOCKSENDPOINT: string
  BTCPAY_HOST: string
  REVERSEPROXY_DEFAULT_HOST?: string
  BTCPAY_ADDITIONAL_HOSTS: string
  BTCPAY_BTCLIGHTNING?: string
  [key: string]: string | undefined
}

export const btcpsEnvFile = FileHelper.raw(
  '/media/startos/volumes/main/btcpay.env',
  jsonToDotenv<BTCPSEnv>,
  dotenvToJson<BTCPSEnv>,
  (obj) => shape.unsafeCast(obj),
)
