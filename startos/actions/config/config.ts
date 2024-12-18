import { BTCPSEnv, btcpsEnvFile } from '../../file-models/btcpay.env'
import { mainMounts } from '../../main'
import { sdk } from '../../sdk'
import { inputSpec } from './spec'

export const config = sdk.Action.withInput(
  'config',

  async ({ effects }) => ({
    name: 'Configure',
    description: 'Customize and enable options',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const env = await btcpsEnvFile.read.const(effects)
    return {
      lightning: await getCurrentLightning(env!),
    }
  },

  async ({ effects, input }) => {
    const env = await btcpsEnvFile.read.const(effects)
    const currentLightning = await getCurrentLightning(env!)
    if (currentLightning === input.lightning) return

    let BTCPAY_BTCLIGHTNING = ''

    if (input.lightning === 'lnd') {
      // @TODO mainMounts.addDependency<typeof LndManifest>
      const mountpoint = '/mnt/lnd'
      mainMounts.addDependency(
        'lnd',
        'main', //@TODO verify
        'public', //@TODO verify
        mountpoint,
        true,
      )
      BTCPAY_BTCLIGHTNING = `type=lnd-rest;server=https://lnd.startos:8080/;macaroonfilepath=${mountpoint}/admin.macaroon;allowinsecure=true`
    }

    if (input.lightning === 'cln') {
      // @TODO mainMounts.addDependency<typeof ClnManifest>
      const mountpoint = '/mnt/cln'
      mainMounts.addDependency(
        'c-lightning',
        'main', //@TODO verify
        'shared', //@TODO verify
        mountpoint,
        true,
      )
      BTCPAY_BTCLIGHTNING = `type=clightning;server=unix://${mountpoint}/lightning-rpc`
    }
    await Promise.all([btcpsEnvFile.merge({ ...env!, BTCPAY_BTCLIGHTNING })])
  },
)

async function getCurrentLightning(env: BTCPSEnv) {
  const ln = env?.BTCPAY_BTCLIGHTNING
  let currentLightning: 'lnd' | 'cln' | 'none' = 'none'
  if (ln) {
    if (ln.includes('lnd')) currentLightning = 'lnd'
    if (ln.includes('clightning')) currentLightning = 'cln'
  }
  return currentLightning
}
