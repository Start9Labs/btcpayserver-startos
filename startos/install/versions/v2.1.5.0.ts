import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { load } from 'js-yaml'
import { BTCPSEnv } from '../../fileModels/btcpay.env'
import { storeJson } from '../../fileModels/store.json'
import { NBXplorerEnv } from '../../fileModels/nbxplorer.env'
import { clnMountpoint, lndMountpoint, nbxEnvDefaults } from '../../utils'

export const v_2_1_5_0 = VersionInfo.of({
  version: '2.1.5:0-alpha.1',
  releaseNotes: 'Updated for StartOS v0.4.0.',
  migrations: {
    up: async ({ effects }) => {
      const { lightning, altcoins, plugins } = load(
        await readFile(
          '/media/startos/volumes/main/start9/config.yaml',
          'utf-8',
        ),
      ) as {
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
        plugins: {
          shopify: plugins.shopify.status === 'enabled' ? true : false,
        },
      })

      // Set lightning node selection
      if (lightning.type === 'lnd') {
        await storeJson.merge(effects, { lightning: lightning.type })
        await BTCPSEnv.merge(effects, {
          BTCPAY_BTCLIGHTNING: `type=lnd-rest;server=https://lnd.startos:8080/;macaroonfilepath=${lndMountpoint}/admin.macaroon;allowinsecure=true`,
        })
      }

      if (lightning.type === 'c-lightning') {
        await storeJson.merge(effects, { lightning: 'cln' })
        await BTCPSEnv.merge(effects, {
          BTCPAY_BTCLIGHTNING: `type=clightning;server=unix://${clnMountpoint}/lightning-rpc`,
        })
      }

      if (altcoins.monero.status) {
        await BTCPSEnv.merge(effects, {
          BTCPAY_CHAINS: 'btc,xmr',
        })
      }

      // set nbx config
      await NBXplorerEnv.write(effects, { ...nbxEnvDefaults })

      // remove old start9 dir
      rm('/media/startos/volumes/main/start9', { recursive: true }).catch(
        console.error,
      )
    },
    down: IMPOSSIBLE,
  },
})
