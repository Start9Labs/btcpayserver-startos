import { types as T, matches, YAML } from "../deps.ts";

const { dictionary, boolean, shape, string, any } = matches;

type Check = {
  currentError(config: T.Config): string | void;
  fix(config: T.Config): void;
};

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

const matchOldBitcoindConfig = shape({
  rpc: shape({
    advanced: shape({
      serialversion: matches.any
    }),
  }),
  advanced: shape({
    pruning: shape({
      mode: string,
    }),
  }),
})


const bitcoindChecks: Array<Check> = [
  {
    currentError(config) {
      if (!matchBitcoindConfig.test(config)) {
        return "Bitcoind config is not the correct shape";
      }
      if (!config.rpc.enable) {
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
        return "Bitcoind config is not the correct shape";
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
    currentError(config) {
      if (matchOldBitcoindConfig.test(config) && config.advanced.pruning.mode !== "disabled") {
        return 'Pruning must be disabled to use with <= 24.0.1 of Bitcoin Core. To use with a pruned node, update Bitcoin Core to >= 25.0.0~2.';
      }
      return;
    },
    fix(config) {
      if (!matchOldBitcoindConfig.test(config)) {
        return
      }
      config.advanced.pruning.mode = "disabled"
    },
  }
];

export const dependencies: T.ExpectedExports.dependencies = {
  bitcoind: {
    // deno-lint-ignore require-await
    async check(effects, bitcoindConfig) {
      effects.info("check bitcoind");
      for (const checker of bitcoindChecks) {
        const error = checker.currentError(bitcoindConfig);
        if (error) {
          effects.error(`throwing error: ${error}`);
          return { error };
        }
      }
      return { result: null };
    },
    // deno-lint-ignore require-await
    async autoConfigure(effects, bitcoindConfig) {
      effects.info("autoconfigure bitcoind");
      for (const checker of bitcoindChecks) {
        const error = checker.currentError(bitcoindConfig);
        if (error) {
          checker.fix(bitcoindConfig);
        }
      }
      return { result: bitcoindConfig };
    },
  },
};
