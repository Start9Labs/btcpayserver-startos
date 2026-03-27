import { btcpayConfig } from '../fileModels/btcpay.config'
import { nbxplorerConfig } from '../fileModels/nbxplorer.config'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await storeJson.merge(effects, {})
  await btcpayConfig.merge(effects, {})
  await nbxplorerConfig.merge(effects, {})
})
