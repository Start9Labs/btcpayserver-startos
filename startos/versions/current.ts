import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.4:0',
  releaseNotes: {
    en_US: `Updated BTCPay Server to 2.4.4.

- NFC payments are disabled by default; enable them under Store Settings > Checkout Experience if needed.
- Store users now accept invitations before joining, and zero-amount invoices are blocked by default.
- Adds store-user invitations and email triggers, plus security fixes for API keys, support links, authorization redirects, and account changes.

Full release notes: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.4`,
    es_ES: `Se actualizó BTCPay Server a la versión 2.4.4.

- Los pagos NFC están desactivados por defecto; actívalos en Configuración de la tienda > Experiencia de pago si los necesitas.
- Los usuarios de la tienda ahora deben aceptar una invitación antes de unirse, y las facturas de importe cero están bloqueadas por defecto.
- Añade invitaciones para usuarios de la tienda y activadores de correo electrónico, además de correcciones de seguridad para claves API, enlaces de soporte, redirecciones de autorización y cambios en las cuentas.

Notas completas de la versión: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.4`,
    de_DE: `BTCPay Server wurde auf Version 2.4.4 aktualisiert.

- NFC-Zahlungen sind standardmäßig deaktiviert; aktivieren Sie sie bei Bedarf unter Shop-Einstellungen > Checkout-Erlebnis.
- Shop-Benutzer müssen nun eine Einladung annehmen, bevor sie beitreten können, und Rechnungen mit einem Betrag von null sind standardmäßig gesperrt.
- Fügt Einladungen für Shop-Benutzer und E-Mail-Auslöser sowie Sicherheitskorrekturen für API-Schlüssel, Support-Links, Autorisierungsweiterleitungen und Kontoänderungen hinzu.

Vollständige Versionshinweise: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.4`,
    pl_PL: `Zaktualizowano BTCPay Server do wersji 2.4.4.

- Płatności NFC są domyślnie wyłączone; w razie potrzeby włącz je w Ustawieniach sklepu > Obsługa płatności.
- Użytkownicy sklepu muszą teraz zaakceptować zaproszenie przed dołączeniem, a faktury z kwotą zerową są domyślnie blokowane.
- Dodaje zaproszenia dla użytkowników sklepu i wyzwalacze wiadomości e-mail oraz poprawki bezpieczeństwa dotyczące kluczy API, odnośników pomocy, przekierowań autoryzacyjnych i zmian konta.

Pełne informacje o wydaniu: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.4`,
    fr_FR: `Mise à jour de BTCPay Server vers la version 2.4.4.

- Les paiements NFC sont désactivés par défaut ; activez-les dans Paramètres de la boutique > Expérience de paiement si nécessaire.
- Les utilisateurs de la boutique doivent désormais accepter une invitation avant de la rejoindre, et les factures d'un montant nul sont bloquées par défaut.
- Ajoute les invitations pour les utilisateurs de la boutique et des déclencheurs d'e-mail, ainsi que des correctifs de sécurité pour les clés d'API, les liens d'assistance, les redirections d'autorisation et les modifications de compte.

Notes de version complètes : https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.4`,
  },
  migrations: {},
})
