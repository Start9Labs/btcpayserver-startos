import { compat } from "../deps.ts";

export const getConfig = compat.getConfig({
  "tor-address": {
    "name": "Network Tor Address",
    "description": "The Tor address for the network interface.",
    "type": "pointer",
    "subtype": "package",
    "package-id": "btcpayserver",
    "target": "tor-address",
    "interface": "main"
  },
  "bitcoin-rpc-user": {
    "type": "pointer",
    "name": "Bitcoin RPC Username",
    "description": "The username for Bitcoin Core's RPC interface",
    "subtype": "package",
    "package-id": "bitcoind",
    "target": "config",
    "multi": false,
    "selector": "$.rpc.username"
  },
  "bitcoin-rpc-password": {
    "type": "pointer",
    "name": "Bitcoin RPC Password",
    "description": "The password for Bitcoin Core's RPC interface",
    "subtype": "package",
    "package-id": "bitcoind",
    "target": "config",
    "multi": false,
    "selector": "$.rpc.password"
  },
  "lightning": {
    "type": "union",
    "tag": {
      "id": "type",
      "name": "Internal Lightning Node",
      "description": "Use this setting to grant access to the selected internal Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, leave this setting blank. Please see the \"Instructions\" page for more details.",
      "variant-names": {
        "none": "No selection",
        "c-lightning": "Core Lightning",
        "lnd": "LND"
      }
    },
    "name": "Lightning Node",
    "description": "Use this setting to grant BTCPay access to your internal LND or Core Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, leave this setting blank. Please see the \"Instructions\" page for more details.",
    "default": "none",
    "variants": {
      "none": {},
      "lnd": {},
      "c-lightning": {}
    }
  },
  "advanced": {
    "type": "object",
    "name": "Advanced Settings",
    "description": "Advanced configuration options to change if you know what you are doing",
    "spec": {
      "sync-start-height": {
        "type": "number",
        "nullable": false,
        "name": "Sync Start Height",
        "description": "The block explorer within BTCPay will start scanning from the configured start height. This means that you might not see old payments from your HD key. If you need to see old payments, you need to configure the start height to a specific height of your choice. By default, this value is -1, which is used to indicate the current stored blockchain height.",
        "range": "[-1,*)",
        "integral": true,
        "default": -1
      }
    }
  }
})
