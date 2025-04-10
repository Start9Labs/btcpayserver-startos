import { VersionInfo, FileHelper, IMPOSSIBLE } from '@start9labs/start-sdk'
import { readFile, rmdir } from 'fs/promises'
import { load } from 'js-yaml'
import { sdk } from '../sdk'
import { BTCPSEnvFile } from '../file-models/btcpay.env'

export const v210_1 = VersionInfo.of({
  version: '2.1.0:1',
  releaseNotes: 'Revamped for StartOS 0.4.0.',
  migrations: {
    up: async ({ effects }) => {
      const { lightning, altcoins, advanced } = load(
        await readFile('/datadir/start9/config.yaml', 'utf-8'),
      ) as {
        advanced: {
          'sync-start-height': string
        }
        lightning: {
          type: 'lnd' | 'c-lightning'
        }
        altcoins: {
          monero: {
            status: 'enabled' | 'disabled'
          }
        }
      }

      await sdk.store.setOwn(effects, sdk.StorePath, {
        startHeight: parseInt(advanced['sync-start-height']),
      })

      await BTCPSEnvFile.merge(effects, {
        BTCPAY_BTCLIGHTNING: lightning.type,
      })

      // remove old start9 dir
      await rmdir('/datadir/start9')
    },
    down: IMPOSSIBLE,
  },
})
