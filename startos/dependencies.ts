import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { BTCPSEnv } from './fileModels/btcpay.env'
import { storeJson } from './fileModels/store.json'
import { getEnabledAltcoin } from './utils'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  let currentDeps = {} as Record<
    'bitcoind' | 'lnd' | 'c-lightning' | 'monerod',
    T.DependencyRequirement
  >

  const chains = await BTCPSEnv.read((e) => e.BTCPAY_CHAINS).const(effects)
  if (!chains) throw new Error('BTCPay chains not found')

  const ln = await storeJson.read((s) => s.lightning).const(effects)
  if (!ln) throw new Error('Lightning not found in store')

  if (ln === 'lnd') {
    currentDeps['lnd'] = {
      id: 'lnd',
      kind: 'running',
      versionRange: '>=0.19.1',
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

  if (getEnabledAltcoin('xmr', chains)) {
    currentDeps['monerod'] = {
      id: 'monerod',
      kind: 'running',
      versionRange: '>=0.18.4.0:1', // @TODO confirm
      healthChecks: [],
    }
  }

  return {
    ...currentDeps,
    bitcoind: {
      kind: 'running',
      versionRange: '>=28.1.0:1',
      healthChecks: [],
    },
  }
})
