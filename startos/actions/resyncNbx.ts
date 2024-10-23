import { sdk } from '../sdk'
const { InputSpec, Value } = sdk

const input = InputSpec.of({
  startHeight: Value.number({
    name: 'Starting Block Height',
    description: 'The block height at which to begin resync',
    required: { default: 1 },
    integer: true,
    min: 1,
  }),
})

export const resyncNbx = sdk.Action.withInput(
  'resync-nbx',

  async ({ effects }) => ({
    name: 'Resync NBXplorer',
    description: 'Syncs NBXplorer from the inputted block height.',
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  input,

  async ({ effects }) => {},

  async ({ effects, input }) => {
    const startHeight = input.startHeight

    await sdk.store.setOwn(effects, sdk.StorePath.startHeight, startHeight)

    // @TODO how do i reset this value after action is run?

    console.info(`BTCPay Server will now resync from block ${startHeight}`)
  },
)
