import { T, YAML } from '@start9labs/start-sdk'
import { readFile, stat } from 'fs/promises'
import { btcpayConfig } from '../fileModels/btcpay.config'
import { storeJson } from '../fileModels/store.json'
import { raiseLightningCredentialTask } from '../lightningCredentialTask'
import { sdk } from '../sdk'
import {
  clnConnectionString,
  LND_REST_FALLBACK,
  lndConnectionString,
  PG_MOUNT,
} from '../utils'

/**
 * Move an install still on the 0.3.x single-`main` layout onto the dedicated
 * volumes, and translate its `config.yaml` into the file models.
 *
 * Keyed on the layout, not a version vertex, and it has to stay that way: a
 * migration on `X` runs only for installs sorting below `X`, and a 0.3.x
 * install arrives as whatever the emver converter makes of its old version —
 * 0.3.x `2.4.2.1` becomes `2.4.2:1`. Every 0.3.x release from 2.4.2 onward
 * sorts above `2.4.0:2`, where this used to sit, and skipped it entirely.
 *
 * A PostgreSQL 13 cluster under `main` means the move has not run here; the
 * move deletes it on success, so this is self-limiting.
 *
 * Transitional. Delete once no 0.3.x installs remain in the wild.
 */

// Paths as the init runtime sees the volumes.
const LEGACY_ROOT = '/media/startos/volumes/main'
const LEGACY_CONFIG = `${LEGACY_ROOT}/start9/config.yaml`
const LEGACY_MARKER = `${LEGACY_ROOT}/postgresql/data/PG_VERSION`

// Mountpoints inside the subcontainer that does the moving.
const MAIN = '/mnt/main'
const BTCPAY = '/mnt/btcpay'
const NBX = '/mnt/nbx'
const OLD_PGDATA = `${MAIN}/postgresql/data`
const LEGACY_MARKER_IN_SUB = `${OLD_PGDATA}/PG_VERSION`

type LegacyConfig = {
  lightning?: { type?: 'lnd' | 'c-lightning' }
  altcoins?: { monero?: { status?: 'enabled' | 'disabled' } }
  plugins?: { shopify?: { status?: 'enabled' | 'disabled' } }
}

const exists = (path: string) =>
  stat(path).then(
    () => true,
    () => false,
  )

/**
 * Move anything already in the destination volumes aside, into `main`.
 *
 * The destinations are not necessarily empty: an install that took the broken
 * update ran a fresh BTCPay against them, so they can hold a live PostgreSQL 18
 * cluster and a new admin's real data. Hence moved aside, not deleted.
 *
 * The snapshot has to land in `main` rather than under the volume it came from:
 * the postgres entrypoint sweeps every entry at the db mount root into the old
 * cluster's directory before running pg_upgrade, so a snapshot left there would
 * be handed to pg_upgrade as PostgreSQL 13 data.
 */
function snapshotScript(stamp: string) {
  const dest = `${MAIN}/superseded-${stamp}`
  return `set -e
    # Independent of the caller's marker check: moving the destinations aside
    # is only safe if there is a legacy layout to put in their place.
    [ -f ${LEGACY_MARKER_IN_SUB} ] || exit 0
    for pair in "db:${PG_MOUNT}" "btcpayserver:${BTCPAY}" "nbxplorer:${NBX}"; do
      name=\${pair%%:*}
      dir=\${pair#*:}
      [ -d "$dir" ] || continue
      [ -n "$(find "$dir" -mindepth 1 -maxdepth 1 -print -quit)" ] || continue
      mkdir -p "${dest}/$name"
      find "$dir" -mindepth 1 -maxdepth 1 -exec mv -t "${dest}/$name/" {} +
    done`
}

/**
 * Volume mapping:
 *   main/btcpayserver  →  btcpayserver volume
 *   main/plugins       →  btcpayserver volume (Plugins/)
 *   main/nbxplorer     →  nbxplorer volume
 *   main/postgresql    →  db volume
 *
 * The PostgreSQL 13 → 18 upgrade is the postgres entrypoint's job on first
 * daemon start. It reads `PG_VERSION` at the volume root, so the 13 data files
 * go there and not in a `data/` subdirectory, which it hard-errors on. `PGDATA`
 * is `/var/lib/postgresql/18/docker`.
 */
