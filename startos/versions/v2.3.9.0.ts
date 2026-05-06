import { IMPOSSIBLE, T, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile } from 'fs/promises'
import { btcpayConfig } from '../fileModels/btcpay.config'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { clnConnectionString, lndConnectionString, PG_MOUNT } from '../utils'

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

      // Skip altcoins/monero — its contents were chowned by the legacy
      // 0.3.x s6 monero-wallet-rpc unit to UID 30236:GID 302340 (outside
      // the 0.4 idmap window 100000..165535), so they're unreadable
      // from inside this subcontainer. Monero is now a separate package;
      // users with the monero altcoin re-add it via the new monerod
      // dependency and resync.
      await sub.execFail(
        [
          'sh',
          '-c',
          `set -e
          cd /mnt/main/btcpayserver
          find . -mindepth 1 -maxdepth 1 ! -name altcoins -exec cp -a {} /mnt/btcpay/ \\;
          if [ -d altcoins ]; then
            mkdir -p /mnt/btcpay/altcoins
            find altcoins -mindepth 1 -maxdepth 1 ! -name monero -exec cp -a {} /mnt/btcpay/altcoins/ \\;
          fi`,
        ],
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
      'Update BTCPay Server to 2.3.9, NBXplorer to 2.6.7, postgres sidecar to 18.1-1. 0.3.x → 0.4 migration skips legacy bundled monero wallet data — users with monero altcoin enabled should re-add it via the new monerod dependency and resync.',
    es_ES:
      'Actualiza BTCPay Server a 2.3.9, NBXplorer a 2.6.7 y el contenedor postgres a 18.1-1. La migración 0.3.x → 0.4 omite los datos heredados de la cartera monero — los usuarios con la altcoin monero deben volver a añadirla mediante la nueva dependencia monerod y resincronizar.',
    de_DE:
      'Aktualisiert BTCPay Server auf 2.3.9, NBXplorer auf 2.6.7 und den Postgres-Sidecar auf 18.1-1. Die Migration 0.3.x → 0.4 überspringt die gebündelten Monero-Wallet-Daten — Nutzer mit aktiviertem Monero-Altcoin müssen ihn über die neue monerod-Abhängigkeit erneut einrichten und neu synchronisieren.',
    pl_PL:
      'Aktualizacja BTCPay Server do 2.3.9, NBXplorer do 2.6.7 oraz kontenera postgres do 18.1-1. Migracja 0.3.x → 0.4 pomija starsze dane portfela monero — użytkownicy z włączonym altcoinem monero powinni ponownie skonfigurować go za pomocą nowej zależności monerod i ponownie zsynchronizować.',
    fr_FR:
      'Mise à jour de BTCPay Server vers 2.3.9, NBXplorer vers 2.6.7 et du conteneur postgres vers 18.1-1. La migration 0.3.x → 0.4 ignore les données héritées du portefeuille monero — les utilisateurs avec l\'altcoin monero activé doivent l\'ajouter à nouveau via la nouvelle dépendance monerod et resynchroniser.',
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

      // Move data to dedicated volumes; pg_upgrade runs on first daemon start
      await migrateVolumes(effects)
    },
    down: IMPOSSIBLE,
  },
})
