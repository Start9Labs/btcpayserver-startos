import { BTCPSEnv } from '../fileModels/btcpay.env'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  lightning: Value.select({
    name: 'Lightning Node',
    description:
      'Use this setting to grant access to the selected internal Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, select "None/External". Please see the "Instructions" page for more details.',
    default: 'none',
    values: {
      lnd: 'LND',
      cln: 'Core Lightning',
      none: 'None/External',
    },
  }),
})

export const lightningNode = sdk.Action.withInput(
  'lightning-node',

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
    const lightning = await storeJson.read((s) => s.lightning).const(effects)
    if (!lightning) throw new Error('No lightning attribute in store')

    return {
      lightning,
    }
  },

  async ({ effects, input }) => {
    const lightning = await storeJson.read((s) => s.lightning).const(effects)
    if (!lightning) throw new Error('No lightning attribute in store')

    // return early if nothing changed
    if (lightning === input.lightning) return

    await storeJson.merge(effects, { lightning })
  },
)
