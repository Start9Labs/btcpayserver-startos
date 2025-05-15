import { sdk } from './sdk'
import { readFile } from 'fs/promises'
import { HealthCheckResult } from '@start9labs/start-sdk/package/lib/health/checkFns'
import { SubContainer } from '@start9labs/start-sdk'
import { NBXplorerEnvFile } from './file-models/nbxplorer.env'
import { BTCPSEnvFile } from './file-models/btcpay.env'
import { uiPort, webInterfaceId } from './utils'

export const mainMounts = sdk.Mounts.of().addVolume(
  'main',
  null,
  '/datadir',
  false,
)

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   */
  console.info('Starting BTCPay Server...')

  const apiHealthCheck = sdk.HealthCheck.of(effects, {
    id: 'data-interface',
    name: 'Data Interface',
    fn: () =>
      sdk.healthCheck.checkWebUrl(
        effects,
        'http://btcpayserver.embassy:23000/api/v1/health',
        {
          successMessage: `The API is fully operational`,
          errorMessage: `The API is unreachable`,
        },
      ),
  })

  // @TODO add smtp via greenfield api

  const startHeight = await sdk.store
    .getOwn(effects, sdk.StorePath.startHeight)
    .const()

  await NBXplorerEnvFile.merge(effects, {
    NBXPLORER_NETWORK: 'mainnet',
    NBXPLORER_PORT: '24444',
    NBXPLORER_BTCNODEENDPOINT: 'bitcoind.startos:8333',
    NBXPLORER_BTCRPCURL: 'bitcoind.startos:8332',
    NBXPLORER_RESCAN: '1',
    NBXPLORER_STARTHEIGHT: startHeight ? startHeight.toString() : '-1',
  })

  const ip = await sdk.getContainerIp(effects)
  const urls =
    (await sdk.serviceInterface.getOwn(effects, webInterfaceId).const())
      ?.addressInfo?.urls || []

  await BTCPSEnvFile.merge(effects, {
    BTCPAY_NETWORK: 'mainnet',
    BTCPAY_BIND: '0.0.0.0:23000',
    BTCPAY_NBXPLORER_COOKIE: '/datadir/nbxplorer/Main/.cookie',
    BTCPAY_SOCKSENDPOINT: 'startos:9050',
  })

  const btcpayContainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'btcpay' },
    mainMounts,
    'btcpay',
  )
  const nbxContainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'nbx' },
    mainMounts,
    'nbx',
  )

  // source env files
  await btcpayContainer.exec([
    'source',
    '/media/startos/volumes/main/btcpay.env',
  ])
  await nbxContainer.exec([
    'source',
    '/media/startos/volumes/main/nbxplorer.env',
  ])

  /**
   * ======================== Additional Health Checks (optional) ========================
   */
  const syncHealthCheck = sdk.HealthCheck.of(effects, {
    id: 'sync',
    name: 'UTXO Tracker Sync',
    fn: async () => {
      const auth = await readFile('/datadir/nbxplorer/Main/.cookie', {
        encoding: 'base64',
      })
      const res = await fetch('http://127.0.0.1:24444/v1/cryptos/BTC/status', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
      })
        .then(async (res: any) => {
          const jsonRes = (await res.json()) as NbxStatusRes
          // @TODO remove me after testing
          console.log(`NBX status response is: ${res}`)
          console.log(`NBX status response parsed as json: ${jsonRes}`)
          return jsonRes
        })
        .catch((e: any) => {
          throw new Error(e)
        })
      return nbxHealthCheck(res)
    },
  })

  /**
   *  ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects, started, [apiHealthCheck, syncHealthCheck])
    .addDaemon('postgres', {
      subcontainer: await SubContainer.of(
        effects,
        { imageId: 'postgres' },
        mainMounts,
        'postgres',
      ),
      command: [
        'sudo',
        '-u',
        'postgres',
        '/usr/lib/postgresql/13/bin/postgres',
        '-D',
        '/datadir/postgresql/data',
        '-c',
        'random_page_cost=1.0',
        '-c',
        'shared_preload_libraries=pg_stat_statements',
      ],
      env: {
        POSTGRES_HOST_AUTH_METHOD: 'trust',
      },
      ready: {
        display: null,
        fn: async () => {
          const sub = await SubContainer.of(
            effects,
            { imageId: 'postgres' },
            mainMounts,
            'postgres-ready',
          )
          // @TODO confirm path
          return sdk.healthCheck.runHealthScript(
            ['/assets/postgres-ready.sh'],
            sub,
          )
        },
      },
      requires: [],
    })
    .addDaemon('nbxplorer', {
      subcontainer: nbxContainer,
      command: ['dotnet', '/nbxplorer/NBXplorer.dll'],
      env: {},
      ready: {
        display: 'UTXO Tracker Sync',
        fn: async () =>
          sdk.healthCheck.checkPortListening(effects, 24444, {
            successMessage: 'The explorer is reachable',
            errorMessage: 'The explorer is unreachable',
          }),
      },
      requires: ['postgres'],
    })
    .addDaemon('webui', {
      subcontainer: btcpayContainer,
      command: ['dotnet', '/app/BTCPayServer.dll'],
      env: {},
      // @TODO add trigger?
      ready: {
        display: 'Web Interface',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: 'The web interface is reachable',
            errorMessage: 'The web interface is unreachable',
          }),
      },
      requires: ['nbxplorer'],
    })
})

interface NbxStatusRes {
  bitcoinStatus: {
    blocks: number
    headers: number
    verificationProgress: number // float
    isSynched: boolean
  }
  isFullySynched: boolean
  chainHeight: number
  syncHeight: number
}

const nbxHealthCheck = (res: NbxStatusRes): HealthCheckResult => {
  const { bitcoinStatus, isFullySynched, chainHeight, syncHeight } = res

  if (isFullySynched) {
    return {
      result: 'success',
      message: 'Synced to the tip of the Bitcoin blockchain',
    }
  } else if (!isFullySynched && !bitcoinStatus.isSynched) {
    const percentage = (bitcoinStatus.verificationProgress * 100).toFixed(2)
    return {
      result: 'loading',
      message: `The Bitcoin node is syncing. This must complete before the UTXO tracker can sync. Sync progress: ${percentage}%`,
    }
  } else if (!isFullySynched && bitcoinStatus.isSynched) {
    const progress = ((syncHeight / chainHeight) * 100).toFixed(2)
    return {
      result: 'loading',
      message: `The UTXO tracker is syncing. Sync progress: ${progress}%`,
    }
  } else {
    return {
      result: 'starting',
      message: 'BTCPay is starting',
    }
  }
}
