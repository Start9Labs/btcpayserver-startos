import { BTCPSEnvFile } from '../fileModels/btcpay.env'
import { mainMounts } from '../main'
import { sdk } from '../sdk'
import { getCurrentLightning } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  lightning: Value.select({
    name: 'Lightning Node',
    description:
      'Use this setting to grant access to the selected internal Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, leave this setting blank. Please see the "Instructions" page for more details.',
    default: 'none',
    values: {
      lnd: 'LND',
      cln: 'Core Lightning',
      none: 'None',
    },
  }),
})

export const lightningNode = sdk.Action.withInput(
  'lightningNode',

  async ({ effects }) => ({
    name: 'Enable Lightning Node',
    description:
      'Use this setting to grant access to the selected internal Lightning node to use lightning for BTCPay Server invoices.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const env = await BTCPSEnvFile.read().const(effects)
    return {
      lightning: getCurrentLightning(env!),
    }
  },

  async ({ effects, input }) => {
    const env = await BTCPSEnvFile.read().const(effects)
    const currentLightning = getCurrentLightning(env!)
    if (currentLightning === input.lightning) return

    let BTCPAY_BTCLIGHTNING = ''

    if (input.lightning === 'lnd') {
      // @TODO mainMounts.mountDependency<typeof LndManifest>
      const mountpoint = '/mnt/lnd'
      mainMounts.mountDependency({
        dependencyId: 'lnd',
        volumeId: 'main', //@TODO verify
        subpath: null,
        mountpoint,
        readonly: true,
      })
      BTCPAY_BTCLIGHTNING = `type=lnd-rest;server=https://lnd.startos:8080/;macaroonfilepath=${mountpoint}/admin.macaroon;allowinsecure=true`
    }

    if (input.lightning === 'cln') {
      // @TODO mainMounts.mountDependency<typeof ClnManifest>
      const mountpoint = '/mnt/cln'
      mainMounts.mountDependency({
        dependencyId: 'c-lightning',
        volumeId: 'main', //@TODO verify
        subpath: null,
        mountpoint,
        readonly: true,
      })
      BTCPAY_BTCLIGHTNING = `type=clightning;server=unix://${mountpoint}/lightning-rpc`
    }
    await BTCPSEnvFile.merge(effects, { ...env!, BTCPAY_BTCLIGHTNING })
  },
)
