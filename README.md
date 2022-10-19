# Wrapper for btcpayserver

[BTCPay Server](https://btcpayserver.org/) is a self-hosted, open-source cryptocurrency payment processor. It's secure, private, censorship-resistant and free. This repository creates the `s9pk` package that is installed to run `btcpayserver` on [embassyOS](https://github.com/Start9Labs/embassy-os/).

## Dependencies

The following set of dependencies are required to build this project. You can find detailed steps to setup your environment in the service packaging [documentation](https://github.com/Start9Labs/service-pipeline#development-environment).

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [yq](https://mikefarah.gitbook.io/yq)
- [embassy-sdk](https://github.com/Start9Labs/embassy-os/blob/master/backend/install-sdk.sh)
- [make](https://www.gnu.org/software/make/)
- [md-packer](https://github.com/Start9Labs/md-packer)
- [deno](https://deno.land/)
- [wget](https://command-not-found.com/wget)

## Cloning

Clone the project locally:

```
git clone git@github.com:elvece/btcpayserver-wrapper.git
cd btcpayserver-wrapper
```

## Building

After setting up your environment, build the `btcpayserver` package by running:

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

### Verify Install

Go to your Embassy Services page, select **BTCPay Server**, configure and start the service. Then, verify its interfaces are accessible.

**Done!** 