import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { load } from 'js-yaml'
import { BTCPSEnv } from '../../fileModels/btcpay.env'
import { storeJson } from '../../fileModels/store.json'
import { clnMountpoint, lndMountpoint } from '../../utils'

export const v_2_1_1_0 = VersionInfo.of({
  version: '2.1.1:0',
  releaseNotes: 'Updated for StartOS v0.4.0.',
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

      // Set store config
      await storeJson.merge(effects, {
        startHeight: parseInt(advanced['sync-start-height']),
        plugins: {
          shopify: plugins.shopify.status === 'enabled' ? true : false,
        },
        altcoins: {
          monero: altcoins.monero.status === 'enabled' ? true : false,
        },
      })

      // Set lightning node selection
      if (lightning.type === 'lnd') {
        await BTCPSEnv.merge(effects, {
          BTCPAY_BTCLIGHTNING: `type=lnd-rest;server=https://lnd.startos:8080/;macaroonfilepath=${lndMountpoint}/admin.macaroon;allowinsecure=true`,
        })
      }

      if (lightning.type === 'c-lightning') {
        await BTCPSEnv.merge(effects, {
          BTCPAY_BTCLIGHTNING: `type=clightning;server=unix://${clnMountpoint}/lightning-rpc`,
        })
      }

      // remove old start9 dir
      rm('/media/startos/volumes/main/start9', { recursive: true }).catch(
        console.error,
      )
    },
    down: IMPOSSIBLE,
  },
})
