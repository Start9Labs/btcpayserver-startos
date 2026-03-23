import { BTCPSEnv } from '../fileModels/btcpay.env'
import { NBXplorerEnv } from '../fileModels/nbxplorer.env'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await storeJson.merge(effects, {})
  await BTCPSEnv.merge(effects, {})
  await NBXplorerEnv.merge(effects, {})
})
