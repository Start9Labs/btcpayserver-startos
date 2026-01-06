import { BTCPSEnv } from '../fileModels/btcpay.env'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { clnMountpoint, lndMountpoint } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  lightning: Value.select({
    name: 'Lightning Node',
    description:
      'Use this setting to grant access to the selected internal Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, select "None/External". Please see the "Instructions" page for more details.',
    default: 'none',
    values: {
      lnd: 'LND',
      cln: 'Core Lightning',
      none: 'None/External',
    },
  }),
})

export const lightningNode = sdk.Action.withInput(
  'lightning-node',

  async ({ effects }) => ({
    name: 'Choose Lightning Node',
    description:
      'Use this setting to grant access to the selected internal Lightning node to use lightning for invoices.',
    warning:
      "If this is the first time selecting a lightning node, you need to go into BTCPay Server, click on 'Lightning', choose 'Internal Node' and save.",
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const lightning = await storeJson.read((s) => s.lightning).const(effects)
    if (!lightning) throw new Error('No lightning attribute in store')

    return {
      lightning,
    }
  },

  async ({ effects, input }) => {
    switch (input.lightning) {
      case 'lnd':
        await BTCPSEnv.merge(effects, {
          BTCPAY_BTCLIGHTNING: `type=lnd-rest;server=https://lnd.startos:8080/;macaroonfilepath=${lndMountpoint}/data/chain/bitcoin/mainnet/admin.macaroon;allowinsecure=true`,
        })
        break
      case 'cln':
        await BTCPSEnv.merge(effects, {
          BTCPAY_BTCLIGHTNING: `type=clightning;server=unix:/${clnMountpoint}/bitcoin/lightning-rpc`,
        })
        break
      default:
        await BTCPSEnv.merge(effects, {
          BTCPAY_BTCLIGHTNING: undefined,
        })
    }

    await storeJson.merge(effects, { lightning: input.lightning })
  },
)
