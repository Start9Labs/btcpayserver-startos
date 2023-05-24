import { sdk } from '../../sdk'
const { Config, Value } = sdk

const input = Config.of({
  startHeight: Value.number({
    name: 'Starting Block Height',
    description: 'The block height at which to begin resync',
    required: { default: 1 },
    integer: true,
    min: 1,
  }),
})

export const resyncNbx = sdk.createAction(
  {
    name: 'Name to Logs',
    description: 'Prints "Hello [Name]" to the service logs.',
    id: 'nameToLogs',
    input,
    allowedStatuses: 'any',
  },
  async ({ effects, utils, input }) => {
    const startHeight = input.startHeight

    // the const() in main will force a restart when /startHeight changes
    await utils.store.setOwn('/startHeight', startHeight)

    return {
      message: `BTCPay Server will now resync from block ${startHeight}`,
      value: null,
    }
  },
)
