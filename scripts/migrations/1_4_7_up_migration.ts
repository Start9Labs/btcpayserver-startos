import { types as T, matches } from "../deps.ts"

const { shape, string, any } = matches

const matchBitcoin = shape({
    bitcoind: shape({
        type: string
    })
})

const matchAdvanced = shape({
    advanced: shape({
      "sync-start-height": any,
    })
})

export const migration_up_1_4_7 = (config: T.Config): T.Config => {

  if (!matchBitcoin.test(config)) {
    throw `Could not find bitcond key in config: ${matchBitcoin.errorMessage(config)}`
  }

  // if bitcoin is configured to internal (ie. pointer to proxy), upgrade should ensure it remains proxy. As of 1.4.7, internal means bitcoin core. 
    if (config.bitcoind.type === 'internal') {
      config.bitcoind.type = 'internal-proxy'
    }

  // handle cases prior to 1.4.7 when external was still an option 
  if (config.bitcoind.type === 'external') {
    config.bitcoind.type = 'internal-proxy'
  }

  // advanced["sync-start-height"] added in 1.4.7 
  if (matchAdvanced.test(config)) {
    delete config.advanced["sync-start-height"];
  }

  return config
}