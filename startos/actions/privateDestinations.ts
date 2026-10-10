import { isIP } from 'node:net'
import { btcpayConfig } from '../fileModels/btcpay.config'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
const { InputSpec, Value } = sdk

export const privateDestinations = sdk.Action.withInput(
  'configure-private-destinations',

  async () => ({
    name: i18n('Configure Private Destinations'),
    description: i18n(
      'Allow outbound HTTP requests to trusted private services without disabling SSRF protection.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  InputSpec.of({
    ssrfexceptions: Value.text({
      name: i18n('Allowed Destinations'),
      description: i18n(
        'Comma-separated exact hostnames or IP addresses, optionally followed by a port. Use brackets for IPv6. Example: nas.home.arpa:8080,[fd00::1]:443. No URLs, wildcards or network ranges. A hostname trusts all its resolved addresses; omitting the port allows every port. Leave empty to block private destinations. Changes restart BTCPay Server.',
      ),
      required: false,
      default: null,
    }),
  }),

  async ({ effects }) => ({
    ssrfexceptions: await btcpayConfig.read((c) => c.ssrfexceptions).once(),
  }),

  async ({ effects, input }) => {
    const destinations = (input.ssrfexceptions ?? '')
      .split(/[,;]/)
      .map((entry) => entry.trim())
      .filter(Boolean)
    for (const destination of destinations) {
      const match = /^(\[[^\]]+\]|[^:\s/]+)(?::([0-9]+))?$/.exec(destination)
      const host = match?.[1] ?? ''
      const port = match?.[2] === undefined ? null : Number(match[2])
      const validHost = host.startsWith('[')
        ? !host.includes('%') && isIP(host.slice(1, -1)) === 6
        : isIP(host) !== 0 ||
          (host.length <= 253 &&
            /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.?$/i.test(host))
      if (!match || !validHost || (port !== null && (port < 1 || port > 65535))) {
        throw new Error(
          i18n('Use exact hostnames or IP addresses with an optional port from 1 to 65535. Bracket IPv6 addresses; URLs and network ranges are not accepted.'),
        )
      }
    }
    await btcpayConfig.merge(effects, {
      ssrfexceptions: destinations.join(','),
    })
  },
)
