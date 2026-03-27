import { T } from '@start9labs/start-sdk'
import { btcpayConfig } from './fileModels/btcpay.config'
import { sdk } from './sdk'
import {
  clnConnectionString,
  getEnabledAltcoin,
  lndConnectionString,
} from './utils'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const deps: T.CurrentDependenciesResult<any> = {}

  const config = await btcpayConfig
    .read((c) => ({ btclightning: c.btclightning, chains: c.chains }))
    .const(effects)
  if (!config) throw new Error('BTCPay config not found')

  if (config.btclightning === lndConnectionString) {
    deps['lnd'] = {
      kind: 'running',
      versionRange: '>=0.20.1-beta:1-beta.3',
      healthChecks: ['lnd'],
    }
  }

  if (config.btclightning === clnConnectionString) {
    deps['c-lightning'] = {
      kind: 'running',
      versionRange: '>=25.12.1:4-beta.5',
      healthChecks: ['lightningd'],
    }
  }

  if (getEnabledAltcoin('xmr', config.chains)) {
    deps['monerod'] = {
      kind: 'running',
      versionRange: '>=0.18.4.6:0-beta.2',
      healthChecks: ['monerod'],
    }
  }

  return {
    ...deps,
    bitcoind: {
      kind: 'running',
      versionRange: '>=28.3:5-beta.4',
      healthChecks: ['bitcoind'],
    },
  }
})
