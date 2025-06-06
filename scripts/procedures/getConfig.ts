import { compat } from "../deps.ts";

export const getConfig = compat.getConfig({
  "tor-address": {
    name: "Network Tor Address",
    description: "The Tor address for the network interface.",
    type: "pointer",
    subtype: "package",
    "package-id": "btcpayserver",
    target: "tor-address",
    interface: "main",
  },
  "bitcoin-rpc-user": {
    type: "pointer",
    name: "Bitcoin RPC Username",
    description: "The username for Bitcoin Core's RPC interface",
    subtype: "package",
    "package-id": "bitcoind",
    target: "config",
    multi: false,
    selector: "$.rpc.username",
  },
  "bitcoin-rpc-password": {
    type: "pointer",
    name: "Bitcoin RPC Password",
    description: "The password for Bitcoin Core's RPC interface",
    subtype: "package",
    "package-id": "bitcoind",
    target: "config",
    multi: false,
    selector: "$.rpc.password",
  },
  lightning: {
    type: "union",
    tag: {
      id: "type",
      name: "Lightning Node",
      description:
        'Use this setting to grant access to the selected lightning node running on your server. If you prefer to use an external Lightning node, or you do not intend to use Lightning, leave this setting blank. Please see the "Instructions" page for more details.',
      "variant-names": {
        none: "None",
        "c-lightning": "Core Lightning",
        lnd: "LND",
      },
    },
    name: "Lightning Node",
    description:
      'Use this setting to grant BTCPay access to your internal LND or Core Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, leave this setting blank. Please see the "Instructions" page for more details.',
    default: "none",
    variants: {
      none: {},
      lnd: {},
      "c-lightning": {},
    },
  },
  altcoins: {
    type: "object",
    name: "Altcoin Integrations",
    description:
      'Choose which altcoins to enable. Please see the "Instructions" page for more details.',
    spec: {
      monero: {
        type: "union",
        name: "Monero",
        description: "Enables integration with Monero for payment processing",
        tag: {
          id: "status",
          name: "Monero",
          "variant-names": {
            enabled: "Enabled",
            disabled: "Disabled",
          },
        },
        default: "disabled",
        variants: {
          disabled: {},
          enabled: {},
        },
      },
    },
  },
  plugins: {
    type: "object",
    name: "Plugins",
    description:
      'Choose which plugins to enable. Please see the "Instructions" page for more details.',
    spec: {
      shopify: {
        type: "union",
        name: "Shopify",
        description:
          "Enables you to connect your instance with your Shopify store",
        tag: {
          id: "status",
          name: "Shopify",
          "variant-names": {
            enabled: "Enabled",
            disabled: "Disabled",
          },
        },
        default: "disabled",
        variants: {
          disabled: {},
          enabled: {},
        },
      },
    },
  },
  advanced: {
    type: "object",
    name: "Advanced Settings",
    description:
      "Advanced configuration options to change if you know what you are doing",
    spec: {
      "sync-start-height": {
        type: "number",
        nullable: false,
        name: "Sync Start Height",
        description:
          "The block explorer within BTCPay will start scanning from the configured start height. This means that you might not see old payments from your HD key. If you need to see old payments, you need to configure the start height to a specific height of your choice. By default, this value is -1, which is used to indicate the current stored blockchain height.",
        range: "[-1,*)",
        integral: true,
        default: -1,
      },
    },
  },
});
