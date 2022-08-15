import { types as T, matches } from "../deps.ts"

const { shape, any } = matches

const matchAdvanced = shape({
  advanced: shape({
    "sync-start-height": any,
  })
})

export const migration_down_1_4_7 = (config: T.Config): T.Config => {
  // advanced["sync-start-height"] added in 1.4.7 
  if (matchAdvanced.test(config)
  ) {
    delete config.advanced["sync-start-height"];
  }
  return config;
}
