import { sdk } from './sdk'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.withPgDump({
    imageId: 'postgres',
    dbVolume: 'db',
    pgdata: '/var/lib/postgresql/data',
    database: 'btcpayserver',
    user: 'postgres',
    password: '', // TODO: use null once SDK supports passwordless pg auth
  })
    .addVolume('main')
    .addVolume('btcpayserver'),
)
