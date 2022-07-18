import { types as T, YAML, matches } from "../deps.ts"

const { shape, number } = matches

const matchAdvanced = shape({
  advanced: shape({
    "sync-start-height": number,
  })
})

export const migration_down_1_4_7: T.ExpectedExports.migration = async (effects, _version) => {
  await effects.createDir({
    volumeId: "main",
    path: "start9"
  })
  const config = await effects.readFile({
    volumeId: "main",
    path: "start9/config.yaml"
  })
  const parsed = YAML.parse(config)

  // advanced["sync-start-height"] added in 1.4.7 
  if (!matchAdvanced.test(parsed)) {
    return { result: { configured: false } }
  }

  return { result: { configured: true } }

}
