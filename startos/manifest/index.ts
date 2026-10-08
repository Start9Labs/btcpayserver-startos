import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'btcpayserver',
  title: 'BTCPay Server',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9Labs/btcpayserver-startos',
  upstreamRepo: 'https://github.com/btcpayserver/btcpayserver',
  marketingUrl: 'https://btcpayserver.org/',
  donationUrl: 'https://btcpayserver.org/donate/',
  description: { short, long },
  volumes: ['main', 'db', 'btcpayserver', 'nbxplorer'],
  images: {
    btcpay: {
      source: {
        dockerTag: 'btcpayserver/btcpayserver:2.4.4',
      },
      arch: ['x86_64', 'aarch64'],
    },
    nbx: {
      source: {
        dockerTag: 'nicolasdorier/nbxplorer:2.6.13',
      },
      arch: ['x86_64', 'aarch64'],
    },
    postgres: {
      source: {
        dockerTag: 'btcpayserver/postgres:18.6',
      },
      arch: ['x86_64', 'aarch64'],
    },
    shopify: {
      source: {
        dockerTag: 'btcpayserver/shopify-app-deployer:1.10',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
