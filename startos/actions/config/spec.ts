import { sdk } from '../../sdk'
const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  lightning: Value.select({
    name: 'Lightning Node',
    description:
      'Use this setting to grant access to the selected internal Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, leave this setting blank. Please see the "Instructions" page for more details.',
    required: false,
    values: {
      lnd: 'LND',
      cln: 'Core Lightning',
    },
  }),
  advanced: Value.object(
    {
      name: 'Advanced Settings',
      description:
        'Advanced configuration options to change if you know what you are doing',
    },
    InputSpec.of({
      'sync-start-height': Value.number({
        name: 'Sync Start Height',
        description:
          'The block explorer within BTCPay will start scanning from the configured start height. This means that you might not see old payments from your HD key. If you need to see old payments, you need to configure the start height to a specific height of your choice. By default, this value is -1, which is used to indicate the current stored blockchain height.',
        required: {
          default: -1,
        },
        min: -1,
        integer: true,
      }),
    }),
  ),
})

export const matchConfigSpec = inputSpec.validator
export type ConfigSpec = typeof matchConfigSpec._TYPE
