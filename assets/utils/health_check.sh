#!/bin/bash

set -ea

check_synched(){
    AUTH=$(cat /datadir/nbxplorer/Main/.cookie | base64 -w 0)
    STATUS_RES=$(curl --silent --show-error --fail -H "Authorization: Basic $AUTH" -H "Content-Type: application/json" http://127.0.0.1:24444/v1/cryptos/BTC/status)
    IS_SYNCED=$(echo $STATUS_RES | jq .isFullySynched)
    PROGRESS=$(echo $STATUS_RES | jq .verificationProgress)

    if [ "$IS_SYNCED" = true ]; then
        exit 0
    elif [ "$IS_SYNCED" = false ]; then
        PERCENTAGE=$(bc -l <<<"100*$PROGRESS")
        echo "UTXO tracker syncing. Progress: $(printf "%.2f" $PERCENTAGE)%" >&2
        exit 61
    else
        # Starting
        exit 60
    fi
}

check_api(){
    SYNCHRONIZED=$(curl --silent --show-error --fail http://btcpayserver.embassy:23000/api/v1/health | jq .synchronized)

    if [ "$SYNCHRONIZED" = true ]; then
        exit 0
    elif [ "$SYNCHRONIZED" = false ]; then
        exit 1
    else
        # Starting
        exit 60
    fi
}


case "$1" in
    nbx)
        check_synched
        ;;
	api)
        check_api
        ;;
    *)
        echo "Usage: $0 [command]"
        echo
        echo "Commands:"
        echo "         nbx"
        echo "         api"
esac