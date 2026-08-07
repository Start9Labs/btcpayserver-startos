import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.2:0',
  releaseNotes: {
    en_US: `Updated BTCPay Server to 2.4.2 and NBXplorer to 2.6.10.

**This is a critical security release — upstream reports the vulnerability is being actively exploited, so update as soon as possible.**

- Fixed a two-factor authentication (TOTP) bypass through the Greenfield API's Basic authentication
- Basic authentication on the Greenfield API is now disabled by default five minutes after account creation; it can be re-enabled in account settings if an integration needs it
- More reliable multisig PSBT signing and finalization, including with newer HWI and Jade firmware
- Right-to-left (RTL) stylesheets now load correctly
- Wallet transaction table columns can be hidden, shown, and reordered
- Cleaner store settings pages; public invoice creation for payment requests is now rate limited

NBXplorer 2.6.10 is the version upstream recommends alongside this release. Full release notes: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.2`,
    es_ES: `Se actualizó BTCPay Server a 2.4.2 y NBXplorer a 2.6.10.

**Esta es una versión de seguridad crítica: el proyecto original informa de que la vulnerabilidad se está explotando activamente, así que actualiza lo antes posible.**

- Se corrigió una omisión de la autenticación de dos factores (TOTP) a través de la autenticación básica de la API Greenfield
- La autenticación básica de la API Greenfield ahora se desactiva de forma predeterminada cinco minutos después de crear la cuenta; puede reactivarse en los ajustes de la cuenta si una integración la necesita
- Firma y finalización de PSBT multifirma más fiables, incluso con firmware reciente de HWI y Jade
- Las hojas de estilo de derecha a izquierda (RTL) ahora se cargan correctamente
- Las columnas de la tabla de transacciones del monedero se pueden ocultar, mostrar y reordenar
- Páginas de configuración de la tienda más claras; la creación pública de facturas para solicitudes de pago ahora tiene límite de frecuencia

NBXplorer 2.6.10 es la versión que el proyecto original recomienda junto con esta actualización. Notas de la versión completas: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.2`,
    de_DE: `BTCPay Server auf 2.4.2 und NBXplorer auf 2.6.10 aktualisiert.

**Dies ist ein kritisches Sicherheitsupdate – laut Upstream wird die Schwachstelle aktiv ausgenutzt, daher so bald wie möglich aktualisieren.**

- Eine Umgehung der Zwei-Faktor-Authentifizierung (TOTP) über die Basic-Authentifizierung der Greenfield-API wurde behoben
- Die Basic-Authentifizierung der Greenfield-API wird jetzt standardmäßig fünf Minuten nach der Kontoerstellung deaktiviert; wer sie für eine Integration benötigt, kann sie in den Kontoeinstellungen wieder aktivieren
- Zuverlässigeres Signieren und Finalisieren von Multisig-PSBTs, auch mit neuerer HWI- und Jade-Firmware
- Stylesheets für Rechts-nach-links-Sprachen (RTL) werden wieder korrekt geladen
- Spalten der Transaktionstabelle im Wallet lassen sich aus- und einblenden sowie neu anordnen
- Übersichtlichere Shop-Einstellungsseiten; die öffentliche Rechnungserstellung für Zahlungsanfragen ist jetzt ratenbegrenzt

NBXplorer 2.6.10 ist die Version, die Upstream zusammen mit diesem Update empfiehlt. Vollständige Versionshinweise: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.2`,
    pl_PL: `Zaktualizowano BTCPay Server do 2.4.2 i NBXplorer do 2.6.10.

**To krytyczna aktualizacja bezpieczeństwa — według twórców luka jest aktywnie wykorzystywana, dlatego zaktualizuj jak najszybciej.**

- Naprawiono obejście uwierzytelniania dwuskładnikowego (TOTP) poprzez uwierzytelnianie Basic w API Greenfield
- Uwierzytelnianie Basic w API Greenfield jest teraz domyślnie wyłączane pięć minut po utworzeniu konta; w razie potrzeby integracji można je ponownie włączyć w ustawieniach konta
- Bardziej niezawodne podpisywanie i finalizowanie transakcji multisig (PSBT), także z nowszym oprogramowaniem HWI i Jade
- Arkusze stylów dla języków pisanych od prawej do lewej (RTL) ładują się teraz poprawnie
- Kolumny tabeli transakcji portfela można ukrywać, pokazywać i zmieniać ich kolejność
- Czytelniejsze strony ustawień sklepu; publiczne tworzenie faktur dla żądań płatności ma teraz limit częstotliwości

NBXplorer 2.6.10 to wersja zalecana przez twórców razem z tą aktualizacją. Pełne informacje o wydaniu: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.2`,
    fr_FR: `BTCPay Server mis à jour vers 2.4.2 et NBXplorer vers 2.6.10.

**Il s'agit d'une mise à jour de sécurité critique — le projet amont signale que la vulnérabilité est activement exploitée, mettez donc à jour au plus vite.**

- Correction d'un contournement de l'authentification à deux facteurs (TOTP) via l'authentification Basic de l'API Greenfield
- L'authentification Basic de l'API Greenfield est désormais désactivée par défaut cinq minutes après la création du compte ; elle peut être réactivée dans les paramètres du compte si une intégration en a besoin
- Signature et finalisation des PSBT multisignature plus fiables, y compris avec les micrologiciels HWI et Jade récents
- Les feuilles de style pour les langues de droite à gauche (RTL) se chargent de nouveau correctement
- Les colonnes du tableau des transactions du portefeuille peuvent être masquées, affichées et réordonnées
- Pages de paramètres de la boutique plus lisibles ; la création publique de factures pour les demandes de paiement est désormais limitée en fréquence

NBXplorer 2.6.10 est la version recommandée par le projet amont avec cette mise à jour. Notes de version complètes : https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.2`,
  },
  migrations: {},
})
