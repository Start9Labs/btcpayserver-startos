import { T } from '@start9labs/start-sdk'
import { autoconfig } from 'monerod-startos/startos/actions/config/autoconfig'
import { btcpayConfig } from './fileModels/btcpay.config'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  clnConnectionString,
  getEnabledAltcoin,
  lndConnectionString,
  uiPort,
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
      versionRange: '>=0.20.1-beta:2',
      healthChecks: ['lnd'],
    }
  }

  if (config.btclightning === clnConnectionString) {
    deps['c-lightning'] = {
      kind: 'running',
      versionRange: '>=25.12.1:8',
      healthChecks: ['lightningd'],
    }
  }

  if (getEnabledAltcoin('xmr', config.chains)) {
    deps['monerod'] = {
      kind: 'running',
      versionRange: '>=0.18.4.6:1',
      healthChecks: ['monerod'],
    }

    await sdk.action.createTask(effects, 'monerod', autoconfig, 'important', {
      input: {
        kind: 'partial',
        value: {
          'block-notify': `/usr/bin/curl -so /dev/null "http://btcpayserver.startos:${uiPort}/monerolikedaemoncallback/block?cryptoCode=xmr&hash=%s"`,
        },
      },
      when: { condition: 'input-not-matches', once: false },
      reason: i18n('BTCPay Server requires a particular block-notify command'),
    })
  }

  return {
    ...deps,
    bitcoind: {
      kind: 'running',
      versionRange: '>=28.3:7',
      healthChecks: ['bitcoind'],
    },
  }
})
