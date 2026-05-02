import { IMPOSSIBLE, T, VersionInfo, YAML } from '@start9labs/start-sdk'
import { chown, readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { btcpayConfig } from '../fileModels/btcpay.config'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { clnConnectionString, lndConnectionString, PG_MOUNT } from '../utils'

const OLD_PGDATA = '/mnt/main/postgresql/data'

async function chownRecursive(path: string, uid: number, gid: number) {
  let entries
  try {
    entries = await readdir(path, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const full = join(path, entry.name)
    if (entry.isDirectory()) await chownRecursive(full, uid, gid)
    await chown(full, uid, gid)
  }
  await chown(path, uid, gid)
}

/**
 * Migrate data from the old single `main` volume layout to dedicated volumes.
 *
 * Volume mapping:
 *   main/btcpayserver  →  btcpayserver volume
 *   main/plugins       →  btcpayserver volume (Plugins/)
 *   main/nbxplorer     →  nbxplorer volume
 *   main/postgresql     →  db volume
 *
 * PostgreSQL 13 → 18 upgrade is handled by the btcpayserver/postgres image's
 * entrypoint on first daemon start. We just need to place the PG 13 data files
 * at the db volume root (where the entrypoint expects PG_VERSION).
 */
async function migrateVolumes(effects: T.Effects) {
  const mounts = sdk.Mounts.of()
    .mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/mnt/main',
      readonly: false,
    })
    .mountVolume({
      volumeId: 'db',
      subpath: null,
      mountpoint: PG_MOUNT,
      readonly: false,
    })
    .mountVolume({
      volumeId: 'btcpayserver',
      subpath: null,
      mountpoint: '/mnt/btcpay',
      readonly: false,
    })
    .mountVolume({
      volumeId: 'nbxplorer',
      subpath: null,
      mountpoint: '/mnt/nbx',
      readonly: false,
    })

  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'postgres' },
    mounts,
    'migrate',
    async (sub) => {
      // ── Move app data to dedicated volumes ──

      console.info('Moving BTCPay data to dedicated volumes...')

      await sub.execFail(
        ['sh', '-c', 'cp -a /mnt/main/btcpayserver/. /mnt/btcpay/'],
        { user: 'root' },
      )
      await sub.execFail(['mkdir', '-p', '/mnt/btcpay/Plugins'], {
        user: 'root',
      })
      await sub.execFail(
        ['sh', '-c', 'cp -a /mnt/main/plugins/. /mnt/btcpay/Plugins/'],
        { user: 'root' },
      )
      await sub.execFail(
        ['sh', '-c', 'cp -a /mnt/main/nbxplorer/. /mnt/nbx/'],
        { user: 'root' },
      )

      // ── Move PG data to db volume root ──
      // The entrypoint expects PG_VERSION at the mount root (/var/lib/postgresql/PG_VERSION),
      // not in a data/ subdirectory. It detects PG 13, runs pg_upgrade, and places
      // the upgraded data at PGDATA (/var/lib/postgresql/data).

      await sub.execFail(['sh', '-c', `cp -a ${OLD_PGDATA}/. ${PG_MOUNT}/`], {
        user: 'root',
      })
      await sub.execFail(['chown', '-R', 'postgres:postgres', PG_MOUNT], {
        user: 'root',
      })

      // ── Clean up main volume ──

      await sub.execFail(
        [
          'rm',
          '-rf',
          '/mnt/main/postgresql',
          '/mnt/main/btcpayserver',
          '/mnt/main/plugins',
          '/mnt/main/nbxplorer',
          '/mnt/main/start9',
        ],
        { user: 'root' },
      )

      console.info(
        'Volume migration complete — pg_upgrade will run on first start',
      )
    },
  )
}

export const v_2_3_7_1 = VersionInfo.of({
  version: '2.3.7:1',
  releaseNotes: {
    en_US: 'Internal updates (start-sdk 1.3.3)',
    es_ES: 'Actualizaciones internas (start-sdk 1.3.3)',
    de_DE: 'Interne Aktualisierungen (start-sdk 1.3.3)',
    pl_PL: 'Aktualizacje wewnętrzne (start-sdk 1.3.3)',
    fr_FR: 'Mises à jour internes (start-sdk 1.3.3)',
  },
  migrations: {
    up: async ({ effects }) => {
      const configYaml:
        | {
            lightning: {
              type: 'lnd' | 'c-lightning'
            }
            altcoins: {
              monero: {
                status: 'enabled' | 'disabled'
              }
            }
            plugins: {
              shopify: {
                status: 'enabled' | 'disabled'
              }
            }
          }
        | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      // No config.yaml means fresh install — nothing to migrate
      if (!configYaml) return

      const { plugins, lightning, altcoins } = configYaml

      await storeJson.write(effects, {
        plugins: {
          shopify: plugins?.shopify?.status === 'enabled',
        },
      })

      await btcpayConfig.merge(effects, {
        btclightning:
          lightning?.type === 'lnd'
            ? lndConnectionString
            : lightning?.type === 'c-lightning'
              ? clnConnectionString
              : undefined,
        chains: altcoins?.monero?.status === 'enabled' ? 'btc,xmr' : 'btc',
      })

      // The old monero-wallet-rpc s6 service ran as UID 30236:GID 302340,
      // which are outside the 0.4.0 ID mapping range. Normalize ownership
      // at the host level (container root can't chown unmapped UIDs).
      await chownRecursive(
        '/media/startos/volumes/main/btcpayserver/altcoins/monero',
        1654,
        1654,
      )

      // Move data to dedicated volumes; pg_upgrade runs on first daemon start
      await migrateVolumes(effects)
    },
    down: IMPOSSIBLE,
  },
})
