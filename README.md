<p align="center">
  <img src="icon.png" alt="Project Logo" width="21%">
</p>

# BTCPay Server for StartOS

[BTCPay Server](https://btcpayserver.org/) is a self-hosted, open-source cryptocurrency payment processor. It's secure, private, censorship-resistant and free. This repository creates the `s9pk` package that is installed to run BTCPay Server on [StartOS](https://github.com/Start9Labs/start-os/).

## Setup

Follow the documentation [guides](https://staging.docs.start9.com/packaging-guide/environment-setup.html).

## Building from source

1. Set up your [environment](https://docs.start9.com/packaging-guide/environment-setup.html).

1. Clone this repository and `cd` into it.

1. run `make`.

1. The resulting `.s9pk` can be side loaded into StartOS.

For a complete list of build options, see the [docs](https://docs.start9.com/packaging-guide/building.html)
