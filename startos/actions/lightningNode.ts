import { btcpayConfig } from '../fileModels/btcpay.config'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  clnConnectionString,
  isCln,
  isLnd,
  lndConnectionString,
  lndRestBridge,
} from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  lightning: Value.select({
    name: i18n('Lightning Node'),
    description: i18n(
      'Use this setting to grant access to the selected internal Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, select "None/External". Please see the "Instructions" page for more details.',
    ),
    default: 'none',
    values: {
      lnd: i18n('LND'),
      cln: i18n('Core Lightning'),
      none: i18n('None/External'),
    },
  }),
})

export const lightningNode = sdk.Action.withInput(
  'lightning-node',

  async ({ effects }) => ({
    name: i18n('Choose Lightning Node'),
    description: i18n(
      'Use this setting to grant access to the selected internal Lightning node to use lightning for invoices.',
    ),
    warning: i18n(
      "If this is the first time selecting a lightning node, you need to go into BTCPay Server, click on 'Lightning', choose 'Internal Node' and save.",
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const ln = await btcpayConfig.read((s) => s.btclightning).once()
    const lightning: 'lnd' | 'cln' | 'none' = isLnd(ln)
      ? 'lnd'
      : isCln(ln)
        ? 'cln'
        : 'none'
    return { lightning }
  },

  async ({ effects, input }) => {
    let btclightning: string | undefined
    if (input.lightning === 'lnd') {
      const restUrl = await lndRestBridge(effects).once()
      if (!restUrl)
        throw new Error(
          'LND is not yet reachable on the internal network. Ensure it is installed and running, then try again.',
        )
      btclightning = lndConnectionString(restUrl)
    } else if (input.lightning === 'cln') {
      btclightning = clnConnectionString
    }

    await btcpayConfig.merge(effects, { btclightning })
  },
)
