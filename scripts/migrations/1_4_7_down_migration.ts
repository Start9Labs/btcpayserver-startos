import { types as T, matches } from "../deps.ts"

const { shape, any, string } = matches

const matchAdvanced = shape({
  advanced: shape({
    "sync-start-height": any,
  })
})

const matchBitcoin = shape({
  bitcoin: shape({
    "bitcoind-rpc": shape({
      type: string
    })
  })
})


export const migration_down_1_4_7 = (config: T.Config): T.Config => {

  if (!matchBitcoin.test(config)) {
    throw `Could not find bitcoind key in config: ${matchBitcoin.errorMessage(config)}`
  }

  // added in 1.4.7.1 
  if (matchAdvanced.test(config)
  ) {
    delete config.advanced["sync-start-height"];
  }

  // if bitcoin is configured to internal-proxy, downgrade should ensure it remains proxy, which at the time was the meaning of "internal"
  if (config.bitcoin['bitcoind-rpc'].type === 'internal-proxy') {
    config.bitcoin['bitcoind-rpc'].type = 'internal'
  }

  return config;
}
