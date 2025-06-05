import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    console.log('Initializing PostgreSQL...')
    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'postgres' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/datadir',
        readonly: false,
      }),
      'initalize-postgres',
      async (sub) => {
        await sub.exec(['chmod', '777', '/datadir'])
        await sub.exec(['mkdir', '-p', '/datadir/postgresql/data'])
        await sub.exec(['chmod', '777', '/datadir/postgresql'])
        await sub.exec([
          'chown',
          '-R',
          'postgres:postgres',
          '/datadir/postgresql/data',
        ])
        await sub.exec([
          'sudo',
          '-u',
          'postgres',
          '/usr/lib/postgresql/13/bin/initdb',
          '-D',
          '/datadir/postgresql/data',
        ])
      },
    )
    console.log('PostgreSQL initialization complete')

    await storeJson.write(effects, {
      startHeight: -1,
      plugins: {
        shopify: false,
      },
      altcoins: {
        monero: false,
      },
    })
  },
})
