import { sdk } from '../sdk'

export const initalizePostgres = sdk.setupOnInit(async (effects) => {
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
  ),
    console.log('PostgreSQL initialization complete')
})
