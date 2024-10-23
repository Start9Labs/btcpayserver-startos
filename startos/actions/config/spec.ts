import { sdk } from '../../sdk'
const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  lightning: Value.select({
    name: 'Lightning Node',
    description:
      'Use this setting to grant access to the selected internal Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, leave this setting blank. Please see the "Instructions" page for more details.',
    required: {
      default: 'none',
    },
    values: {
      lnd: 'LND',
      cln: 'Core Lightning',
      none: 'None',
    },
  }),
})

export const matchConfigSpec = inputSpec.validator
export type ConfigSpec = typeof matchConfigSpec._TYPE
