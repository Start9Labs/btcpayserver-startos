import { types as T, matches } from "../deps.ts"

const { shape, string } = matches

export const migration_down_1_13_1_2 = (config: T.Config): T.Config => {

  if (Object.keys(config).length === 0) {
    // service was never configured
    return config
  }

  const matchAltcoinConfig = shape({
    altcoins: shape({
      type: string,
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
