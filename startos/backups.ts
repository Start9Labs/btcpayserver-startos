import { sdk } from './sdk'
import { PG_MOUNT } from './utils'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.withPgDump({
    imageId: 'postgres',
    dbVolume: 'db',
    mountpoint: PG_MOUNT,
    pgdataPath: '/18/docker',
    database: 'btcpayserver',
    user: 'postgres',
    password: null,
  })
    .addVolume('main')
    .addVolume('btcpayserver'),
)
