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
  "bitcoin": {
    "type": "object",
    "name": "Bitcoin Settings",
    "description": "RPC and P2P interface configuration options for Bitcoin Core",
    "spec": {
      "bitcoind-rpc": {
        "type": "union",
        "name": "Bitcoin Core RPC",
        "description": "The Bitcoin Core node to connect to over the RPC interface",
        "tag": {
          "id": "type",
          "name": "Bitcoin Core RPC",
          "description": "<p>The Bitcoin Core node to connect to over the RPC interface:</p><ul><li><strong>Bitcoin Core</strong>: A full archival version of the Bitcoin Core service installed on your Embassy</li><li><strong>Bitcoin Proxy</strong>: A pruned version of Bitcoin Core and the Bitcoin Proxy service installed on your Embassy</li></ul>",
          "variant-names": {
            "internal": "Bitcoin Core",
            "internal-proxy": "Bitcoin Proxy"
          },
        },
        "default": "internal",
        "variants": {
          "internal": {
            "rpc-user": {
              "type": "pointer",
              "name": "RPC Username",
              "description": "The username for Bitcoin Cores RPC interface",
              "subtype": "package",
              "package-id": "bitcoind",
              "target": "config",
              "multi": false,
              "selector": "$.rpc.username"
            },
            "rpc-password": {
              "type": "pointer",
              "name": "RPC Password",
              "description": "The password for Bitcoin Cores RPC interface",
              "subtype": "package",
              "package-id": "bitcoind",
              "target": "config",
              "multi": false,
              "selector": "$.rpc.password"
            }
          },
          "internal-proxy": {
            "rpc-user": {
              "type": "pointer",
              "name": "RPC Username",
              "description": "The username for Bitcoin Proxys RPC user allocated to BTCPay",
              "subtype": "package",
              "package-id": "btc-rpc-proxy",
              "target": "config",
              "multi": false,
              "selector": "$.users.[?(@.name == \"btcpayserver\")].name"
            },
            "rpc-password": {
              "type": "pointer",
              "name": "RPC Password",
              "description": "The password Bitcoin Proxys RPC user allocated to BTCPay",
              "subtype": "package",
              "package-id": "btc-rpc-proxy",
              "target": "config",
              "multi": false,
              "selector": "$.users.[?(@.name == \"btcpayserver\")].password"
            }
          }
        }
      },
      "bitcoind-p2p": {
        "type": "union",
        "tag": {
          "id": "type",
          "name": "Bitcoin Core P2P",
          "description": "<p>The Bitcoin Core node to connect to over the peer-to-peer (P2P) interface:</p><ul><li><strong>Bitcoin Core</strong>: The Bitcoin Core service installed on your Embassy</li><li><strong>External Node</strong>: A Bitcoin node running on a different device</li></ul>",
          "variant-names": {
            "internal": "Bitcoin Core",
            "external": "External Node"
          },
        },
        "default": "internal",
        "variants": {
          "internal": {},
          "external": {
            "p2p-host": {
              "type": "string",
              "name": "Public Address",
              "description": "The public address of your Bitcoin Core server",
              "nullable": false,
              "pattern": "(^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)|((^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$)|(^[a-z2-7]{16}\\.onion$)|(^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$))",
              "pattern-description": "Must be either a domain name, or an IPv4 or IPv6 address. Do not include protocol scheme (eg 'http://') or port.",
            },
            "p2p-port": {
              "type": "number",
              "name": "P2P Port",
              "description": "The port that your Bitcoin Core P2P server is bound to",
              "nullable": false,
              "range": "[0,65535]",
              "integral": true,
              "default": 8333
            }
          }
        }
      }
    }
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
