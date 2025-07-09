import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'btcpayserver',
  title: 'BTCPay Server',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/btcpayserver-wrapper',
  upstreamRepo: 'https://github.com/btcpayserver/btcpayserver',
  supportSite: 'https://docs.btcpayserver.org/Support/',
  marketingSite: 'https://btcpayserver.org/',
  donationUrl: 'https://btcpayserver.org/donate/',
  description: {
    short: 'Bitcoin and cryptocurrency payment processor and POS system.',
    long: 'BTCPay Server is a free and open-source cryptocurrency payment processor which allows you to receive payments in Bitcoin (on-chain and via the Lightning Network) and altcoins directly, with no fees, transaction cost or a middleman. \n\nBTCPay is a non-custodial invoicing system which eliminates the involvement of a third-party. Payments with BTCPay go directly to your wallet, which increases the privacy and security. Your private keys are never required to receive payments to your BTCPay Server. There is no address re-use since each invoice uses a new address for receiving payments to your wallet.\n',
  },
  volumes: ['main'],
  images: {
    btcpay: {
      source: {
        dockerTag: 'btcpayserver/btcpayserver:2.1.6',
      },
    },
    nbx: {
      source: {
        dockerTag: 'nicolasdorier/nbxplorer:2.5.28',
      },
    },
    postgres: {
      source: {
        dockerTag: 'btcpayserver/postgres:13.18',
      },
    },
    shopify: {
      source: {
        dockerTag: 'btcpayserver/shopify-app-deployer:1.4',
      },
    },
    nginx: {
      source: {
        dockerTag: 'nginx:stable-alpine',
      },
    },
  },
  hardwareRequirements: {},
  dependencies: {
    bitcoind: {
      description: 'Used for the RPC and P2P connection interfaces.',
      optional: false,
      s9pk: 'https://github.com/Start9Labs/bitcoind-startos/releases/download/v28.1.0.3-alpha.6/bitcoind.s9pk',
    },
    lnd: {
      description: 'Used to communicate with the Lightning Network.',
      optional: true,
      s9pk: 'https://github.com/Start9Labs/lnd-startos/releases/download/v0.19.1-beta.1-alpha.3/lnd.s9pk',
    },
    'c-lightning': {
      description: 'Used to communicate with the Lightning Network.',
      optional: true,
      s9pk: 'https://github.com/Start9Labs/cln-startos/releases/download/v25.02.2/c-lightningV2.s9pk',
    },
    monerod: {
      description: 'Used to connect to the Monero network.',
      optional: true,
      s9pk: 'https://github.com/Start9Labs/bitcoind-startos/releases/download/v28.1.0.3-alpha.6/bitcoind.s9pk',
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
})
