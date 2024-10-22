import { sdk } from '../../sdk'
import { inputSpec } from './spec'

export const config = sdk.Action.withInput(
  'config',

  async ({ effects }) => ({
    name: 'Configure',
    description: 'Customize and enable options',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    // @TODO doesnt seem right - how to pre-fill with whole store
    // sdk.store.getOwn(effects, sdk.StorePath).const()
    await sdk.store.getOwn(effects, sdk.StorePath)
  },

  async ({ effects, input }) => {
    await sdk.store.setOwn(effects, sdk.StorePath, {
      lightningImplementation: input.lightningImplementation,
      startHeight: input.advanced['sync-start-height'],
    })
  },
)
