#!/bin/sh

set -ea

# AUTH=$(cat /datadir/nbxplorer/Main/.cookie | base64)
STATUS_RES=$(curl -H "Authorization: Basic $AUTH" -H "Content-Type: application/json" http://localhost:24444/v1/cryptos/BTC/status)
IS_SYNCED=$(echo "$STATUS_RES" | jq .isFullySynched)
PROGRESS=$(echo "$STATUS_RES" | jq .verificationProgress)

if [ "$STATUS_RES" = "null" ]; then
    # Starting
    exit 60
elif [ "$IS_SYNCED" = "true" ]; then
    exit 0
else
    PERCENTAGE=$( bc -l <<<"100*$PROGRESS" )
    echo "UTXO tracker syncing. Progress: $(printf "%.2f" $PERCENTAGE)%" >&2
    exit 61
fi
