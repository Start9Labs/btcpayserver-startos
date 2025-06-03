import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { load } from 'js-yaml'
import { BTCPSEnvFile } from '../../fileModels/btcpay.env'
import { store } from '../../fileModels/store.json'

export const v_2_1_1_0 = VersionInfo.of({
  version: '2.1.1:0',
  releaseNotes: 'Revamped for StartOS 0.4.0.',
  migrations: {
    up: async ({ effects }) => {
      const { lightning, altcoins, advanced, plugins } = load(
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
        plugins: {
          shopify: {
            status: 'enabled' | 'disabled'
          }
        }
      }

      await store.merge(effects, {
        startHeight: parseInt(advanced['sync-start-height']),
        plugins: {
          shopify: plugins.shopify.status === 'enabled' ? true : false,
        },
        altcoins: {
          monero: altcoins.monero.status === 'enabled' ? true : false,
        },
      })

      await BTCPSEnvFile.merge(effects, {
        BTCPAY_BTCLIGHTNING: lightning.type,
      })

      // remove old start9 dir
      rm('/media/startos/volumes/main/start9', { recursive: true }).catch(
        console.error,
      )
    },
    down: IMPOSSIBLE,
  },
})
