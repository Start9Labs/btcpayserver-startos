import { sdk } from './sdk'

// TODO: Re-enable withPgDump once the SDK supports a `mountpoint` option.
// btcpayserver/postgres:18.1 uses PGDATA=/var/lib/postgresql/18/docker,
// which is incompatible with the SDK's assumption that pgdata ends in /data.
//
// export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
//   sdk.Backups.withPgDump({
//     imageId: 'postgres',
//     dbVolume: 'db',
//     pgdata: '/var/lib/postgresql/18/docker',
//     database: 'btcpayserver',
//     user: 'postgres',
//     password: '', // TODO: use null once SDK supports passwordless pg auth
//   })
//     .addVolume('main')
//     .addVolume('btcpayserver'),
// )

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('main', 'db', 'btcpayserver'),
)
