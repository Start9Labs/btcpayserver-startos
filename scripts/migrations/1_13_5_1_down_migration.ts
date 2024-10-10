import { types as T, matches } from "../deps.ts"

const { shape, string } = matches

export const migration_down_1_13_5_1 = (config: T.Config): T.Config => {

  if (Object.keys(config).length === 0) {
    // service was never configured
    return config
  }

  const matchAltcoinConfig = shape({
    altcoins: shape({
      monero: shape({
        status: string,
      })
    }),
  }, ["altcoins"])

   if (!matchAltcoinConfig.test(config)) {
    throw `Incorrect shape for config: ${matchAltcoinConfig.errorMessage(config)}`
  }
  
  if (config.altcoins) {
    delete config.altcoins
  }
  return config
}
