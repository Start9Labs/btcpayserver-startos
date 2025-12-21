import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { BTCPSEnv } from './fileModels/btcpay.env'
import { storeJson } from './fileModels/store.json'
import { getEnabledAltcoin } from './utils'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const deps: T.CurrentDependenciesResult<any> = {}

  const chains = await BTCPSEnv.read((e) => e.BTCPAY_CHAINS).const(effects)
  if (!chains) throw new Error('BTCPay chains not found')

  const ln = await storeJson.read((s) => s.lightning).const(effects)
  if (!ln) throw new Error('Lightning not found in store')

  if (ln === 'lnd') {
    deps['lnd'] = {
      kind: 'running',
      versionRange: '>=0.19.3-beta:1-beta.0',
      healthChecks: [],
    }
  }

  if (ln === 'cln') {
    deps['c-lightning'] = {
      kind: 'running',
      versionRange: '>=25.9.0:1-beta.0',
      healthChecks: [],
    }
  }

  if (getEnabledAltcoin('xmr', chains)) {
    deps['monerod'] = {
      kind: 'running',
      versionRange: '>=0.18.4:0',
      healthChecks: [],
    }
  }

  return {
    ...deps,
    bitcoind: {
      kind: 'running',
      versionRange: '>=29.1:2-beta.0',
      healthChecks: [],
    },
  }
})
