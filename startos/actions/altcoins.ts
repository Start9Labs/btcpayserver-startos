import { BTCPSEnv } from '../fileModels/btcpay.env'
import { sdk } from '../sdk'
import { getEnabledAltcoin } from '../utils'
const { InputSpec, Value } = sdk

const input = InputSpec.of({
  monero: Value.toggle({
    name: 'Monero',
    description: 'Enable Monero integration',
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

  // pre-fill the form
  async ({ effects }) => {
    const chains = await BTCPSEnv.read((s) => s.BTCPAY_CHAINS).const(effects)
    if (!chains) throw new Error('BTCPay environment file unreadable')
    return { monero: getEnabledAltcoin('xmr', chains) }
  },

  // execution function
  async ({ effects, input }) => {
    await BTCPSEnv.merge(effects, {
      BTCPAY_CHAINS: input.monero ? 'btc,xmr' : 'btc',
      BTCPAYGEN_CRYPTO2: input.monero ? 'xmr' : undefined,
    })
  },
)
