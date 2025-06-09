import { BTCPSEnv } from '../fileModels/btcpay.env'
import { sdk } from '../sdk'
import { getEnabledAltcoin } from '../utils'
const { InputSpec, Value } = sdk

const input = InputSpec.of({
  monero: Value.toggle({
    name: 'Monero',
    description:
      'Choose which altcoins to enable. Please see the "Instructions" tab for more details.',
    default: false,
  }),
})

export const enableAltcoins = sdk.Action.withInput(
  'enable-altcoins',

  async ({ effects }) => ({
    name: 'Enable Altcoins',
    description: 'Choose which altcoins to enable.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  input,

  async ({ effects }) => {
    const chains = await BTCPSEnv.read((s) => s.BTCPAY_CHAINS).const(effects)
    if (!chains) throw new Error('BTCPay environment file unreadable')
    return { monero: getEnabledAltcoin('xmr', chains) }
  },

  async ({ effects, input }) => {
    const env = await BTCPSEnv.read().const(effects)
    if (!env) throw new Error('BTCPay environment file unreadable')

    if (input.monero) {
      await BTCPSEnv.merge(effects, {
        BTCPAY_CHAINS: 'btc,xmr',
      })
      await sdk.restart(effects)
    }
  },
)
