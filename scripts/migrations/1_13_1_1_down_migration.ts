import { types as T, matches } from "../deps.ts"

const { shape, string } = matches

export const migration_down_1_13_1_1 = (config: T.Config): T.Config => {

  if (Object.keys(config).length === 0) {
    // service was never configured
    return config
  }


  const matchConfig = shape({
    altcoins: shape({
      "type": string,
    }),
  }, ["altcoins"])

   if (!matchConfig.test(config)) {
    throw `Incorrect shape for config: ${matchConfig.errorMessage(config)}`
  }
  
  if (config.altcoins) {
    delete config.altcoins
  }
  return config
}
