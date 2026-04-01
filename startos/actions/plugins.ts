import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
const { InputSpec, Value } = sdk

const input = InputSpec.of({
  shopify: Value.toggle({
    name: i18n('Shopify'),
    description: i18n(
      'Enables you to connect your instance with your Shopify store. Please see the "Instructions" tab for more details.',
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
