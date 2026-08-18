import { T, YAML } from '@start9labs/start-sdk'
import { readFile, stat } from 'fs/promises'
import { btcpayConfig } from '../fileModels/btcpay.config'
import { storeJson } from '../fileModels/store.json'
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
 * This used to live on the 2.4.0:2 version vertex, which was the bug: a version
 * migration only runs for installs that sit *below* the vertex, and a 0.3.x
 * install arrives at whatever exver the emver converter produces. Every 0.3.x
 * release from 2.4.0.3 to the final 2.4.3 lands above 2.4.0:2, so the move was
 * skipped and BTCPay came up against empty volumes — a clean-looking install
 * with no invoices, stores or users, and every password rejected.
 *
 * Layout is not a function of version, so the trigger is the layout itself. A
 * PostgreSQL 13 cluster under `main` means the move has not run here; the move
 * deletes it on success, so this is self-limiting and safe to run every init.
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
 * Snapshot anything already sitting in the destination volumes.
 *
 * Installs that took the broken update ran a fresh BTCPay against empty
 * volumes, so the destinations hold a newly initialised database rather than
 * nothing. Overwriting a live PostgreSQL 18 cluster with PostgreSQL 13 files
 * produces a cluster that will not start, and anyone who gave up and created a
 * new admin has real data in there. So move it aside rather than delete it.
 *
 * It goes in `main` — which this function empties anyway — rather than into a
 * subdirectory of the volume it came from, and for the db volume that is not a
 * matter of taste. The postgres image's entrypoint sweeps *everything* at the
 * mount root into the old cluster's directory before upgrading it:
 *
 *     for d in "$PGMOUNT"/*; do
 *       [[ "$d" == "$PGMOUNT/$CURRENT_PGVERSION" ]] && continue
 *       [[ "$d" == "$PGDATANEW" ]] && continue
 *       mv "$d" "$PGDATAOLD/"
 *     done
 *
 * A snapshot left at the db volume root would be swept into the PostgreSQL 13
 * data directory and handed to pg_upgrade. Putting it in `main` leaves each
 * destination exactly as a never-updated install would.
 */
function snapshotScript(stamp: string) {
  const dest = `${MAIN}/superseded-${stamp}`
  return `set -e
    # Self-guard, independent of the caller's marker check. Moving the
    # destinations aside is only safe if there is a legacy layout to put in
    # their place — a spurious run would otherwise snapshot data this step had
    # already restored and copy nothing back, emptying the volumes it repaired.
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
 * The PostgreSQL 13 → 18 upgrade is the postgres image entrypoint's job on
 * first daemon start; all this has to do is leave the 13 data files where the
 * entrypoint looks for them, which is the volume root — it reads
 * `/var/lib/postgresql/PG_VERSION` to discover the old version, and hard-errors
 * if a `data` directory exists there. `PGDATA` is `/var/lib/postgresql/18/docker`.
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

    // After the move, not before: the copy brings the 0.3.x settings.config
    // with it, so merging first would be overwritten by it. Merging now also
    // repairs the stale 0.3.x paths it carries, since those fields are
    // `z.literal().catch()` and merge restores them to the values 0.4 uses.
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

    phase.complete()
  },
)
