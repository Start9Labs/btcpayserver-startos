import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { BTCPSEnv } from '../fileModels/btcpay.env'
import { btcpsEnvDefaults, nbxEnvDefaults } from '../utils'
import { NBXplorerEnv } from '../fileModels/nbxplorer.env'

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
          '/usr/lib/postgresql/13/bin/initdb',
          '-D',
          '/datadir/postgresql/data',
        ])
      },
    )
    console.log('PostgreSQL initialization complete')

    await storeJson.write(effects, {
      plugins: {
        shopify: false,
      },
      lightning: 'none',
    })

    await BTCPSEnv.write(effects, {
      ...btcpsEnvDefaults,
    })
    await NBXplorerEnv.write(effects, {
      ...nbxEnvDefaults,
    })
  },
})
