import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
const { InputSpec, Value } = sdk

const input = InputSpec.of({
  startHeight: Value.number({
    name: 'Rescan',
    description: 'The block height at which to begin resync',
    required: true,
    default: null,
    integer: true,
    min: 0,
  }),
})

export const resyncNbx = sdk.Action.withInput(
  'resync-nbx',

  async ({ effects }) => ({
    name: 'Resync NBXplorer',
    description: 'Syncs NBXplorer from the inputted block height.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  input,

  async ({ effects }) => {},

  async ({ effects, input }) => {
    const startHeight = input.startHeight

    await storeJson.merge(effects, { startHeight })

    await sdk.restart(effects)

    console.info(`BTCPay Server will now resync from block ${startHeight}`)
  },
)
