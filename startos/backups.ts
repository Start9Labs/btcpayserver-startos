import { sdk } from './sdk'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.withPgDump({
    imageId: 'postgres',
    dbVolume: 'db',
    mountpoint: '/var/lib/postgresql',
    pgdataPath: '/18/docker',
    database: 'btcpayserver',
    user: 'postgres',
    password: null,
  })
    .addVolume('main')
    .addVolume('btcpayserver'),
)
