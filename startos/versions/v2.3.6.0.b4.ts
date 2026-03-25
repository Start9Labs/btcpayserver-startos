import { IMPOSSIBLE, T, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile } from 'fs/promises'
import { BTCPSEnv } from '../fileModels/btcpay.env'

import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import {
  clnConnectionString,
  lndConnectionString,
  PG_MOUNT,
} from '../utils'

const OLD_PGDATA = '/mnt/main/postgresql/data'

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

      await sub.execFail(
        ['sh', '-c', `cp -a ${OLD_PGDATA}/. ${PG_MOUNT}/`],
        { user: 'root' },
      )
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

      console.info('Volume migration complete — pg_upgrade will run on first start')
    },
  )
}

export const v_2_3_6_0_b4 = VersionInfo.of({
  version: '2.3.6:0-beta.4',
  releaseNotes: {
    en_US: 'Update BTCPay Server to 2.3.6',
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

      await BTCPSEnv.merge(effects, {
        BTCPAY_BTCLIGHTNING:
          lightning?.type === 'lnd'
            ? lndConnectionString
            : lightning?.type === 'c-lightning'
              ? clnConnectionString
              : undefined,
        BTCPAY_CHAINS:
          altcoins?.monero?.status === 'enabled' ? 'btc,xmr' : 'btc',
      })

      // Move data to dedicated volumes; pg_upgrade runs on first daemon start
      await migrateVolumes(effects)
    },
    down: IMPOSSIBLE,
  },
})
