import { sdk } from '../../../sdk'
import { randomPassword } from '../../../utils'
import { configSpec } from '../../config/spec'
import { getDefaultString } from '@start9labs/start-sdk/lib/util/getDefaultString'
import { configSpec as bitcoindSpec } from 'bitcoind-startos/startos/procedures/config/spec'

export const bitcoindConfig = sdk.DependencyConfig.of({
  localConfig: configSpec,
  remoteConfig: bitcoindSpec,
  dependencyConfig: async ({ effects, utils, localConfig, remoteConfig }) => {
    const rpcUser = 'btcpayserver'
    const rpcPass = getDefaultString(randomPassword)

    // @TODO use bitcoin lib to hash credentials and store in bitcoin "authorization" and whitelist needed RPC calls
  },
})
