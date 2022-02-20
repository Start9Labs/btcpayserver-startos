#!/bin/bash

check_synched(){
    AUTH=$(cat /datadir/nbxplorer/Main/.cookie | base64 -w 0)
    STATUS_RES=$(curl --silent --show-error --fail -H "Authorization: Basic $AUTH" -H "Content-Type: application/json" http://127.0.0.1:24444/v1/cryptos/BTC/status)
    IS_BTC_SYNCED=$(echo $STATUS_RES | jq .bitcoinStatus.isSynched)
    BTC_VERIFICATION_PROGRESS=$(echo $STATUS_RES | jq .bitcoinStatus.verificationProgress)
    IS_NBX_SYNCED=$(echo $STATUS_RES | jq .isFullySynched)
    CHAIN_HEIGHT=$(echo $STATUS_RES | jq .chainHeight)
    SYNC_HEIGHT=$(echo $STATUS_RES | jq .syncHeight)

    if [[ $IS_NBX_SYNCED == true ]]; then
        exit 0
    elif [[ $IS_NBX_SYNCED == false && $IS_BTC_SYNCED == false ]]; then
        PERCENTAGE=$(bc -l <<<"100*$BTC_VERIFICATION_PROGRESS")
        echo "Bitcoin node syncing. This must complete before the UTXO explorer can sync. Verification progress: $(printf "%.2f" $PERCENTAGE)%" >&2
        exit 61 # Loading
    elif [[ $IS_NBX_SYNCED == false && $IS_BTC_SYNCED == true ]]; then
        PROGRESS=$(echo "scale=6; $SYNC_HEIGHT / $CHAIN_HEIGHT" | bc)
        PERCENTAGE=$(bc -l <<<"100*$PROGRESS")
        echo "UTXO explorer syncing. Progress: $(printf "%.2f" $PERCENTAGE)%" >&2
        exit 61 # Loading
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

check_web(){
    DURATION=$(</dev/stdin)
    if (($DURATION <= 30000 )); then 
        exit 60
    else
        curl --silent --fail btcpayserver.embassy:23000 &>/dev/null
        RES=$?
        if test "$RES" != 0; then
            echo "Web interface is unreachable" >&2
            exit 1
        fi
    fi
}

case "$1" in
    nbx)
        check_synched
        ;;
	api)
        check_api
        ;;
	web)
        check_web
        ;;
    *)
        echo "Usage: $0 [command]"
        echo
        echo "Commands:"
        echo "         nbx"
        echo "         api"
        echo "         web"
esac