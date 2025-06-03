import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { store } from '../fileModels/store.json'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    await Promise.all([
      store.write(effects, {
        startHeight: -1,
        plugins: {
          shopify: false,
        },
        altcoins: {
          monero: false,
        },
      }),
    ])
  },
})
