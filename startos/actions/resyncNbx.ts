import { NBXplorerEnv } from '../fileModels/nbxplorer.env'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
const { InputSpec, Value } = sdk

const input = InputSpec.of({
  startHeight: Value.number({
    name: i18n('Rescan'),
    description: i18n('The block height at which to begin resync'),
    required: true,
    default: null,
    integer: true,
    min: 0,
  }),
})

export const resyncNbx = sdk.Action.withInput(
  'resync-nbx',

  async ({ effects }) => ({
    name: i18n('Resync NBXplorer'),
    description: i18n('Syncs NBXplorer from the inputted block height.'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  input,

  async ({ effects }) => {},

  async ({ effects, input }) => {
    const startHeight = input.startHeight

    await NBXplorerEnv.merge(effects, {
      NBXPLORER_BTCSTARTHEIGHT: String(startHeight),
      NBXPLORER_BTCRESCAN: '1',
    })

    await sdk.restart(effects)

    console.info(`BTCPay Server will now resync from block ${startHeight}`)
  },
)
