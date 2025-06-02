import { BTCPSEnvFile } from '../../fileModels/btcpay.env'
import { mainMounts } from '../../main'
import { sdk } from '../../sdk'
import { getCurrentLightning } from '../../utils'
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
