import { sdk } from '../sdk'
import { getWebHostnames } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  primaryhostname: Value.dynamicSelect(async ({ effects }) => {
    const hostnames = await getWebHostnames(effects)

    return {
      name: 'Hostname',
      values: hostnames.reduce(
        (obj, hostname) => ({
          ...obj,
          [hostname]: hostname,
        }),
        {} as Record<string, string>,
      ),
      default: hostnames.find((u) => u.includes('.onion')) || '',
    }
  }),
})

export const setPrimaryUrl = sdk.Action.withInput(
  // id
  'set-primary-hostname',

  // metadata
  async ({ effects }) => ({
    name: 'Set Primary Hostname',
    description:
      'Choose which of your BTCPay hostnames should serve as the primary for the purposes of creating links, sending invites, etc.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const systemUrls = await getHttpInterfaceUrls(effects)

    const url = await sdk.store
      .getOwn(effects, sdk.StorePath.GITEA__server__ROOT_URL)
      .const()

    return {
      source: {
        selection:
          !url || systemUrls.includes(url)
            ? ('system' as const)
            : ('custom' as const),
        value: { url },
      },
    }
  },

  // the execution function
  async ({ effects, input }) =>
    sdk.store.setOwn(
      effects,
      sdk.StorePath.GITEA__server__ROOT_URL,
      input.source.value.url,
    ),
)
