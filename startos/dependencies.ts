import { T } from '@start9labs/start-sdk'
import { autoconfig } from 'monerod-startos/startos/actions/config/autoconfig'
import { btcpayConfig } from './fileModels/btcpay.config'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { getEnabledAltcoin, isCln, isLnd, selfUiBridge } from './utils'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const deps: T.CurrentDependenciesResult<any> = {}

  const config = await btcpayConfig
    .read((c) => ({ btclightning: c.btclightning, chains: c.chains }))
    .const(effects)
  if (!config) throw new Error('BTCPay config not found')

  if (isLnd(config.btclightning)) {
    deps['lnd'] = {
      kind: 'running',
      versionRange: '>=0.21.1-beta:4',
      healthChecks: ['lnd'],
    }
  }

  if (isCln(config.btclightning)) {
    deps['c-lightning'] = {
      kind: 'running',
      versionRange: '>=26.6.6:1',
      healthChecks: ['lightningd'],
    }
  }

  if (getEnabledAltcoin('xmr', config.chains)) {
    deps['monerod'] = {
      kind: 'running',
      versionRange: '>=0.18.5.1:2',
      healthChecks: ['monerod'],
    }

    // monerod curls this callback on each new block; it reaches our Web UI over
    // the LXC bridge (replaces the dead `btcpayserver.startos` DNS).
    const uiAddr = await selfUiBridge(effects).const()
    if (uiAddr) {
      const blockNotify = `/usr/bin/curl -so /dev/null "http://${uiAddr}/monerolikedaemoncallback/block?cryptoCode=xmr&hash=%s"`
      await sdk.action.createTask(effects, 'monerod', autoconfig, 'important', {
        input: {
          kind: 'partial',
          accept: [{ 'block-notify': blockNotify }],
          set: { 'block-notify': blockNotify },
        },
        when: { condition: 'input-not-matches', once: false },
        reason: i18n('BTCPay Server requires a particular block-notify command'),
      })
    }
  }

  return {
    ...deps,
    bitcoind: {
      kind: 'running',
      versionRange: '>=28.4:14',
      healthChecks: ['bitcoind'],
    },
  }
})
