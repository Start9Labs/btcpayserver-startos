import { setupManifest } from '@start9labs/start-sdk'
import {
  bitcoindDescription,
  clnDescription,
  lndDescription,
  long,
  monerodDescription,
  short,
} from './i18n'

export const manifest = setupManifest({
  id: 'btcpayserver',
  title: 'BTCPay Server',
  license: 'MIT',
  packageRepo:
    'https://github.com/Start9Labs/btcpayserver-startos',
  upstreamRepo: 'https://github.com/btcpayserver/btcpayserver',
  marketingUrl: 'https://btcpayserver.org/',
  donationUrl: 'https://btcpayserver.org/donate/',
  docsUrls: ['https://docs.btcpayserver.org/'],
  description: { short, long },
  volumes: ['main', 'db', 'btcpayserver', 'nbxplorer'],
  images: {
    btcpay: {
      source: {
        dockerTag: 'btcpayserver/btcpayserver:2.3.7',
      },
      arch: ['x86_64', 'aarch64'],
    },
    nbx: {
      source: {
        dockerTag: 'nicolasdorier/nbxplorer:2.6.4',
      },
      arch: ['x86_64', 'aarch64'],
    },
    postgres: {
      source: {
        dockerTag: 'btcpayserver/postgres:18.1',
      },
      arch: ['x86_64', 'aarch64'],
    },
    shopify: {
      source: {
        dockerTag: 'btcpayserver/shopify-app-deployer:1.8',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: bitcoindDescription,
      optional: false,
      metadata: {
        title: 'Bitcoin',
        icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/feec0b1dae42961a257948fe39b40caf8672fce1/dep-icon.svg',
      },
    },
    lnd: {
      description: lndDescription,
      optional: true,
      metadata: {
        title: 'LND',
        icon: 'https://raw.githubusercontent.com/Start9Labs/lnd-startos/f17336a10769efd8782a347662848c50c6270349/icon.svg',
      },
    },
    'c-lightning': {
      description: clnDescription,
      optional: true,
      metadata: {
        title: 'CLN',
        icon: 'https://raw.githubusercontent.com/Start9Labs/cln-startos/71b2d1eb78e2d31cc4d62a410512422d39e856e9/icon.svg',
      },
    },
    monerod: {
      description: monerodDescription,
      optional: true,
      metadata: {
        title: 'Monero',
        icon: 'https://raw.githubusercontent.com/kn0wmad/monerod-startos/refs/heads/master/icon.png',
      },
    },
  },
})
