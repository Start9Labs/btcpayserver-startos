import { BTCPSEnv } from '../fileModels/btcpay.env'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { clnConnectionString, lndConnectionString } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  lightning: Value.select({
    name: i18n('Lightning Node'),
    description: i18n(
      'Use this setting to grant access to the selected internal Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, select "None/External". Please see the "Instructions" page for more details.',
    ),
    default: 'none',
    values: {
      lnd: i18n('LND'),
      cln: i18n('Core Lightning'),
      none: i18n('None/External'),
    },
  }),
})

export const lightningNode = sdk.Action.withInput(
  'lightning-node',

  async ({ effects }) => ({
    name: i18n('Choose Lightning Node'),
    description: i18n(
      'Use this setting to grant access to the selected internal Lightning node to use lightning for invoices.',
    ),
    warning: i18n(
      "If this is the first time selecting a lightning node, you need to go into BTCPay Server, click on 'Lightning', choose 'Internal Node' and save.",
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const ln = await BTCPSEnv.read((e) => e.BTCPAY_BTCLIGHTNING).const(effects)
    const lightning: 'lnd' | 'cln' | 'none' =
      ln === lndConnectionString ? 'lnd' : ln === clnConnectionString ? 'cln' : 'none'
    return { lightning }
  },

  async ({ effects, input }) => {
    const connectionStrings: Record<string, typeof lndConnectionString | typeof clnConnectionString> = {
      lnd: lndConnectionString,
      cln: clnConnectionString,
    }

    await BTCPSEnv.merge(effects, {
      BTCPAY_BTCLIGHTNING: connectionStrings[input.lightning],
    })
  },
)
