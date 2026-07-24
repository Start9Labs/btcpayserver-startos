import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:0',
  releaseNotes: {
    en_US: `Updated BTCPay Server to 2.4.1, NBXplorer to 2.6.9, and the Shopify app deployer to 1.9.

**BTCPay Server 2.4.1**

- Right-to-left (RTL) language support (Arabic, Hebrew, Persian)
- BIP-329 wallet label import and editable invoice comments
- Fixes for Boltcard payments and Core Lightning compatibility; LNDHub is now enabled by default

NBXplorer and the Shopify deployer receive minor maintenance updates. Full release notes: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.1`,
    es_ES: `Se actualizó BTCPay Server a 2.4.1, NBXplorer a 2.6.9 y el desplegador de la app de Shopify a 1.9.

**BTCPay Server 2.4.1**

- Compatibilidad con idiomas de derecha a izquierda (RTL) (árabe, hebreo, persa)
- Importación de etiquetas de monedero BIP-329 y comentarios de factura editables
- Correcciones para pagos con Boltcard y compatibilidad con Core Lightning; LNDHub ahora está habilitado de forma predeterminada

NBXplorer y el desplegador de Shopify reciben actualizaciones de mantenimiento menores. Notas de la versión completas: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.1`,
    de_DE: `BTCPay Server auf 2.4.1, NBXplorer auf 2.6.9 und den Shopify-App-Deployer auf 1.9 aktualisiert.

**BTCPay Server 2.4.1**

- Unterstützung für Rechts-nach-links-Sprachen (RTL) (Arabisch, Hebräisch, Persisch)
- BIP-329-Wallet-Label-Import und bearbeitbare Rechnungskommentare
- Korrekturen für Boltcard-Zahlungen und Core-Lightning-Kompatibilität; LNDHub ist jetzt standardmäßig aktiviert

NBXplorer und der Shopify-Deployer erhalten kleinere Wartungsupdates. Vollständige Versionshinweise: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.1`,
    pl_PL: `Zaktualizowano BTCPay Server do 2.4.1, NBXplorer do 2.6.9 oraz narzędzie wdrażające aplikację Shopify do 1.9.

**BTCPay Server 2.4.1**

- Obsługa języków pisanych od prawej do lewej (RTL) (arabski, hebrajski, perski)
- Import etykiet portfela BIP-329 i edytowalne komentarze do faktur
- Poprawki płatności Boltcard i zgodności z Core Lightning; LNDHub jest teraz domyślnie włączony

NBXplorer i narzędzie wdrażające Shopify otrzymują drobne aktualizacje konserwacyjne. Pełne informacje o wydaniu: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.1`,
    fr_FR: `BTCPay Server mis à jour vers 2.4.1, NBXplorer vers 2.6.9 et le déployeur d'application Shopify vers 1.9.

**BTCPay Server 2.4.1**

- Prise en charge des langues de droite à gauche (RTL) (arabe, hébreu, persan)
- Import d'étiquettes de portefeuille BIP-329 et commentaires de facture modifiables
- Corrections des paiements Boltcard et de la compatibilité Core Lightning ; LNDHub est désormais activé par défaut

NBXplorer et le déployeur Shopify reçoivent des mises à jour de maintenance mineures. Notes de version complètes : https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.1`,
  },
  migrations: {},
})
