import { sdk } from '../sdk'
import { getHttpInterfaceUrls } from '../utils'

const { InputSpec, Value, Variants } = sdk

export const inputSpec = InputSpec.of({
  source: Value.union(
    {
      name: 'URL Source',
      default: 'system',
    },
    Variants.of({
      system: {
        name: 'System',
        spec: InputSpec.of({
          url: Value.dynamicSelect(async ({ effects }) => {
            const systemUrls = await getHttpInterfaceUrls(effects)

            return {
              name: 'URL',
              values: systemUrls.reduce(
                (obj, url) => ({
                  ...obj,
                  [url]: url,
                }),
                {} as Record<string, string>,
              ),
              default:
                systemUrls.find(
                  (u) => u.startsWith('http:') && u.includes('.onion'),
                ) || '',
            }
          }),
        }),
      },
      custom: {
        name: 'Custom (for clearnet)',
        spec: InputSpec.of({
          url: Value.text({
            name: 'URL',
            warning: `the domain of this URL must already exist in StartOS and be assigned to Gitea's HTTP interface`,
            required: true,
            default: null,
            inputmode: 'url',
            patterns: [sdk.patterns.url],
            placeholder: 'e.g. https://gitea.my-domain.dev',
          }),
        }),
      },
    }),
  ),
})

export const setPrimaryUrl = sdk.Action.withInput(
  // id
  'set-primary-url',

  // metadata
  async ({ effects }) => ({
    name: 'Set Primary Url',
    description:
      'Choose which of your Gitea http URLs should serve as the primary URL for the purposes of creating links, sending invites, etc.',
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
