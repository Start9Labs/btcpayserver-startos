#!/bin/bash

set -ea

if [ "$#" -ne "0" ]; then
  exec btcpay-admin.sh $@
fi

_term() { 
  echo "Caught SIGTERM signal!" 
  kill -TERM "$nbxplorer_process" 2>/dev/null
  kill -TERM "$btcpayserver_process" 2>/dev/null
}

if ! test -d /mnt/lnd then
  echo "LND mountpoint does not exist"
  exit 0
fi

if ! test -d /mnt/c-lightning then
  echo "C-Lightning mountpoint does not exist"
  exit 0
fi

while ! test -f /mnt/lnd/admin.macaroon
do
  echo "Waiting for LND admin macaroon to be generated..."
  sleep 1
done

while ! test -S /mnt/c-lightning/shared/lightning-rpc
do
    echo "Waiting for bitcoin RPC socket..."
    sleep 1
done

configurator > .env 
source .env

dotnet /nbxplorer/NBXplorer.dll &
nbxplorer_process=$!

dotnet ./BTCPayServer.dll &
btcpayserver_process=$!

trap _term SIGTERM

wait -n $btcpayserver_process $nbxplorer_process