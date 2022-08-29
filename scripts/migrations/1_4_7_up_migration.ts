import { types as T, matches } from "../deps.ts"

const { shape, string, any } = matches

const matchBitcoin = shape({
    bitcoin: shape({
        "bitcoind-rpc": shape({
          type: string
        })
    })
})

const matchAdvanced = shape({
    advanced: shape({
      "sync-start-height": any,
    })
})

export const migration_up_1_4_7 = (config: T.Config): T.Config => {

  if (Object.keys(config).length === 0) {
    // service was never configured
    return config
  }
  
  if (!matchBitcoin.test(config)) {
    throw `Could not find bitcoind key in config: ${matchBitcoin.errorMessage(config)}`
  }

  // if bitcoin is configured to internal (ie. pointer to proxy), upgrade should ensure it remains proxy. As of 1.4.7.1, internal means bitcoin core. 
  if (config.bitcoin['bitcoind-rpc'].type === 'internal') {
    config.bitcoin['bitcoind-rpc'].type = 'internal-proxy'
  }

  // handle cases prior to 1.4.7.1 when external was still an option 
  if (config.bitcoin['bitcoind-rpc'].type === 'external') {
    config.bitcoin['bitcoind-rpc'].type = 'internal-proxy'
  }

  // advanced["sync-start-height"] added in 1.4.7.1
  if (matchAdvanced.test(config)) {
    delete config.advanced["sync-start-height"];
  }

  return config
}
