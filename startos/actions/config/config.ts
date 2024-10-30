import { btcpsEnvFile } from '../../file-models/btcpay.env'
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
    // @TODO doesnt seem right - how to pre-fill with whole store
    // sdk.store.getOwn(effects, sdk.StorePath).const()
    await sdk.store.getOwn(effects, sdk.StorePath)
  },

  async ({ effects, input }) => {
    const currentLightning = await sdk.store
      .getOwn(effects, sdk.StorePath.lightning)
      .const()

    if (currentLightning === input.lightning) return

    const env = await btcpsEnvFile.read.const(effects)
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
      BTCPAY_BTCLIGHTNING = `type=lnd-rest;server=https://lnd.embassy:8080/;macaroonfilepath=${mountpoint}/admin.macaroon;allowinsecure=true`
    }

    if (input.lightning === 'cln') {
      // @TODO mainMounts.addDependency<typeof ClnManifest>
      const mountpoint = '/mnt/cln'
      mainMounts.addDependency(
        'cln',
        'main', //@TODO verify
        'shared', //@TODO verify
        mountpoint,
        true,
      )
      BTCPAY_BTCLIGHTNING = `type=clightning;server=unix://${mountpoint}/lightning-rpc`
    }

    await Promise.all([
      btcpsEnvFile.merge({ ...env!, BTCPAY_BTCLIGHTNING }),
      sdk.store.setOwn(effects, sdk.StorePath.lightning, input.lightning),
    ])
  },
)
