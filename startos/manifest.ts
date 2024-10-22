import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'btcpayserver',
  title: 'BTCPay Server',
  version: '2.0.0:1',
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
  assets: [],
  volumes: ['main', 'nbx', 'postgres'],
  images: {
    main: {
      source: {
        dockerTag: 'btcpayserver/btcpayserver:2.0.0',
      },
      arch: ['x86_64', 'aarch64'],
    },
    nbx: {
      source: {
        dockerTag: 'nicolasdorier/nbxplorer:2.5.7',
      },
      arch: ['x86_64', 'aarch64'],
    },
    postgres: {
      source: {
        dockerTag: 'btcpayserver/postgres:13.13',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description:
        'Used for the P2P connection interface if configured with Internal Proxy and both the P2P and RPC interfaces if configured with Internal.',
      optional: false,
      s9pk: '',
    },
    lnd: {
      description: 'Used to communicate with the Lightning Network.',
      optional: false,
      s9pk: '',
    },
    'c-lightning': {
      description: 'Used to communicate with the Lightning Network.',
      optional: false,
      s9pk: '',
    },
  },
  alerts: {
    install:
      '<p>BTCPay is a self hosted payment processing system. No third party exists to backup data. You are responsible for backups of all your information!</p>\n<p>The password you create on initial registration is not saved in EmbassyOS. Please save this password in a password manager, such as Bitwarden.</p>\n<p><b>PLEASE READ</b> the <b>INSTRUCTIONS</b> after installation!</p>',
    update: null,
    uninstall:
      '<p><b>READ CAREFULLY!</b></p>\n<p>Uninstalling BTCPay will result in permanent loss of data, including any stores, apps, or invoices created. The only way to ensure data is not lost to to backup the service and restore from this backup.</p>',
    restore:
      'Restoring BTCPay will overwrite its current data.\nAny stores or invoices created since the last backup will be not be recognized.',
    start: null,
    stop: null,
  },
})
