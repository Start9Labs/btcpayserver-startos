import { matches, FileHelper } from '@start9labs/start-sdk'
import { btcpsEnvDefaults } from '../utils'
import { env } from './EnvFileHelper'
const { object, string, literal } = matches

const {
  BTCPAY_NETWORK,
  BTCPAY_CHAINS,
  BTCPAY_BIND,  
  BTCPAY_BTCEXPLORERCOOKIEFILE,
  BTCPAY_SOCKSENDPOINT,
} = btcpsEnvDefaults

const shape = object({
  BTCPAY_NETWORK: literal(BTCPAY_NETWORK).onMismatch(BTCPAY_NETWORK),
  BTCPAY_CHAINS: string.onMismatch(BTCPAY_CHAINS),
  BTCPAY_BIND: literal(BTCPAY_BIND).onMismatch(BTCPAY_BIND),  
  BTCPAY_BTCEXPLORERCOOKIEFILE: literal(
    BTCPAY_BTCEXPLORERCOOKIEFILE,
  ).onMismatch(BTCPAY_BTCEXPLORERCOOKIEFILE),
  BTCPAY_SOCKSENDPOINT:
    literal(BTCPAY_SOCKSENDPOINT).onMismatch(BTCPAY_SOCKSENDPOINT),
  BTCPAY_BTCLIGHTNING: string.optional(),
  BTCPAYGEN_CRYPTO2: string.optional(),
  BTCPAY_XMR_DAEMON_URI: string.optional(),
  BTCPAY_XMR_DAEMON_USERNAME: string.optional(),
  BTCPAY_XMR_DAEMON_PASSWORD: string.optional(),
  BTCPAY_XMR_WALLET_DAEMON_URI: string.optional(),
  BTCPAY_XMR_WALLET_DAEMON_WALLETDIR: string.optional(),
})

// @todo re-enable when FileHelper.env is fixed
// export const BTCPSEnv = FileHelper.env(
//   { volumeId: 'main', subpath: '/btcpay.env' },
//   shape,
// )
export const BTCPSEnv = env(
  { volumeId: 'main', subpath: '/btcpay.env' },
  shape,
)
