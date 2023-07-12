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

After setting up your environment, build the `btcpayserver` package by running:

```
make
```

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