#!/bin/bash

set -ea

_term() { 
  echo "Caught SIGTERM signal!" 
  kill -TERM "$nbxplorer_process" 2>/dev/null
  kill -TERM "$btcpayserver_process" 2>/dev/null
}

HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')
BTCPAY_HOST="btcpay.local"
NBITCOIN_NETWORK="mainnet"
BTCPAY_ENABLE_SSH=false

configurator
dotnet /nbxplorer/NBXplorer.dll &
nbxplorer_process=$1

dotnet ./BTCPayServer.dll &
btcpayserver_process=$1

trap _term SIGTERM

wait -n $btcpayserver_process $nbxplorer_process