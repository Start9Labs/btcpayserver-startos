import { sdk } from '../sdk'
import { ExpectedExports } from '@start9labs/start-sdk/lib/types'
import { Daemons } from '@start9labs/start-sdk/lib/mainFn/Daemons'
import { uiPort } from './interfaces'
import { healthCheck } from '@start9labs/start-sdk/lib/health/HealthCheck'
import { CheckResult } from '@start9labs/start-sdk/lib/health/checkFns'
import { readFile } from 'fs/promises'
import { mountDependencies } from '@start9labs/start-sdk/lib/dependency/mountDependencies'
import { dependencyMounts } from './dependencies/dependencyMounts'

export const main: ExpectedExports.main = sdk.setupMain(
  async ({ effects, utils, started }) => {
    console.info('Starting BTCPay Server for StartOS...')

    const apiHealthCheck = healthCheck({
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

    const lightningImplementation = await utils.store
      .getOwn('/lightningImplementation')
      .once()
    let BTCPAY_BTCLIGHTNING = ''
    if (lightningImplementation === 'lnd') {
      const mountpoint = await mountDependencies(
        effects,
        dependencyMounts.lnd.main.public,
      )
      BTCPAY_BTCLIGHTNING = `type=lnd-rest;server=https://lnd.embassy:8080/;macaroonfilepath=${mountpoint}/admin.macaroon;allowinsecure=true`
    }
    if (lightningImplementation === 'cln') {
      const mountpoint = await mountDependencies(
        effects,
        dependencyMounts.cln.main.shared,
      )
      BTCPAY_BTCLIGHTNING = `type=clightning;server=unix://${mountpoint}/lightning-rpc`
    }

    // @TODO add smtp

    const NBXPLORER_STARTHEIGHT = await utils.store
      .getOwn('/startHeight')
      .const()
    const NBXPLORER_BTCRPCPASSWORD = await utils.vault
      .get('btcRpcPassword')
      .once()

    return Daemons.of({
      effects,
      started,
      healthReceipts: [apiHealthCheck],
    })
      .addDaemon('postgres', {
        // @TODO needs a graceful shutdown command
        command: [
          'sudo',
          '-u',
          'postgres',
          '/usr/lib/postgresql/13/bin/postgres',
          '-D',
          '/datadir/postgresql/data',
        ],
        ready: {
          display: null,
          fn: () => {
            return sdk.healthCheck.runHealthScript(effects, [
              './postgres-ready.sh',
            ])
          },
        },
        requires: [],
      })
      .addDaemon('nbxplorer', {
        command: ['dotnet', '/nbxplorer/NBXplorer.dll'],
        env: {
          NBXPLORER_NETWORK: 'mainnet',
          NBXPLORER_PORT: '24444',
          NBXPLORER_BTCNODEENDPOINT: 'bitcoind.embassy:8333',
          NBXPLORER_BTCRPCURL: 'bitcoind.embassy:8332',
          NBXPLORER_BTCRPCUSER: 'btcpayserver',
          NBXPLORER_BTCRPCPASSWORD,
          NBXPLORER_RESCAN: '1',
          NBXPLORER_STARTHEIGHT: NBXPLORER_STARTHEIGHT?.toString() || '-1',
        },
        ready: {
          display: 'UTXO Tracker Sync',
          // @TODO this should be an additional health check
          fn: async () => {
            const auth = await readFile('/datadir/nbxplorer/Main/.cookie', {
              encoding: 'base64',
            })
            const res = await effects
              .fetch('http://127.0.0.1:24444/v1/cryptos/BTC/status', {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Basic ${auth}`,
                },
              })
              .then(async (res) => {
                const jsonRes = (await res.json()) as NbxStatusRes
                // @TODO remove me after testing
                console.log(`NBX status response is: ${res}`)
                console.log(`NBX status response parsed as json: ${res}`)
                return jsonRes
              })
              .catch((e) => {
                throw new Error(e)
              })
            return nbxHealthCheck(res)
          },
        },
        requires: ['postgres'],
      })
      .addDaemon('webui', {
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
  },
)

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

const nbxHealthCheck = (res: NbxStatusRes): CheckResult => {
  const { bitcoinStatus, isFullySynched, chainHeight, syncHeight } = res

  if (isFullySynched) {
    return {
      // @TODO starting/loading status
      status: 'passing',
      message: 'Synced to the tip of the Bitcoin blockchain',
    }
  } else if (!isFullySynched && !bitcoinStatus.isSynched) {
    const percentage = (bitcoinStatus.verificationProgress * 100).toFixed(2)
    return {
      status: 'warning',
      message: `The Bitcoin node is syncing. This must complete before the UTXO tracker can sync. Sync progress: ${percentage}%`,
    }
  } else if (!isFullySynched && bitcoinStatus.isSynched) {
    const progress = ((syncHeight / chainHeight) * 100).toFixed(2)
    return {
      status: 'warning',
      message: `The UTXO tracker is syncing. Sync progress: ${progress}%`,
    }
  } else {
    return {
      // @TODO should be starting
      status: 'passing',
    }
  }
}
