#!/bin/sh

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')

export BTCPAY_HOST="btcpay.local"
export NBITCOIN_NETWORK="mainnet"
export BTCPAYGEN_CRYPTO1="btc"
export BTCPAYGEN_ADDITIONAL_FRAGMENTS="opt-save-memory;opt-add-tor;"
export BTCPAYGEN_REVERSEPROXY="nginx"
# export BTCPAYGEN_LIGHTNING="clightning"
export BTCPAY_ENABLE_SSH=false

exec dotnet ./btcpayserver/BTCPayServer.dll