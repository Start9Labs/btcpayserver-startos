import { btcpayConfig } from '../fileModels/btcpay.config'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { getEnabledAltcoin } from '../utils'
const { InputSpec, Value } = sdk

const input = InputSpec.of({
  monero: Value.toggle({
    name: i18n('Monero'),
    description: i18n('Enable Monero integration'),
    default: false,
  }),
})

export const enableAltcoins = sdk.Action.withInput(
  'enable-altcoins',

  async ({ effects }) => ({
    name: i18n('Enable Altcoins'),
    description: i18n('Choose which altcoins to enable.'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  input,

  // pre-fill the form
  async ({ effects }) => {
    const chains = await btcpayConfig.read((s) => s.chains).const(effects)
    if (!chains) throw new Error('BTCPay config unreadable')
    return { monero: getEnabledAltcoin('xmr', chains) }
  },

  // execution function
  async ({ effects, input }) => {
    await btcpayConfig.merge(effects, {
      chains: input.monero ? 'btc,xmr' : 'btc',
    })
  },
)
