#!/bin/bash
set -e
yq e -i '.bitcoin["bitcoind-rpc"] = {"type":"internal","rpc-user":null,"rpc-password":null}' /datadir/start9/config.yaml
echo -n '{"configured":false}'