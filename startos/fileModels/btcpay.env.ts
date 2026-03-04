import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import {
  clnConnectionString,
  lndConnectionString,
  uiPort,
  xmrDaemonUri,
  xmrWalletDaemonUri,
  xmrWalletDir,
} from '../utils'

const btcpayBind = `0.0.0.0:${uiPort}` as const

const shape = z.object({
  BTCPAY_NETWORK: z.literal('mainnet').catch('mainnet'),
  BTCPAY_CHAINS: z.enum(['btc', 'btc,xmr']).catch('btc'),
  BTCPAY_BIND: z.literal(btcpayBind).catch(btcpayBind),
  BTCPAY_BTCEXPLORERCOOKIEFILE: z
    .literal('/root/.nbxplorer/Main/.cookie')
    .catch('/root/.nbxplorer/Main/.cookie'),
  BTCPAY_SOCKSENDPOINT: z.literal('startos:9050').catch('startos:9050'),
  BTCPAY_BTCLIGHTNING: z
    .enum([lndConnectionString, clnConnectionString])
    .optional(),
  // alts
  BTCPAYGEN_CRYPTO2: z.literal('xmr').optional(),
  BTCPAY_XMR_DAEMON_URI: z.literal(xmrDaemonUri).catch(xmrDaemonUri),
  BTCPAY_XMR_DAEMON_USERNAME: z.literal('').catch(''),
  BTCPAY_XMR_DAEMON_PASSWORD: z.literal('').catch(''),
  BTCPAY_XMR_WALLET_DAEMON_URI: z.literal(xmrWalletDaemonUri).catch(xmrWalletDaemonUri),
  BTCPAY_XMR_WALLET_DAEMON_WALLETDIR: z.literal(xmrWalletDir).catch(xmrWalletDir),
})

export const BTCPSEnv = FileHelper.env(
  {
    base: sdk.volumes.main,
    subpath: '/btcpay.env',
  },
  shape,
)
