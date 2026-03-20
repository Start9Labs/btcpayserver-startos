import { IMPOSSIBLE, T, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { BTCPSEnv } from '../../fileModels/btcpay.env'
import { NBXplorerEnv } from '../../fileModels/nbxplorer.env'
import { storeJson } from '../../fileModels/store.json'
import { sdk } from '../../sdk'
import {
  clnConnectionString,
  getDefaultPgPassword,
  lndConnectionString,
  PG_MOUNT,
  pgMounts,
} from '../../utils'

const PG13_BIN = '/usr/lib/postgresql/13/bin'
const PG18_BIN = '/usr/lib/postgresql/18/bin'
const OLD_PGDATA = `${PG_MOUNT}/13/data`
const NEW_PGDATA = `${PG_MOUNT}/data`

async function migratePostgres(effects: T.Effects) {
  const pgVersion = await readFile(
    '/media/startos/volumes/main/postgresql/data/PG_VERSION',
    'utf-8',
  ).catch(() => null)

  if (pgVersion?.trim() !== '13') return

  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'postgres' },
    pgMounts,
    'pg-upgrade',
    async (sub) => {
      console.info('Upgrading PostgreSQL 13 to 18...')

      // Move old data to versioned subdir for pg_upgrade
      await sub.execFail(['mkdir', '-p', `${PG_MOUNT}/13`], { user: 'root' })
      await sub.execFail(['mv', `${PG_MOUNT}/data`, OLD_PGDATA], {
        user: 'root',
      })

      // Fix ownership
      await sub.execFail(['chown', '-R', 'postgres:postgres', PG_MOUNT], {
        user: 'root',
      })

      // Initialize new pg18 cluster
      await sub.execFail(['mkdir', '-p', NEW_PGDATA], { user: 'root' })
      await sub.execFail(['chmod', '700', NEW_PGDATA], { user: 'root' })
      await sub.execFail(['chown', 'postgres:postgres', NEW_PGDATA], {
        user: 'root',
      })
      await sub.execFail([`${PG18_BIN}/initdb`, '-D', NEW_PGDATA], {
        user: 'postgres',
      })

      // Run pg_upgrade --link
      await sub.execFail(
        [
          `${PG18_BIN}/pg_upgrade`,
          '--link',
          '-b',
          PG13_BIN,
          '-B',
          PG18_BIN,
          '-d',
          OLD_PGDATA,
          '-D',
          NEW_PGDATA,
        ],
        { user: 'postgres' },
      )

      // Post-upgrade: analyze
      await sub.execFail(
        [
          'pg_ctl',
          'start',
          '-D',
          NEW_PGDATA,
          '-w',
          '-o',
          '-c listen_addresses=',
        ],
        { user: 'postgres' },
      )
      await sub.execFail(['vacuumdb', '--all', '--analyze-in-stages'], {
        user: 'postgres',
      })
      await sub.execFail(['pg_ctl', 'stop', '-D', NEW_PGDATA, '-w'], {
        user: 'postgres',
      })

      // Clean up old data and artifacts
      await sub.execFail(['rm', '-rf', `${PG_MOUNT}/13`], { user: 'root' })

      console.info('PostgreSQL upgrade complete')
    },
  )
}

export const v_2_3_6_0_b1 = VersionInfo.of({
  version: '2.3.6:0-beta.1',
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

      if (configYaml) {
        const { plugins, lightning, altcoins } = configYaml

        await storeJson.write(effects, {
          pgPassword: getDefaultPgPassword(),
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

        await NBXplorerEnv.merge(effects, {})

        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch((e) => console.error(e))
      } else {
        // Previous 0.4.0 beta — ensure pgPassword exists
        const existing = await storeJson.read((s) => s.pgPassword).once()
        await storeJson.merge(effects, {
          pgPassword: existing || getDefaultPgPassword(),
        })
      }

      // Upgrade PostgreSQL 13 → 18 (runs for 0.3.x and previous 0.4.0 betas)
      await migratePostgres(effects)
    },
    down: IMPOSSIBLE,
  },
})
