import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
const { InputSpec, Value } = sdk

const input = InputSpec.of({
  monero: Value.toggle({
    name: 'Monero',
    description:
      'Choose which altcoins to enable. Please see the "Instructions" tab for more details.',
    default: false,
  }),
})

export const enableAltcoins = sdk.Action.withInput(
  'enable-altcoins',

  async ({ effects }) => ({
    name: 'Enable Altcoins',
    description: 'Choose which altcoins to enable.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  input,

  async ({ effects }) => {},

  async ({ effects, input }) => {
    // TODO create BTCPAY_CHAINS and restart service, remove altcoins from store
    await storeJson.merge(effects, { altcoins: { ...input } })
    // await BTCPSEnv.merge(effects, {
    //   BTCPAY_CHAINS: 'btc,xmr',
    //   BTCPAY_XMR_DAEMON_URI: 'http://monerod.embassy:18089',
    //   BTCPAY_XMR_DAEMON_USERNAME: '', // @TODO get rpc creds from monero service
    //   BTCPAY_XMR_DAEMON_PASSWORD: '', // @TODO get rpc creds from monero service
    //   BTCPAY_XMR_WALLET_DAEMON_URI: 'http://127.0.0.1:18082',
    //   BTCPAY_XMR_WALLET_DAEMON_WALLETDIR:
    //     '/datadir/btcpayserver/altcoins/monero/wallets',
    // })
  },
)
