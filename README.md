# BTCPay Server for StartOS

[BTCPay Server](https://btcpayserver.org/) is a self-hosted, open-source cryptocurrency payment processor. It's secure, private, censorship-resistant and free. This repository creates the `s9pk` package that is installed to run `btcpayserver` on [StartOS](https://github.com/Start9Labs/embassy-os/).

## Dependencies

Install the system dependencies below to build this project by following the instructions in the provided links. You can also find detailed steps to setup your environment in the service packaging [documentation](https://github.com/Start9Labs/service-pipeline#development-environment).

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [yq](https://mikefarah.gitbook.io/yq)
- [embassy-sdk](https://github.com/Start9Labs/embassy-os/blob/master/backend/install-sdk.sh)
- [make](https://www.gnu.org/software/make/)
- [md-packer](https://github.com/Start9Labs/md-packer)
- [deno](https://deno.land/#installation)
- [wget](https://command-not-found.com/wget)

## Cloning

Clone the project locally:

```
git clone git@github.com:elvece/btcpayserver-wrapper.git
cd btcpayserver-wrapper
```

## Building

This branch targets **StartOS 0.3.5.1** and packages BTCPay Server **2.4.7** with NBXplorer **2.6.21**, matching the [upstream deployment](https://github.com/btcpayserver/btcpayserver-docker/blob/6641c063e9c319033aae3042b8386bad30a596e6/docker-compose-generator/docker-fragments/nbxplorer.yml). It uses the published `btcpayserver/btcpayserver:2.4.7` image; no matching `btcpayserver-internal:2.4.7` tag is available.

Use the legacy StartOS SDK and CLI (`start-sdk --version` and `start-cli --version` should report `0.3.5.1`). The StartOS 0.4 toolchain is incompatible with this package.

The image uses Node.js 22.23.4 for the pinned Shopify CLI 3.84.1, which requires Node.js 20.10 or newer. The ARM configurator build disables the cross-compiler image's incompatible `sccache` wrapper.

After setting up your environment, build the `btcpayserver` package by running:

```
make
```

Use `make x86` for an x86_64 package or `make arm` for an aarch64 package. Each target packs and verifies `btcpayserver.s9pk` without installing it.

## Installing (on StartOS)

Run the following commands to install:

> :information_source: Change adjective-noun.local to your Start9 Server LAN address

```
embassy-cli auth login
# Enter your server's master password
embassy-cli --host https://adjective-noun.local package install btcpayserver.s9pk
```

If you already have your `embassy-cli` config file setup with a default `host`,
you can install simply by running:

```
make install
```

> **Tip:** You can also install the btcpayserver.s9pk using **Sideload Service** under
the **System > Settings** section.

### Verify Install

Go to your Start9 Server Services page, select **BTCPay Server**, configure and start the service. Then, verify its interfaces are accessible.

**Done!**
