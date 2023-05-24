import { sdk } from "../../sdk";
const { Config, Value, Variants } = sdk;

export const configSpec = Config.of({
  bitcoin: Value.object(
    {
      name: "Bitcoin Settings",
      description:
        "RPC and P2P interface configuration options for Bitcoin Core",
      warning: null,
    },
    Config.of({
      "bitcoind-rpc": Value.union(
        {
          name: "Bitcoin Core RPC",
          description:
            "<p>The Bitcoin Core node to connect to over the RPC interface:</p><ul><li><strong>Bitcoin Core</strong>: A full archival version of the Bitcoin Core service installed on this device</li><li><strong>Bitcoin Proxy</strong>: A pruned version of Bitcoin Core and the Bitcoin Proxy service installed on this device</li></ul>",
          warning: null,
          required: { default: "internal" },
        },
        Variants.of({
          internal: {
            name: "Bitcoin Core",
            spec: Config.of({}),
          },
          "internal-proxy": {
            name: "Bitcoin Proxy",
            spec: Config.of({}),
          },
        }),
      ),
      "bitcoind-p2p": Value.union(
        {
          name: "Bitcoin Core P2P",
          description:
            "<p>The Bitcoin Core node to connect to over the peer-to-peer (P2P) interface:</p><ul><li><strong>Bitcoin Core</strong>: The Bitcoin Core service installed on this device</li><li><strong>External Node</strong>: A Bitcoin node running on a different device</li></ul>",
          warning: null,
          required: { default: "internal" },
        },
        Variants.of({
          internal: { name: "Bitcoin Core", spec: Config.of({}) },
          external: {
            name: "External Node",
            spec: Config.of({
              "p2p-host": Value.text({
                name: "Public Address",
                required: {
                  default: null,
                },
                description: "The public address of your Bitcoin Core server",
                warning: null,
                masked: false,
                placeholder: null,
                inputmode: "text",
                patterns: [
                  {
                    regex:
                      "(^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)|((^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$)|(^[a-z2-7]{16}\\.onion$)|(^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$))",
                    description:
                      "Must be either a domain name, or an IPv4 or IPv6 address. Do not include protocol scheme (eg 'http://') or port.",
                  },
                ],
                minLength: null,
                maxLength: null,
              }),
              "p2p-port":
                Value
                  .number(
                    {
                      name: "P2P Port",
                      description:
                        "The port that your Bitcoin Core P2P server is bound to",
                      warning: null,
                      required: {
                        default: 8333,
                      },
                      min: 0,
                      max: 65535,
                      step: null,
                      integer: true,
                      units: null,
                      placeholder: null,
                    },
                  ),
            }),
          },
        }),
      ),
    }),
  ),
  lightning: Value.union(
    {
      name: "Lightning Node",
      description:
        'Use this setting to grant access to the selected internal Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, leave this setting blank. Please see the "Instructions" page for more details.',
      warning: null,
      required: { default: "none" },
    },
    Variants.of({
      none: { name: "No selection", spec: Config.of({}) },
      lnd: { name: "LND", spec: Config.of({}) },
      "c-lightning": { name: "Core Lightning", spec: Config.of({}) },
    }),
  ),
  advanced: Value.object(
    {
      name: "Advanced Settings",
      description:
        "Advanced configuration options to change if you know what you are doing",
      warning: null,
    },
    Config.of({
      "sync-start-height": Value.number({
        name: "Sync Start Height",
        description:
          "The block explorer within BTCPay will start scanning from the configured start height. This means that you might not see old payments from your HD key. If you need to see old payments, you need to configure the start height to a specific height of your choice. By default, this value is -1, which is used to indicate the current stored blockchain height.",
        warning: null,
        required: {
          default: -1,
        },
        min: -1,
        max: null,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
    }),
  ),
});
export type ConfigSpec = typeof configSpec.validator._TYPE;
