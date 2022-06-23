import { ConfigRes, ExpectedExports, matches, YAML } from "../deps.ts";

const { any, string, dictionary } = matches;

const matchConfig = dictionary([string, any]);

export const getConfig: ExpectedExports.getConfig = async (effects) => {
  const config = await effects
    .readFile({
      path: "start9/config.yaml",
      volumeId: "main",
    })
    .then((x) => YAML.parse(x))
    .then((x) => matchConfig.unsafeCast(x))
    .catch((e) => {
      effects.warn(`Got error ${e} while trying to read the config`);
      return undefined;
    });
  const spec: ConfigRes["spec"] = {
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
            "name": "Type",
            "variant-names": {
              "internal": "Internal (Bitcoin Core)",
              "internal-proxy": "Internal (Bitcoin Proxy)"
            },
            "description": "The Bitcoin Core node to connect to:\n  - internal: A full archival version of the Bitcoin Core service installed on your Embassy\n  - internal-proxy: A pruned version of Bitcoin Core and the Bitcoin Proxy service installed on your Embassy\n"
          },
          "default": "internal-proxy",
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
          "name": "Bitcoin Core P2P",
          "description": "The Bitcoin Core node to connect to over the peer-to-peer interface",
          "tag": {
            "id": "type",
            "name": "Type",
            "variant-names": {
              "internal": "Internal",
              "external": "External"
            },
            "description": "The Bitcoin Core P2P node to connect to:\n  - internal: The Bitcoin Core service installed on your Embassy\n  - external: A Bitcoin Core node running on a different device\n"
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
        "name": "Type",
        "description": "Enables BTCPay to use the selected internal lightning node.",
        "variant-names": {
          "none": "No selection",
          "c-lightning": "Core Lightning",
          "lnd": "LND"
        }
      },
      "name": "Embassy Lightning Node",
      "description": "Use this setting to grant BTCPay access to your Embassys LND or Core Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, leave this setting blank. Please see the \"Instructions\" page for more details.",
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
      "description": "Advanced conifuration options to change if you know what you are doing",
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
  };
  return {
    result: {
      config,
      spec,
    },
  };
};
