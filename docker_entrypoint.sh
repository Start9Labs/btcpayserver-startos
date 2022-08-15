#!/bin/bash

set -ea

if [ "$#" -ne "0" ]; then
  exec btcpay-admin.sh $@
fi

_term() { 
  echo "Caught SIGTERM signal!" 
  kill -TERM "$nbxplorer_process" 2>/dev/null
  kill -TERM "$btcpayserver_process" 2>/dev/null
  kill -TERM "$postgres_process" 2>/dev/null
}

lightning_type=$(yq e '.lightning.type' /datadir/start9/config.yaml)
if [[ $lightning_type = "lnd" ]]
then

  if ! test -d /mnt/lnd
  then
    echo "LND mountpoint does not exist"
    exit 0
  fi

  while ! test -f /mnt/lnd/admin.macaroon
  do
    echo "Waiting for LND admin macaroon to be generated..."
    sleep 1
  done
fi

if [[ $lightning_type = "c-lightning" ]]
then

  if ! test -d /mnt/c-lightning
  then
    echo "Core Lightning mountpoint does not exist"
    exit 0
  fi

  while ! test -S /mnt/c-lightning/lightning-rpc
  do
    echo "Waiting for Core Lightning RPC socket..."
    sleep 1
  done
fi

configurator > .env 
source .env

if test -f /datadir/postgresql/data/postgresql.conf
then
  echo "postgres already initialized"
else 
  echo "initializing postgres..."
  chmod 777 /datadir
  mkdir -p /datadir/postgresql/data
  chmod 777 /datadir/postgresql
  chown -R postgres:postgres /datadir/postgresql/data
  sudo -u postgres /usr/lib/postgresql/13/bin/initdb -D /datadir/postgresql/data
  echo "postgres initialization complete"
fi

# start postgres with specified data directory
sudo -u postgres /usr/lib/postgresql/13/bin/postgres -D /datadir/postgresql/data &
postgres_process=$!

start_height=$(yq e '.advanced.sync-start-height' /datadir/start9/config.yaml)
dotnet /nbxplorer/NBXplorer.dll --btcrescan=1 --btcstartheight=$(echo $start_height) &
nbxplorer_process=$!

dotnet ./BTCPayServer.dll &
btcpayserver_process=$!

trap _term SIGTERM

wait -n $btcpayserver_process $nbxplorer_process $postgres_process