async function moveVolumes(effects: T.Effects, stamp: string) {
  const mounts = sdk.Mounts.of()
    .mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: MAIN,
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
      mountpoint: BTCPAY,
      readonly: false,
    })
    .mountVolume({
      volumeId: 'nbxplorer',
      subpath: null,
      mountpoint: NBX,
      readonly: false,
    })

  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'postgres' },
    mounts,
    'repair-legacy-layout',
    async (sub) => {
      await sub.execFail(['sh', '-c', snapshotScript(stamp)], { user: 'root' })

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
          if [ -d ${MAIN}/btcpayserver ]; then
            cd ${MAIN}/btcpayserver
            find . -mindepth 1 -maxdepth 1 ! -name altcoins -exec cp -a -t ${BTCPAY}/ {} +
            if [ -d altcoins ]; then
              mkdir -p ${BTCPAY}/altcoins
              find altcoins -mindepth 1 -maxdepth 1 ! -name monero -exec cp -a -t ${BTCPAY}/altcoins/ {} +
            fi
          fi`,
        ],
        { user: 'root' },
      )
      await sub.execFail(['mkdir', '-p', `${BTCPAY}/Plugins`], { user: 'root' })
      await sub.execFail(
        [
          'sh',
          '-c',
          `set -e
          if [ -d ${MAIN}/plugins ]; then
            cp -a ${MAIN}/plugins/. ${BTCPAY}/Plugins/
          fi`,
        ],
        { user: 'root' },
      )
      await sub.execFail(
        [
          'sh',
          '-c',
          `set -e
          if [ -d ${MAIN}/nbxplorer ]; then
            cp -a ${MAIN}/nbxplorer/. ${NBX}/
          fi`,
        ],
        { user: 'root' },
      )
      await sub.execFail(
        [
          'sh',
          '-c',
          `set -e
          if [ -d ${OLD_PGDATA} ]; then
            cp -a ${OLD_PGDATA}/. ${PG_MOUNT}/
          fi`,
        ],
        { user: 'root' },
      )
      await sub.execFail(['chown', '-R', 'postgres:postgres', PG_MOUNT], {
        user: 'root',
      })

      // Last, and only on success: removing the old layout is what stops this
      // running again.
      await sub.execFail(
        [
          'rm',
          '-rf',
          `${MAIN}/postgresql`,
          `${MAIN}/btcpayserver`,
          `${MAIN}/plugins`,
          `${MAIN}/nbxplorer`,
          `${MAIN}/start9`,
        ],
        { user: 'root' },
      )
    },
  )
}

export const repairLegacyLayout = sdk.setupOnInit(
  async (effects, _kind, progress) => {
    if (!(await exists(LEGACY_MARKER))) return

    const phase = progress.addPhase(
      'Moving your BTCPay Server data to its new storage',
      10,
    )
    phase.start()

    // Read before moving — the move deletes start9/config.yaml.
    const legacy: LegacyConfig | undefined = await readFile(
      LEGACY_CONFIG,
      'utf-8',
    ).then(YAML.parse, () => undefined)

    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    await moveVolumes(effects, stamp)

    // After the move: the copy brings the 0.3.x settings.config with it, so
    // merging first would be overwritten by it. Merging after also repairs the
    // stale 0.3.x paths it carries, which are `z.literal().catch()` fields.
    if (legacy) {
      await storeJson.merge(effects, {
        plugins: { shopify: legacy.plugins?.shopify?.status === 'enabled' },
      })
      await btcpayConfig.merge(effects, {
        btclightning:
          legacy.lightning?.type === 'lnd'
            ? // placeholder address — setupMain resolves LND's real bridge
              // address over the LXC bridge on first start (see utils.ts)
              lndConnectionString(LND_REST_FALLBACK)
            : legacy.lightning?.type === 'c-lightning'
              ? clnConnectionString
              : undefined,
        chains:
          legacy.altcoins?.monero?.status === 'enabled' ? 'btc,xmr' : 'btc',
      })
    }

    await raiseLightningCredentialTask(effects)

    phase.complete()
  },
)
