# Wrapper for btcpayserver

[BTCPay Server](https://btcpayserver.org/) is a self-hosted, open-source cryptocurrency payment processor. It's secure, private, censorship-resistant and free. This repository creates the `s9pk` package that is installed to run `btcpayserver` on [embassyOS](https://github.com/Start9Labs/embassy-os/).

## Embassy Service Pre-Requisites: 

## Dependencies

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [yq](https://mikefarah.gitbook.io/yq)
- [embassy-sdk](https://github.com/Start9Labs/embassy-os/blob/master/backend/install-sdk.sh)
- [make](https://www.gnu.org/software/make/)
- [md-packer](https://github.com/Start9Labs/md-packer)
- [deno](https://deno.land/)

## Cloning

Clone the project locally. Note the submodule link to the original projects. 

```
git clone git@github.com:elvece/btcpayserver-wrapper.git
cd btcpayserver-wrapper
git submodule update --init --recursive
```

## Building

To build the `btcpayserver` package, run the following command:

```
make
```

## Installing (on embassyOS)

Run the following commands to install:

> :information_source: Change embassy-server-name.local to your Embassy address

```
embassy-cli auth login
# Enter your embassy password
embassy-cli --host https://embassy-server-name.local package install btcpayserver.s9pk
```

If you already have your `embassy-cli` config file setup with a default `host`,
you can install simply by running:

```
make install
```

> **Tip:** You can also install the btcpayserver.s9pk using **Sideload Service** under
the **Embassy > Settings** section.

## Verify Install

Go to your Embassy Services page, select **BTCPay Server**, configure and start the service. Then, verify it's interfaces are accessible.

**Done!** 