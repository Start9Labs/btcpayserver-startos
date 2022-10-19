import { types as T, matches, YAML } from "../deps.ts";

const { arrayOf, boolean, dictionary, shape, string, any } = matches;

const matchProxyConfig = shape({
  users: arrayOf(
    shape(
      {
        name: string,
        "allowed-calls": arrayOf(string),
        password: string,
        "fetch-blocks": boolean,
      },
      ["fetch-blocks"]
    )
  ),
});

function times<T>(fn: (i: number) => T, amount: number): T[] {
  const answer = new Array(amount);
  for (let i = 0; i < amount; i++) {
    answer[i] = fn(i);
  }
  return answer;
}

function randomItemString(input: string) {
  return input[Math.floor(Math.random() * input.length)];
}

async function readConfig(effects: T.Effects): Promise<T.Config> {
  const configMatcher = dictionary([string, any]);
  const config = configMatcher.unsafeCast(
    await effects.readFile(
      {
        path: "start9/config.yaml",
        volumeId: "main",
      }
    )
      .then(YAML.parse)
  );
  return config;
}


const serviceName = "btcpayserver";
const fullChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
type Check = {
  currentError(config: T.Config): string | void;
  fix(config: T.Config): void;
};
type CheckWithSelfConfig = {
  currentError(config: T.Config, selfConfig: T.Config): string | void;
  fix(config: T.Config): void;
};

const checks: Array<Check> = [
  {
    currentError(config) {
      if (!matchProxyConfig.test(config)) {
        return "Config is not the correct shape";
      }
      if (config.users.some((x) => x.name === serviceName)) {
        return;
      }
      return `Must have an RPC user named "${serviceName}"`;
    },
    fix(config) {
      if (!matchProxyConfig.test(config)) {
        return
      }
      config.users.push({
        name: serviceName,
        "allowed-calls": [],
        password: times(() => randomItemString(fullChars), 22).join(""),
      });
    },
  },
  ...[
    "getblock",
    "getblockchaininfo",
    "getnetworkinfo",
    "getpeerinfo",
    "getblockheader",
    "setban",
    "estimatesmartfee",
    "getblockcount",
    "sendrawtransaction",
    "getrawtransaction",
    "testmempoolaccept",
    "utxoupdatepsbt",
    "getbestblockhash",
    "scantxoutset",
    "signrawtransactionwithkey",
    "generatetoaddress",
    "validateaddress",
    "scantxoutset"
  ].map(
    (operator): Check => ({
      currentError(config) {
        if (!matchProxyConfig.test(config)) {
          return "Config is not the correct shape";
        }
        if (config.users.find((x) => x.name === serviceName)?.["allowed-calls"]?.some((x) => x === operator) ?? false) {
          return;
        }
        return `RPC user "${serviceName}" must have "${operator}" enabled`;
      },
      fix(config) {
        if (!matchProxyConfig.test(config)) {
          throw new Error("Config is not the correct shape");
        }
        const found = config.users.find((x) => x.name === serviceName);
        if (!found) {
          throw new Error(`User "${serviceName}" not found`);
        }
        found["allowed-calls"] = [...(found["allowed-calls"] ?? []), operator];
      },
    })
  ),
  {
    currentError(config) {
      if (!matchProxyConfig.test(config)) {
        return "Config is not the correct shape";
      }
      if (config.users.find((x) => x.name === serviceName)?.["fetch-blocks"] !== false) {
        return;
      }
      return `RPC user "${serviceName}" must have "Fetch Blocks" enabled`;
    },
    fix(config) {
      if (!matchProxyConfig.test(config)) {
        throw new Error("Config is not the correct shape");
      }
      const found = config.users.find((x) => x.name === serviceName);
      if (!found) {
        throw new Error(`User "${serviceName}" not found`);
      }
      found["fetch-blocks"] = true;
    },
  },
];

const matchBitcoindConfig = shape({
  rpc: shape({
    enable: boolean,
  }),
  advanced: shape({
    peers: shape({
      listen: boolean,
    }),
    pruning: shape({
      mode: string,
    }),
  }),
});

