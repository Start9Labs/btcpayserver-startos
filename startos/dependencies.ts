import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  // @TODO get bitcoind config action - change setConfig
  // await sdk.action.request(effects, 'bitcoind', setConfig, 'important', {
  //   input: {
  //     kind: 'partial',
  //     value: {
  //       pruning: 'disabled',
  //     },
  //   },
  //   when: { condition: 'input-not-matches', once: false },
  //   reason: 'BTCPay Server requires an archival bitcoin node.',
  // })

  // @TODO update versions for 036 requirements
  return {
    bitcoind: {
      kind: 'running',
      versionRange: '>=28.0.0',
      healthChecks: [],
    },
    lnd: {
      kind: 'running',
      versionRange: '>=0.18.3',
      healthChecks: [],
    },
    'c-lightning': {
      kind: 'running',
      versionRange: '>=24.08.1',
      healthChecks: [],
    },
  }
})
