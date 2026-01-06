import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'btcpayserver',
  title: 'BTCPay Server',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/btcpayserver-startos',
  upstreamRepo: 'https://github.com/btcpayserver/btcpayserver',
  supportSite: 'https://docs.btcpayserver.org/Support/',
  marketingSite: 'https://btcpayserver.org/',
  donationUrl: 'https://btcpayserver.org/donate/',
  docsUrl:
    'https://github.com/Start9Labs/btcpayserver-startos/tree/master/instructions.md',
  description: {
    short: 'Bitcoin and cryptocurrency payment processor and POS system.',
    long: 'BTCPay Server is a free and open-source cryptocurrency payment processor which allows you to receive payments in Bitcoin (on-chain and via the Lightning Network) and altcoins directly, with no fees, transaction cost or a middleman. \n\nBTCPay is a non-custodial invoicing system which eliminates the involvement of a third-party. Payments with BTCPay go directly to your wallet, which increases the privacy and security. Your private keys are never required to receive payments to your BTCPay Server. There is no address re-use since each invoice uses a new address for receiving payments to your wallet.\n',
  },
  volumes: ['main'],
  images: {
    btcpay: {
      source: {
        dockerTag: 'btcpayserver/btcpayserver:2.3.2',
      },
    },
    nbx: {
      source: {
        dockerTag: 'nicolasdorier/nbxplorer:2.6.0',
      },
    },
    postgres: {
      source: {
        dockerTag: 'btcpayserver/postgres:13.23',
      },
    },
    shopify: {
      source: {
        dockerTag: 'btcpayserver/shopify-app-deployer:1.5',
      },
    },
  },
  hardwareRequirements: {
    arch: ['x86_64', 'aarch64'],
  },
  dependencies: {
    bitcoind: {
      description: 'Used to subscribe to new block events.',
      optional: false,
      metadata: {
        title: 'A Bitcoin Full Node',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
    lnd: {
      description: 'Used to communicate with the Lightning Network.',
      optional: true,
      s9pk: 'https://github.com/Start9Labs/lnd-startos/releases/download/v0.20.0-beta.1-beta.2/lnd.s9pk',
    },
    'c-lightning': {
      description: 'Used to communicate with the Lightning Network.',
      optional: true,
      s9pk: 'https://github.com/Start9Labs/cln-startos/releases/download/v25.12.0_1-beta.1/c-lightning.s9pk',
    },
    monerod: {
      description: 'Used to connect to the Monero network.',
      optional: true,
      s9pk: null,
    },
  },
})
