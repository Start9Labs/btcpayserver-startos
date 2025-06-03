import { store } from '../fileModels/store.json'
import { sdk } from '../sdk'
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

  async ({ effects }) => {},

  async ({ effects, input }) => {
    await store.merge(effects, { altcoins: { ...input } })
  },
)
