# Wrapper for BTCPay Server

[BTCPay Server](https://btcpayserver.org/) is a self-hosted, open-source cryptocurrency payment processor. It's secure, private, censorship-resistant and free.

## Dependencies

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [yq](https://mikefarah.gitbook.io/yq)
- [embassy-sdk](https://github.com/Start9Labs/embassy-os/blob/master/backend/install-sdk.sh)
- [make](https://www.gnu.org/software/make/)
- [md-packer](https://github.com/Start9Labs/md-packer)
- [deno](https://deno.land/)

## Cloning

Clone the project locally. Note the submodule link to the original project(s). 

```
git clone git@github.com:elvece/btcpayserver-wrapper.git
cd btcpayserver-wrapper
git submodule update --init --recursive
```

## Building

```
make
```

## Installing (on Embassy)

```
scp btcpayserver.s9pk root@embassy-<id>.local:/embassy-data/package-data/tmp # Copy S9PK to the external disk. Make sure to create the directory if it doesn't already exist
ssh root@embassy-<id>.local
embassy-cli auth login
embassy-cli package install /embassy-data/pacakge-data/tmp/btcpayserver.s9pk # Install the sideloaded package
```
