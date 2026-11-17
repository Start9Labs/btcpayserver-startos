import { backup, T } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { PG_MOUNT } from './utils'

const PGDATA = `${PG_MOUNT}/18/docker`
// `<database>-db.dump` is the SDK's `withPgDump` naming, so earlier backups still restore.
const DATABASES = ['btcpayserver', 'nbxplorer']
const dumpPath = (db: string) => `/backup-target/${db}-db.dump`
const tmpPath = (db: string) => `/tmp/${db}-db.dump`

type Run = (cmd: string[], user?: 'root' | 'postgres') => Promise<unknown>

// pg_dump's writes are dropped on the backup target's FUSE mount, so every dump
// is staged in the subcontainer's /tmp and moved across with `cp`.
const withPostgres = (
  effects: T.Effects,
  name: string,
  init: boolean,
  body: (run: Run, exists: (path: string) => Promise<boolean>) => Promise<void>,
) =>
  sdk.SubContainer.withTemp(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'db',
      subpath: null,
      mountpoint: PG_MOUNT,
      readonly: false,
    }),
    name,
    async (sub) => {
      const run: Run = (cmd, user = 'postgres') =>
        sub.execFail(cmd, { user, timeout: null })
      await backup.mountBackupTarget(sub.rootfs)
      await run(['mkdir', '-p', '/var/run/postgresql'], 'root')
      await run(['chown', 'postgres:postgres', '/var/run/postgresql'], 'root')
      if (init) {
        await run(['chown', '-R', 'postgres:postgres', PG_MOUNT], 'root')
        await run(['initdb', '-D', PGDATA, '-U', 'postgres'])
      }
      await run(['rm', '-f', `${PGDATA}/postmaster.pid`])
      await run([
        'pg_ctl',
        'start',
        '-w',
        '-t',
        '60',
        '-D',
        PGDATA,
        '-o',
        '-c listen_addresses=',
      ])
      await body(
        run,
        async (path) => (await sub.exec(['test', '-f', path])).exitCode === 0,
      )
      await run(['pg_ctl', 'stop', '-w', '-t', '60', '-D', PGDATA])
    },
  )

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.withOptions()
    .addVolume('main')
    .addVolume('btcpayserver')
    .setPreBackup((effects) =>
      withPostgres(effects, 'pg-dump', false, async (run) => {
        for (const db of DATABASES) {
          await run(['touch', tmpPath(db)], 'root')
          await run(['chown', 'postgres:postgres', tmpPath(db)], 'root')
          await run(['pg_dump', '-U', 'postgres', '-Fc', '-f', tmpPath(db), db])
          await run(['cp', tmpPath(db), dumpPath(db)], 'root')
        }
      }),
    )
    .setPostRestore((effects) =>
      withPostgres(effects, 'pg-restore', true, async (run, exists) => {
        for (const db of DATABASES) {
          if (!(await exists(dumpPath(db)))) continue
          await run(['cp', dumpPath(db), tmpPath(db)], 'root')
          await run(['chown', 'postgres:postgres', tmpPath(db)], 'root')
          await run(['createdb', '-U', 'postgres', db])
          await run([
            'pg_restore',
            '-U',
            'postgres',
            '-d',
            db,
            '--no-owner',
            '--no-privileges',
            tmpPath(db),
          ])
        }
      }),
    ),
)
