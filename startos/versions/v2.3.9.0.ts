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

export const v_2_3_9_0 = VersionInfo.of({
  version: '2.3.9:0',
  releaseNotes: {
    en_US:
      'Update BTCPay Server to 2.3.9, NBXplorer to 2.6.7, postgres sidecar to 18.1-1. Fix 0.3.x → 0.4 migration: chown legacy bundled monero data to a UID that lands inside the new container’s idmap window.',
    es_ES:
      'Actualiza BTCPay Server a 2.3.9, NBXplorer a 2.6.7 y el contenedor postgres a 18.1-1. Corrige la migración 0.3.x → 0.4: ajusta el dueño de los datos heredados de monero a un UID dentro de la ventana de idmap del nuevo contenedor.',
    de_DE:
      'Aktualisiert BTCPay Server auf 2.3.9, NBXplorer auf 2.6.7 und den Postgres-Sidecar auf 18.1-1. Fix für die Migration 0.3.x → 0.4: chown der gebündelten Monero-Daten auf eine UID innerhalb des Idmap-Fensters des neuen Containers.',
    pl_PL:
      'Aktualizacja BTCPay Server do 2.3.9, NBXplorer do 2.6.7 oraz kontenera postgres do 18.1-1. Poprawka migracji 0.3.x → 0.4: chown starszych danych monero na UID mieszczący się w oknie idmap nowego kontenera.',
    fr_FR:
      'Mise à jour de BTCPay Server vers 2.3.9, NBXplorer vers 2.6.7 et du conteneur postgres vers 18.1-1. Correctif de migration 0.3.x → 0.4 : chown des données monero héritées vers un UID situé dans la fenêtre idmap du nouveau conteneur.',
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

      await storeJson.merge(effects, {
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
      // outside the 0.4 idmap window (host 100000..165535), so the migration
      // sandbox sees those files as overflow-owned. Chown to sandbox-uid 0
      // (= host 100000 = the new monerod-dep container's root, same idmap)
      // before the subcontainer cp -a so the data lands accessible.
      await chownRecursive(
        '/media/startos/volumes/main/btcpayserver/altcoins/monero',
        0,
        0,
      )

      // Move data to dedicated volumes; pg_upgrade runs on first daemon start
      await migrateVolumes(effects)
    },
    down: IMPOSSIBLE,
  },
})
