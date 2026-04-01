import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import {
  clnConnectionString,
  lndConnectionString,
  btcpayPostgres,
  nbxCookiePath,
  nbxPostgres,
  uiPort,
  xmrDaemonUri,
  xmrWalletDaemonUri,
  xmrWalletDir,
} from '../utils'

const btcpayBind = `0.0.0.0:${uiPort}` as const

const shape = z.object({
  // Enforced
  network: z.literal('mainnet').catch('mainnet'),
  bind: z.literal(btcpayBind).catch(btcpayBind),
  btcexplorercookiefile: z.literal(nbxCookiePath).catch(nbxCookiePath),
  explorerpostgres: z
    .literal(nbxPostgres)
    .catch(nbxPostgres),
  postgres: z
    .literal(btcpayPostgres)
    .catch(btcpayPostgres),
  debuglog: z.literal('btcpay.log').catch('btcpay.log'),
  dockerdeployment: z.literal('false').catch('false'),
  XMR_daemon_uri: z.literal(xmrDaemonUri).catch(xmrDaemonUri),
  XMR_wallet_daemon_uri: z
    .literal(xmrWalletDaemonUri)
    .catch(xmrWalletDaemonUri),
  XMR_wallet_daemon_walletdir: z.literal(xmrWalletDir).catch(xmrWalletDir),
  'BTC.explorer.cookiefile': z.undefined().optional().catch(undefined),

  // Configuration
  socksendpoint: z.string().optional().catch('tor.startos:9050'),
  XMR_daemon_username: z.string().catch(''),
  XMR_daemon_password: z.string().catch(''),
  chains: z.enum(['btc', 'btc,xmr']).catch('btc'),
  btclightning: z
    .enum([lndConnectionString, clnConnectionString])
    .optional()
    .catch(undefined),
})

export const btcpayConfig = FileHelper.ini(
  {
    base: sdk.volumes.btcpayserver,
    subpath: '/Main/settings.config',
  },
  shape,
  { bracketedArray: false },
)
