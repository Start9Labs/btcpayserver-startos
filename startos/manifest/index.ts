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
    short: {
      en_US: 'Bitcoin and cryptocurrency payment processor and POS system.',
      es_ES: 'Procesador de pagos de Bitcoin y criptomonedas y sistema POS.',
      de_DE: 'Bitcoin- und Kryptowährungs-Zahlungsabwickler und POS-System.',
      pl_PL: 'Procesor płatności Bitcoin i kryptowalut oraz system POS.',
      fr_FR: 'Processeur de paiement Bitcoin et cryptomonnaies et système POS.',
    },
    long: {
      en_US:
        'BTCPay Server is a free and open-source cryptocurrency payment processor which allows you to receive payments in Bitcoin (on-chain and via the Lightning Network) and altcoins directly, with no fees, transaction cost or a middleman. \n\nBTCPay is a non-custodial invoicing system which eliminates the involvement of a third-party. Payments with BTCPay go directly to your wallet, which increases the privacy and security. Your private keys are never required to receive payments to your BTCPay Server. There is no address re-use since each invoice uses a new address for receiving payments to your wallet.\n',
      es_ES:
        'BTCPay Server es un procesador de pagos de criptomonedas gratuito y de código abierto que te permite recibir pagos en Bitcoin (on-chain y a través de la Lightning Network) y altcoins directamente, sin comisiones, costos de transacción ni intermediarios. \n\nBTCPay es un sistema de facturación sin custodia que elimina la participación de terceros. Los pagos con BTCPay van directamente a tu billetera, lo que aumenta la privacidad y la seguridad. Tus claves privadas nunca son necesarias para recibir pagos en tu BTCPay Server. No hay reutilización de direcciones ya que cada factura usa una nueva dirección para recibir pagos en tu billetera.\n',
      de_DE:
        'BTCPay Server ist ein kostenloser Open-Source-Kryptowährungs-Zahlungsabwickler, mit dem Sie Zahlungen in Bitcoin (on-chain und über das Lightning Network) und Altcoins direkt ohne Gebühren, Transaktionskosten oder Zwischenhändler empfangen können. \n\nBTCPay ist ein nicht-verwahrtes Rechnungssystem, das die Beteiligung Dritter eliminiert. Zahlungen mit BTCPay gehen direkt an Ihre Wallet, was die Privatsphäre und Sicherheit erhöht. Ihre privaten Schlüssel werden niemals benötigt, um Zahlungen an Ihren BTCPay Server zu empfangen. Es gibt keine Adresswiederverwendung, da jede Rechnung eine neue Adresse für den Empfang von Zahlungen an Ihre Wallet verwendet.\n',
      pl_PL:
        'BTCPay Server to darmowy procesor płatności kryptowalutowych o otwartym kodzie źródłowym, który pozwala odbierać płatności w Bitcoin (on-chain i przez Lightning Network) oraz altcoinach bezpośrednio, bez opłat, kosztów transakcji czy pośredników. \n\nBTCPay to system fakturowania bez przechowywania środków, który eliminuje udział stron trzecich. Płatności z BTCPay trafiają bezpośrednio do twojego portfela, co zwiększa prywatność i bezpieczeństwo. Twoje klucze prywatne nigdy nie są wymagane do odbierania płatności na twój BTCPay Server. Nie ma ponownego używania adresów, ponieważ każda faktura używa nowego adresu do odbierania płatności do twojego portfela.\n',
      fr_FR:
        "BTCPay Server est un processeur de paiement de cryptomonnaies gratuit et open-source qui vous permet de recevoir des paiements en Bitcoin (on-chain et via le Lightning Network) et en altcoins directement, sans frais, coût de transaction ou intermédiaire. \n\nBTCPay est un système de facturation non-custodial qui élimine l'implication d'un tiers. Les paiements avec BTCPay vont directement vers votre portefeuille, ce qui augmente la confidentialité et la sécurité. Vos clés privées ne sont jamais requises pour recevoir des paiements sur votre BTCPay Server. Il n'y a pas de réutilisation d'adresse car chaque facture utilise une nouvelle adresse pour recevoir des paiements vers votre portefeuille.\n",
    },
  },
  volumes: ['main'],
  images: {
    btcpay: {
      source: {
        // https://hub.docker.com/r/btcpayserver/btcpayserver/tags
        dockerTag: 'btcpayserver/btcpayserver:2.3.4',
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'aarch64',
    },
    nbx: {
      source: {
        // https://hub.docker.com/r/nicolasdorier/nbxplorer/tags
        dockerTag: 'nicolasdorier/nbxplorer:2.6.0',
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'aarch64',
    },
    postgres: {
      source: {
        // https://hub.docker.com/r/btcpayserver/postgres/tags
        dockerTag: 'btcpayserver/postgres:13.23',
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'aarch64',
    },
    shopify: {
      source: {
        // https://hub.docker.com/r/btcpayserver/shopify-app-deployer/tags
        dockerTag: 'btcpayserver/shopify-app-deployer:1.6',
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'aarch64',
    },
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
