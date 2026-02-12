import { setupManifest } from '@start9labs/start-sdk'
import { short, long } from './i18n'

export const manifest = setupManifest({
  id: 'btcpayserver',
  title: 'BTCPay Server',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/btcpayserver-startos',
  upstreamRepo: 'https://github.com/btcpayserver/btcpayserver',
  supportSite: 'https://docs.btcpayserver.org/Support/',
  marketingSite: 'https://btcpayserver.org/',
  donationUrl: 'https://btcpayserver.org/donate/',
  docsUrl: 'https://docs.btcpayserver.org/',
  description: { short, long },
  volumes: ['main'],
  images: {
    btcpay: {
      source: {
        dockerTag: 'btcpayserver/btcpayserver:2.3.4',
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
      metadata: {
        title: 'LND Lightning Node',
        icon: 'https://github.com/Start9Labs/lnd-startos/blob/master/icon.png?raw=true',
      },
    },
    'c-lightning': {
      description: 'Used to communicate with the Lightning Network.',
      optional: true,
      metadata: {
        title: 'Core Lightning Node',
        icon: 'https://github.com/Start9Labs/cln-startos/blob/master/icon.png?raw=true',
      },
    },
    monerod: {
      description: 'Used to connect to the Monero network.',
      optional: true,
      s9pk: null,
    },
  },
})
