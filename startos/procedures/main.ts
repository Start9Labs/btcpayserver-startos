import { sdk } from "../sdk";
import { ExpectedExports } from "@start9labs/start-sdk/lib/types";
import { Daemons } from "@start9labs/start-sdk/lib/mainFn/Daemons";
import { uiPort } from "./interfaces";
import { healthCheck } from "@start9labs/start-sdk/lib/health/HealthCheck";
import { readFileSync } from "fs";
import { CheckResult } from "@start9labs/start-sdk/lib/health/checkFns";
import { dependencyMounts } from './dependencies/dependencyMounts'


export const main: ExpectedExports.main = sdk.setupMain(
  async ({ effects, utils, started }) => {
    const startHeight = -1;
    const apiHealthCheck = healthCheck({
      effects,
      name: "Data Interface",
      fn: () =>
        sdk.healthCheck.checkWebUrl(
          effects,
          "http://btcpayserver.embassy:23000/api/v1/health",
          {
            successMessage: `The API is fully operational`,
            errorMessage: `The API is unreachable`,
          },
        ),
    });
    console.info("Starting BTCPay Server for StartOS...");

    // @TODO dep mount based on config

    // @TODO add smtp

    return Daemons.of({
      effects,
      started,
      healthReceipts: [apiHealthCheck],
    })
      .addDaemon("postgres", {
        // @TODO needs a graceful shutdown command
        command: [
          "sudo",
          "-u",
          "postgres",
          "/usr/lib/postgresql/13/bin/postgres",
          "-D",
          "/datadir/postgresql/data",
        ],
        ready: {
          display: null,
          fn: () => {
            return { status: "disabled" };
          },
        },
        requires: [],
      })
      .addDaemon("postgres-ready", {
        command: "./postgres-ready.sh",
        ready: {
          display: null,
          fn: () => {
            return { status: "disabled" };
          },
        },
        requires: ["postgres"],
      })
      .addDaemon("nbxplorer", {
        command: [
          "dotnet",
          "/nbxplorer/NBXplorer.dll",
          "--btcrescan=1",
          `--btcstartheight=${startHeight}`,
        ],
        ready: {
          display: "UTXO Tracker Sync",
          fn: async () => {
            const auth = await readFileSync("/datadir/nbxplorer/Main/.cookie", {
              encoding: "base64",
            });
            const res = await effects.fetch(
              "http://127.0.0.1:24444/v1/cryptos/BTC/status",
              {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Basic ${auth}`,
                },
              },
            ).then(async (res) => {
              const jsonRes = await res.json() as NbxStatusRes;
              // @TODO remove me after testing
              console.log(`NBX status response is: ${res}`);
              console.log(`NBX status response parsed as json: ${res}`);
              return jsonRes;
            }).catch((e) => { throw new Error(e) })
            return nbxHealthCheck(res)
          },
        },
        requires: ["postgres-ready"],
      })
      .addDaemon("webui", {
        command: ["dotnet", "/app/BTCPayServer.dll"],
        ready: {
          display: "Web Interface",
          fn: () =>
            // @TODO needs a minDuration
            sdk.healthCheck.checkPortListening(effects, uiPort, {
              successMessage: "The web interface is reachable",
              errorMessage: "The web interface is unreachable",
            }),
        },
        requires: ["nbxplorer"],
      });
  },
);

interface NbxStatusRes {
  bitcoinStatus: {
    blocks: number;
    headers: number;
    verificationProgress: number; // float
    isSynched: boolean;
  };
  isFullySynched: boolean;
  chainHeight: number;
  syncHeight: number;
}

const nbxHealthCheck = (res: NbxStatusRes): CheckResult => {
  const { bitcoinStatus, isFullySynched, chainHeight, syncHeight } = res;

  if (isFullySynched) {
    return {
      // @TODO starting/loading status
      status: "passing",
      message: "Synced to the tip of the Bitcoin blockchain",
    };
  } else if (!isFullySynched && !bitcoinStatus.isSynched) {
    const percentage = (bitcoinStatus.verificationProgress * 100).toFixed(2);
    return {
      status: "warning",
      message:
        `The Bitcoin node is syncing. This must complete before the UTXO tracker can sync. Sync progress: ${percentage}%`,
    };
  } else if (!isFullySynched && bitcoinStatus.isSynched) {
    const progress = ((syncHeight / chainHeight) * 100).toFixed(2);
    return {
      status: "warning",
      message: `The UTXO tracker is syncing. Sync progress: ${progress}%`,
    };
  } else {
    return {
      // @TODO should be starting
      status: "passing",
    };
  }
};
