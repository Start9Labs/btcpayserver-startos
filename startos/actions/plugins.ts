import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
const { InputSpec, Value } = sdk

const input = InputSpec.of({
  shopify: Value.toggle({
    name: 'Shopify',
    description:
      'Enables you to connect your instance with your Shopify store. Please see the "Instructions" tab for more details.',
    default: false,
  }),
})

export const enablePlugins = sdk.Action.withInput(
  'enable-plugins',

  async ({ effects }) => ({
    name: 'Enable Plugins',
    description: 'Choose which system plugins to enable.',
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
