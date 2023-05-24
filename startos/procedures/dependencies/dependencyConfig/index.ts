import { sdk } from '../../../sdk'
import { configSpec } from '../../config/spec'

export const dependencyConfig = sdk.setupDependencyConfig(configSpec, {
  bitcoind: bitcoindConfig,
  "btc-rpc-proxy": btcRpcProxyConfig,
  lnd: lndConfig,
  "c-lightning": cLightningConfig
})
