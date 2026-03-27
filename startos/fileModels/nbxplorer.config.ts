import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import {
  bitcoindCookiePath,
  bitcoindPeerEndpoint,
  bitcoindRpcUrl,
  nbxPort,
  nbxPostgres,
} from '../utils'

const shape = z.object({
  // Enforced
  port: z.literal(`${nbxPort}`).catch(`${nbxPort}`),
  bind: z.literal('127.0.0.1').catch('127.0.0.1'),
  mainnet: z.literal('1').catch('1'),
  'btc.rpc.url': z.literal(bitcoindRpcUrl).catch(bitcoindRpcUrl),
  'btc.rpc.user': z.undefined().optional().catch(undefined),
  'btc.rpc.password': z.undefined().optional().catch(undefined),
  'btc.rpc.cookiefile': z.literal(bitcoindCookiePath).catch(bitcoindCookiePath),
  'btc.node.endpoint': z
    .literal(bitcoindPeerEndpoint)
    .catch(bitcoindPeerEndpoint),
  postgres: z.literal(nbxPostgres).catch(nbxPostgres),

  // Configuration
  'btc.startheight': z.string().catch('-1'),
  'btc.rescan': z.enum(['0', '1']).catch('0'),
})

export const nbxConfigDefaults = {
  'btc.rescan': '0' as const,
  'btc.startheight': '-1',
}

export const nbxplorerConfig = FileHelper.ini(
  {
    base: sdk.volumes.nbxplorer,
    subpath: '/Main/settings.config',
  },
  shape,
  { bracketedArray: false },
)
