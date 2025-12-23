import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { BTCPSEnv } from '../../fileModels/btcpay.env'
import { storeJson } from '../../fileModels/store.json'
import { NBXplorerEnv } from '../../fileModels/nbxplorer.env'
import { clnMountpoint, lndMountpoint, nbxEnvDefaults } from '../../utils'
import { sdk } from '../../sdk'

export const v_2_2_1_2 = VersionInfo.of({
  version: '2.2.1:2-beta.1',
  releaseNotes: 'Updated for StartOS v0.4.0.',
  migrations: {
    up: async ({ effects }) => {
      // get old config.yaml
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
          plugins: {
            shopify: plugins.shopify.status === 'enabled' ? true : false,
          },
          lightning: 'none',
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

        if (altcoins.monero.status === 'enabled') {
          await BTCPSEnv.merge(effects, {
            BTCPAY_CHAINS: 'btc,xmr',
          })
        }

        // remove old start9 dir
        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch((e) => console.error(e))
      }

      // set nbx config
      await NBXplorerEnv.write(effects, { ...nbxEnvDefaults })

      // set postgres permissions
      await sdk.SubContainer.withTemp(
        effects,
        { imageId: 'postgres' },
        sdk.Mounts.of().mountVolume({
          volumeId: 'main',
          subpath: null,
          mountpoint: '/datadir',
          readonly: false,
        }),
        'set-postgres',
        async (sub) => {
          await sub.exec(['chmod', '777', '/datadir'])
          await sub.exec(['mkdir', '-p', '/datadir/postgresql/data'])
          await sub.exec(['chmod', '777', '/datadir/postgresql'])
          await sub.exec([
            'chown',
            '-R',
            'postgres:postgres',
            '/datadir/postgresql/data',
          ])
        },
      )
    },
    down: IMPOSSIBLE,
  },
})
