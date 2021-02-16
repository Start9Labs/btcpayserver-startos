# Wrapper for BTCPay Server

[BTCPay Server](https://btcpayserver.org/) is a self-hosted, open-source cryptocurrency payment processor. It's secure, private, censorship-resistant and free.

## Dependencies

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [yq](https://mikefarah.gitbook.io/yq)
- [toml](https://crates.io/crates/toml-cli)
- [appmgr](https://github.com/Start9Labs/appmgr)
- [make](https://www.gnu.org/software/make/)

## Cloning

Clone the project locally. Note the submodule link to the original project(s). 

```
git clone git@github.com:elvece/btcpayserver-wrapper.git
cd btcpayserver-wrapper
git submodule update --init --recursive
```

## Building

To build the project, run the following commands:

```
make
```

## Installing (on Embassy)

SSH into a device running EmbassyOS.
`scp` the `.s9pk` to any directory from your local machine.
Run the following command to determine successful install:

```
appmgr install btcpayserver.s9pk
```