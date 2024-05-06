import { types as T, matches } from "../deps.ts"

const { shape, string } = matches

export const migration_up_1_13_1_2 = (config: T.Config): T.Config => {

  if (Object.keys(config).length === 0) {
    // service was never configured
    return config
  }

  const matchAltcoinConfig = shape({
    type: string
  })

  const matchConfigWithAltcoins = shape({
    altcoins: matchAltcoinConfig
  })

   if (!matchConfigWithAltcoins.test(config)) {
    const newAltcoinConfig: typeof matchAltcoinConfig._TYPE = {
      type: 'none'
    }
    return {
      ...config,
      altcoins: newAltcoinConfig
    }
  } else {
    return config
  }
}
