import { T } from '@start9labs/start-sdk'
import { BTCPSEnv } from './fileModels/btcpay.env'
import { sdk } from './sdk'
import {
  getEnabledAltcoin,
  lndConnectionString,
  clnConnectionString,
} from './utils'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const deps: T.CurrentDependenciesResult<any> = {}

  const env = await BTCPSEnv.read().const(effects)
  if (!env) throw new Error('BTCPay env not found')

  if (env.BTCPAY_BTCLIGHTNING === lndConnectionString) {
    deps['lnd'] = {
      kind: 'running',
      versionRange: '>=0.20.0-beta:2-beta.0',
      healthChecks: ['lnd'],
    }
  }

  if (env.BTCPAY_BTCLIGHTNING === clnConnectionString) {
    deps['c-lightning'] = {
      kind: 'running',
      versionRange: '>=25.12.1:2-beta.0',
      healthChecks: ['lightningd'],
    }
  }

  if (getEnabledAltcoin('xmr', env.BTCPAY_CHAINS)) {
    deps['monerod'] = {
      kind: 'running',
      versionRange: '>=0.18.4:6-beta.0',
      healthChecks: ['monerod'],
    }
  }

  return {
    ...deps,
    bitcoind: {
      kind: 'running',
      versionRange: '>=28.3:0-beta.0',
      healthChecks: ['bitcoind'],
    },
  }
})
