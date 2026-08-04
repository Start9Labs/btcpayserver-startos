import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:5',
  releaseNotes: {
    en_US: `Updated the Shopify integration to 1.10.

While a customer's invoice is being created, the checkout now shows a "please wait" message next to the spinner instead of a bare spinner. This only affects stores using the optional Shopify integration; BTCPay Server itself is unchanged.

Full changes: https://github.com/btcpayserver/shopify-app/compare/1.9...1.10`,
    es_ES: `Actualiza la integración con Shopify a la versión 1.10.

Mientras se crea la factura de un cliente, la pantalla de pago muestra ahora un mensaje de «espera un momento» junto al indicador de carga, en vez de solo el indicador. Esto solo afecta a las tiendas que usan la integración opcional con Shopify; BTCPay Server no cambia.

Todos los cambios: https://github.com/btcpayserver/shopify-app/compare/1.9...1.10`,
    de_DE: `Aktualisiert die Shopify-Integration auf 1.10.

Während die Rechnung einer Kundin oder eines Kunden erstellt wird, zeigt die Kasse jetzt neben dem Ladesymbol einen Hinweis zum Warten an statt nur des Ladesymbols. Das betrifft ausschließlich Shops mit der optionalen Shopify-Integration; BTCPay Server selbst bleibt unverändert.

Alle Änderungen: https://github.com/btcpayserver/shopify-app/compare/1.9...1.10`,
    pl_PL: `Aktualizuje integrację z Shopify do wersji 1.10.

Podczas tworzenia faktury dla klienta ekran płatności pokazuje teraz obok wskaźnika ładowania komunikat z prośbą o chwilę cierpliwości, zamiast samego wskaźnika. Dotyczy to wyłącznie sklepów korzystających z opcjonalnej integracji z Shopify; sam BTCPay Server się nie zmienia.

Pełna lista zmian: https://github.com/btcpayserver/shopify-app/compare/1.9...1.10`,
    fr_FR: `Met à jour l'intégration Shopify vers la version 1.10.

Pendant la création de la facture d'un client, la page de paiement affiche désormais un message d'attente à côté de l'indicateur de chargement, au lieu du seul indicateur. Cela ne concerne que les boutiques utilisant l'intégration Shopify facultative ; BTCPay Server lui-même est inchangé.

Toutes les modifications : https://github.com/btcpayserver/shopify-app/compare/1.9...1.10`,
  },
  migrations: {},
})
