import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.7:0',
  releaseNotes: {
    en_US: `Updated BTCPay Server to 2.4.7. Fixes 85 security findings, including critical and high-severity issues affecting merchant isolation, payouts, authentication and payment accounting. Updating is strongly recommended, especially on servers shared by multiple merchants.

Integrations using the legacy /invoices/create route must switch to /stores/{storeId}/invoices/create. Reading individual invoices through the BitPay API now requires authentication.

Full release notes: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.7`,
    es_ES: `BTCPay Server se actualizó a 2.4.7. Corrige 85 problemas de seguridad, incluidos problemas críticos y de alta gravedad que afectan al aislamiento entre comerciantes, los pagos salientes, la autenticación y la contabilidad de pagos. Se recomienda encarecidamente actualizar, especialmente en servidores compartidos por varios comerciantes.

Las integraciones que utilicen la ruta antigua /invoices/create deben cambiar a /stores/{storeId}/invoices/create. Consultar facturas individuales mediante la API de BitPay ahora requiere autenticación.

Notas completas de la versión: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.7`,
    de_DE: `BTCPay Server wurde auf 2.4.7 aktualisiert. Behebt 85 Sicherheitsprobleme, darunter kritische und schwerwiegende Probleme bei der Trennung von Händlern, Auszahlungen, Authentifizierung und Zahlungsabrechnung. Das Update wird dringend empfohlen, besonders auf gemeinsam von mehreren Händlern genutzten Servern.

Integrationen mit der alten Route /invoices/create müssen auf /stores/{storeId}/invoices/create umgestellt werden. Das Abrufen einzelner Rechnungen über die BitPay-API erfordert jetzt eine Authentifizierung.

Vollständige Versionshinweise: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.7`,
    pl_PL: `Zaktualizowano BTCPay Server do wersji 2.4.7. Naprawia 85 problemów bezpieczeństwa, w tym krytyczne i poważne problemy z izolacją sprzedawców, wypłatami, uwierzytelnianiem i rozliczaniem płatności. Aktualizacja jest zdecydowanie zalecana, zwłaszcza na serwerach współdzielonych przez wielu sprzedawców.

Integracje korzystające ze starej ścieżki /invoices/create muszą przejść na /stores/{storeId}/invoices/create. Odczyt pojedynczych faktur przez API BitPay wymaga teraz uwierzytelnienia.

Pełne informacje o wydaniu: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.7`,
    fr_FR: `Mise à jour de BTCPay Server vers 2.4.7. Corrige 85 problèmes de sécurité, dont des problèmes critiques et de gravité élevée touchant l'isolation des commerçants, les versements, l'authentification et la comptabilisation des paiements. La mise à jour est fortement recommandée, surtout sur les serveurs partagés entre plusieurs commerçants.

Les intégrations utilisant l'ancienne route /invoices/create doivent passer à /stores/{storeId}/invoices/create. La lecture de factures individuelles via l'API BitPay nécessite désormais une authentification.

Notes de version complètes : https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.7`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
