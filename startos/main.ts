import { sdk } from './sdk'
import { uiPort } from './interfaces'
import { readFile } from 'fs/promises'
import { HealthCheckResult } from '@start9labs/start-sdk/package/lib/health/checkFns'
import { SubContainer } from '@start9labs/start-sdk'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('Starting BTCPay Server...')

  const apiHealthCheck = sdk.HealthCheck.of({
    effects,
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

  const syncHealthCheck = sdk.HealthCheck.of({
    effects,
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
          console.log(`NBX status response parsed as json: ${res}`)
          return jsonRes
        })
        .catch((e: any) => {
          throw new Error(e)
        })
      return nbxHealthCheck(res)
    },
  })

  const mainMounts = sdk.Mounts.of().addVolume('main', null, '/datadir', false)
  const lightningImplementation = await sdk.store
    .getOwn(effects, sdk.StorePath.lightningImplementation)
    .const()
  let BTCPAY_BTCLIGHTNING = ''
  if (lightningImplementation === 'lnd') {
    const mountpoint = mainMounts.addDependency(
      'lnd',
      'main', //@TODO verify
      'public', //@TODO verify
      '/mnt/lnd',
      true,
    )
    BTCPAY_BTCLIGHTNING = `type=lnd-rest;server=https://lnd.embassy:8080/;macaroonfilepath=${mountpoint}/admin.macaroon;allowinsecure=true`
  }
  if (lightningImplementation === 'cln') {
    const mountpoint = mainMounts.addDependency(
      'cln',
      'main', //@TODO verify
      'shared', //@TODO verify
      '/mnt/cln',
      true,
    )
    BTCPAY_BTCLIGHTNING = `type=clightning;server=unix://${mountpoint}/lightning-rpc`
  }

  // @TODO add smtp

  const NBXPLORER_STARTHEIGHT = await sdk.store
    .getOwn(effects, sdk.StorePath.startHeight)
    .const()

  return sdk.Daemons.of({
    effects,
    started,
    healthReceipts: [apiHealthCheck, syncHealthCheck],
  })
    .addDaemon('postgres', {
      image: { id: 'postgres' },
      mounts: sdk.Mounts.of().addVolume(
        'postgres',
        null,
        '/var/lib/postgresql/data',
        false,
      ),
      // @TODO needs a graceful shutdown command
      command: [
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
            { id: 'postges' },
            'postgres-ready',
          )
          return sdk.healthCheck.runHealthScript(['./postgres-ready.sh'], sub)
        },
      },
      requires: [],
    })
    .addDaemon('nbxplorer', {
      image: { id: 'nbx' },
      mounts: sdk.Mounts.of().addVolume('nbx', null, '/datadir', false),
      command: ['dotnet', '/nbxplorer/NBXplorer.dll'],
      env: {
        NBXPLORER_NETWORK: 'mainnet',
        NBXPLORER_PORT: '24444',
        NBXPLORER_BTCNODEENDPOINT: 'bitcoind.embassy:8333',
        NBXPLORER_BTCRPCURL: 'bitcoind.embassy:8332',
        NBXPLORER_BTCRPCUSER: 'btcpayserver',
        // @TODO get from bitcoin
        // NBXPLORER_BTCRPCPASSWORD,
        NBXPLORER_RESCAN: '1',
        NBXPLORER_STARTHEIGHT: NBXPLORER_STARTHEIGHT?.toString() || '-1',
      },
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
      image: { id: 'main' },
      mounts: mainMounts,
      command: ['dotnet', '/app/BTCPayServer.dll'],
      env: {
        BTCPAY_NETWORK: 'mainnet',
        BTCPAY_BIND: '0.0.0.0:23000',
        BTCPAY_NBXPLORER_COOKIE: '', // @TODO???,
        BTCPAY_BTCLIGHTNING,
      },
      // @TODO add trigger
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
