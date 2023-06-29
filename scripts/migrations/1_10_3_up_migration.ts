import { types as T } from "../deps.ts"

// deno-lint-ignore no-explicit-any
export const migration_up_1_10_3 = (config: any): T.Config => {

  if (Object.keys(config).length === 0) {
    // service was never configured
    return config
  }

 
  if (config.bitcoin["bitcoind-rpc"].type === "internal") {
    const rpcConfig = config.bitcoin["bitcoind-rpc"]
    config["bitcoin-rpc-user"] = rpcConfig["rpc-user"]
    config["bitcoin-rpc-password"] = rpcConfig["rpc-password"]
  }
  delete config.bitcoin
  return config
}
