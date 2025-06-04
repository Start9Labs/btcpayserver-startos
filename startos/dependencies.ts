import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { config } from 'bitcoind-startos/startos/actions/config/config'
import { BTCPSEnvFile } from './fileModels/btcpay.env'
import { getCurrentLightning } from './utils'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  // await sdk.action.createTask(effects, 'bitcoind', config, 'important', {
  //   input: {
  //     kind: 'partial',
  //     value: {
  //       prune: 0,
  //     },
  //   },
  //   when: { condition: 'input-not-matches', once: false },
  //   reason: 'BTCPay Server requires an archival bitcoin node.',
  // })

  let currentDeps = {} as Record<
    'bitcoind' | 'lnd' | 'c-lightning' | 'monerod',
    T.DependencyRequirement
  >

  const env = await BTCPSEnvFile.read().const(effects)
  const ln = getCurrentLightning(env!)

  if (ln === 'lnd') {
    currentDeps['lnd'] = {
      id: 'lnd',
      kind: 'running',
      versionRange: '>=0.18.3',
      healthChecks: [],
    }
  }

  if (ln === 'cln') {
    currentDeps['c-lightning'] = {
      id: 'c-lightning',
      kind: 'running',
      versionRange: '>=24.08.1:1', // @TODO confirm
      healthChecks: [],
    }
  }

  return {
    ...currentDeps,
    bitcoind: {
      kind: 'running',
      versionRange: '>=28.0.0:1',
      healthChecks: [],
    },
  }
})
