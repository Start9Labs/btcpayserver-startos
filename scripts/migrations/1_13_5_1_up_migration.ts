import { types as T, matches } from "../deps.ts"

const { shape, string } = matches

export const migration_up_1_13_5_1 = (config: T.Config): T.Config => {

  if (Object.keys(config).length === 0) {
    // service was never configured
    return config
  }

  const altcoinsConfig = shape({
    monero: shape({
      status: string
    })
  })

  const matchConfigWithAltcoins = shape({
    altcoins: altcoinsConfig
  })

   if (!matchConfigWithAltcoins.test(config)) {
    const newAltcoinsConfig: typeof altcoinsConfig._TYPE = {
      monero: {
        status: 'disabled'
      }
    }
    return {
      ...config,
      altcoins: newAltcoinsConfig
    }
  } else {
    return config
  }
}
