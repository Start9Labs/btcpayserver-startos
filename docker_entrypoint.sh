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

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')
export BTCPAY_ENABLE_SSH=false

configurator > .env 
source .env

dotnet /nbxplorer/NBXplorer.dll &
nbxplorer_process=$1

dotnet ./BTCPayServer.dll &
btcpayserver_process=$1

trap _term SIGTERM

wait -n $btcpayserver_process $nbxplorer_process