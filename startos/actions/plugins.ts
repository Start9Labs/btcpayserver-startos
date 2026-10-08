import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
const { InputSpec, Value } = sdk

const input = InputSpec.of({
  shopify: Value.toggle({
    name: i18n('Shopify'),
    description: i18n(
      'Runs the Shopify app alongside BTCPay Server, which you need to connect a Shopify store.',
    ),
    default: false,
  }),
})

export const enablePlugins = sdk.Action.withInput(
  'enable-plugins',

  async ({ effects }) => ({
    name: i18n('Enable Plugins'),
    description: i18n('Choose which system plugins to enable.'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  input,

  async ({ effects }) => {},

  async ({ effects, input }) => {
    await storeJson.merge(effects, { plugins: { ...input } })
  },
)
