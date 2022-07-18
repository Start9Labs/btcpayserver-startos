import { types as T, YAML, matches, rangeOf } from "../deps.ts"

const { shape, string, number } = matches

const matchBitcoin = shape({
    bitcoind: shape({
        type: string
    })
})

const matchAdvanced = shape({
    advanced: shape({
        "sync-start-height": number,
    })
})

export const migration_up_1_4_7: T.ExpectedExports.migration = async (effects, version) => {
  await effects.createDir({
    volumeId: "main",
    path: "start9"
  })
  const config = await effects.readFile({
    volumeId: "main",
    path: "start9/config.yaml"
  })
  const parsed = YAML.parse(config)

  if (!matchBitcoin.test(parsed)) {
    return { error: `Could not find bitcond key in config: ${matchBitcoin.errorMessage(parsed)}` }
  }

  // if bitcoin is configured to internal (ie. pointer to proxy), upgrade should ensure it remains proxy. As of 1.4.7, internal means bitcoin core. 
  if (rangeOf('<=1.4.7').check(version)) {
    if (parsed.bitcoind.type === 'internal') {
      parsed.bitcoind.type = 'internal-proxy'
    }
  }

  // handle cases prior to 1.4.7 when external was still an option 
  if (parsed.bitcoind.type === 'external') {
    parsed.bitcoind.type = 'internal-proxy'
  }

  await effects.writeFile({
    volumeId: "main",
    path: "start9/config.yaml",
    toWrite: YAML.stringify(parsed)
  })

  // advanced["sync-start-height"] added in 1.4.7 
  if (rangeOf('<0.14.7').check(version)) {
    if (!matchAdvanced.test(parsed)) {
      return { result: { configured: false } }
    }
  }

  return { result: { configured: true } }

}
