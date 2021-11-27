#!/bin/sh

set -e

AUTH=$(cat /datadir/nbxplorer/Main/.cookie | base64)

if [ "$(curl -H "Authorization: Basic $AUTH" -H "Content-Type: application/json" http://127.0.0.1:24444/v1/cryptos/BTC/status | jq .isFullySynched)" = "true" ]; then
    exit 0
else
    echo "UTXO tracker syncing" >&2
    exit 61
fi
