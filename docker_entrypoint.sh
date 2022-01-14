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

configurator > .env 
source .env

dotnet /nbxplorer/NBXplorer.dll &
nbxplorer_process=$!

dotnet ./BTCPayServer.dll &
btcpayserver_process=$!

trap _term SIGTERM

wait -n $btcpayserver_process $nbxplorer_process