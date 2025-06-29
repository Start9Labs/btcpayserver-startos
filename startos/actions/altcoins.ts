import { BTCPSEnv } from '../fileModels/btcpay.env'
import { sdk } from '../sdk'
import { getEnabledAltcoin } from '../utils'
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

  async ({ effects }) => {
    const chains = await BTCPSEnv.read((s) => s.BTCPAY_CHAINS).const(effects)
    if (!chains) throw new Error('BTCPay environment file unreadable')
    return { monero: getEnabledAltcoin('xmr', chains) }
  },

  async ({ effects, input }) => {
    const env = await BTCPSEnv.read().const(effects)
    if (!env) throw new Error('BTCPay environment file unreadable')

    if (input.monero) {
      await BTCPSEnv.merge(effects, {
        BTCPAY_CHAINS: 'btc,xmr',
        BTCPAY_XMR_DAEMON_URI: 'http://monerod.embassy:18089',
        BTCPAY_XMR_DAEMON_USERNAME: '', // @TODO get rpc creds from monero service
        BTCPAY_XMR_DAEMON_PASSWORD: '', // @TODO get rpc creds from monero service
        BTCPAY_XMR_WALLET_DAEMON_URI: 'http://127.0.0.1:18082',
        BTCPAY_XMR_WALLET_DAEMON_WALLETDIR:
          '/datadir/btcpayserver/altcoins/monero/wallets',
      })
    } else {
      await BTCPSEnv.merge(effects, {
        BTCPAY_CHAINS: 'btc',
        BTCPAY_XMR_DAEMON_URI: undefined,
        BTCPAY_XMR_DAEMON_USERNAME: undefined,
        BTCPAY_XMR_DAEMON_PASSWORD: undefined,
        BTCPAY_XMR_WALLET_DAEMON_URI: undefined,
        BTCPAY_XMR_WALLET_DAEMON_WALLETDIR: undefined,
      })
    }
  },
)
