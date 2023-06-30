import { types as T, matches } from "../deps.ts"

const { shape, string } = matches

export const migration_up_1_10_3 = (config: T.Config): T.Config => {

  if (Object.keys(config).length === 0) {
    // service was never configured
    return config
  }

  const matchConfig = shape({
    bitcoin: shape({
      "bitcoind-rpc": shape({
        type: string,
        "rpc-user": string,
        "rpc-password": string
      }),
    }),
    "bitcoin-rpc-user": string,
    "bitcoin-rpc-password": string
  }, ["bitcoin", "bitcoin-rpc-user", "bitcoin-rpc-password"])

   if (!matchConfig.test(config)) {
    throw `Incorrect shape for config: ${matchConfig.errorMessage(config)}`
  }
  
  if (config.bitcoin?.["bitcoind-rpc"].type === "internal") {
    const rpcConfig = config.bitcoin["bitcoind-rpc"]
    config["bitcoin-rpc-user"] = rpcConfig["rpc-user"]
    config["bitcoin-rpc-password"] = rpcConfig["rpc-password"]
  }
  delete config.bitcoin
  return config
}