const matchBtcpsConfig = shape({
  bitcoin: shape({
    "bitcoind-rpc": shape({
      type: string,
    })
  }),
});

const bitcoindChecks: Array<CheckWithSelfConfig> = [
  {
    currentError(config, selfConfig) {
      if (!matchBitcoindConfig.test(config)) {
        return "Bitcoind config is not the correct shape";
      }
      if (!matchBtcpsConfig.test(selfConfig)) {
        return "BTCPS config is not the correct shape";
      }
      if (selfConfig.bitcoin["bitcoind-rpc"].type === "internal" && !config.rpc.enable) {
        return "Must have RPC enabled";
      }
      return;
    },
    fix(config) {
      if (!matchBitcoindConfig.test(config)) {
        return
      }
      config.rpc.enable = true;
    },
  },
  {
    currentError(config, selfConfig) {
      if (!matchBitcoindConfig.test(config)) {
        return "Bitcoind config is not the correct shape";
      }
      if (!matchBtcpsConfig.test(selfConfig)) {
        return "BTCPS config is not the correct shape";
      }
      if (selfConfig.bitcoin["bitcoind-rpc"].type === "internal" && !config.rpc.enable) {
        return "Must have RPC enabled";
      }
      return;
    },
    fix(config) {
      if (!matchBitcoindConfig.test(config)) {
        return
      }
      config.rpc.enable = true;
    },
  },
  {
    currentError(config) {
      if (!matchBitcoindConfig.test(config)) {
        return "Config is not the correct shape";
      }
      if (!config.advanced.peers.listen) {
        return "Must have peer interface enabled";
      }
      return;
    },
    fix(config) {
      if (!matchBitcoindConfig.test(config)) {
        return
      }
      config.advanced.peers.listen = true;
    },
  },
  {
    currentError(config, selfConfig) {
      if (!matchBitcoindConfig.test(config)) {
        return "Config is not the correct shape";
      }
      if (!matchBtcpsConfig.test(selfConfig)) {
        return "BTCPS config is not the correct shape";
      }
      if (selfConfig.bitcoin["bitcoind-rpc"].type === "internal" && config.advanced.pruning.mode !== "disabled") {
        return "Pruning must be disabled (must be an archival node)";
      }
      return;
    },
    fix(config) {
      if (!matchBitcoindConfig.test(config)) {
        return;
      }
      config.advanced.pruning.mode = "disabled";
    },
  },
];

export const dependencies: T.ExpectedExports.dependencies = {
  "btc-rpc-proxy": {
    // deno-lint-ignore require-await
    async check(effects, configInput) {
      effects.info("check btc-rpc-proxy");
      for (const checker of checks) {
        const error = checker.currentError(configInput);
        if (error) {
          effects.error(`throwing error: ${error}`);
          return { error };
        }
      }
      return { result: null };
    },
    // deno-lint-ignore require-await
    async autoConfigure(effects, configInput) {
      effects.info("autoconfigure btc-rpc-proxy");
      for (const checker of checks) {
        const error = checker.currentError(configInput);
        if (error) {
          checker.fix(configInput);
        }
      }
      return { result: configInput };
    },
  },
  bitcoind: {
    async check(effects, bitcoindConfig) {
      effects.info("check bitcoind");
      const btcpsConfig = await readConfig(effects);
      for (const checker of bitcoindChecks) {
        const error = checker.currentError(bitcoindConfig, btcpsConfig);
        if (error) {
          effects.error(`throwing error: ${error}`);
          return { error };
        }
      }
      return { result: null };
    },
    async autoConfigure(effects, bitcoindConfig) {
      effects.info("autoconfigure bitcoind");
      const btcpsConfig = await readConfig(effects);
      for (const checker of bitcoindChecks) {
        const error = checker.currentError(bitcoindConfig, btcpsConfig);
        if (error) {
          checker.fix(bitcoindConfig);
        }
      }
      return { result: bitcoindConfig };
    },
  },
};
