import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.6:0',
  releaseNotes: {
    en_US: `Updated BTCPay Server to 2.4.6 with security hardening for API permissions, untrusted input, generated links and browser actions. Includes the .NET Brotli security fix, faster invoice lists and persistent plugin failure diagnostics. Uses upstream images with fixed certificate stores instead of local CA-store layers.

**Before updating:** Back up this service. The first start creates an invoice database index; large invoice histories can require extra time and disk space.

**Integration changes:** Replace legacy per-invoice notificationEmail with merchant-controlled email rules. Logout requires a protected POST; direct /logout links no longer sign users out. API redirect URLs must be absolute HTTP or HTTPS URLs. Review restricted API key permissions and customized HTML/CSS against the stricter validation.

[Full release notes](https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.6)`,
    es_ES: `BTCPay Server actualizado a 2.4.6 con refuerzo de seguridad para permisos de API, entradas no confiables, enlaces generados y acciones del navegador. Incluye la corrección de seguridad de Brotli en .NET, listas de facturas más rápidas y diagnósticos persistentes de fallos de plugins. Usa imágenes originales con almacenes de certificados corregidos en lugar de capas locales.

**Antes de actualizar:** Haz una copia de seguridad del servicio. El primer inicio crea un índice de facturas en la base de datos; un historial grande puede requerir más tiempo y espacio en disco.

**Cambios en integraciones:** Sustituye notificationEmail por factura por reglas de correo controladas por el comerciante. Cerrar sesión requiere un POST protegido; los enlaces directos a /logout ya no cierran la sesión. Las URL de redirección de la API deben ser URL absolutas HTTP o HTTPS. Revisa los permisos de las claves de API restringidas y el HTML/CSS personalizado ante la validación más estricta.

[Notas completas](https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.6)`,
    de_DE: `BTCPay Server auf 2.4.6 aktualisiert, mit Sicherheitsverbesserungen für API-Berechtigungen, nicht vertrauenswürdige Eingaben, erzeugte Links und Browseraktionen. Enthält die .NET-Brotli-Sicherheitskorrektur, schnellere Rechnungslisten und dauerhafte Diagnosen für Plugin-Fehler. Verwendet Upstream-Images mit korrigierten Zertifikatsspeichern statt lokaler Zusatzschichten.

**Vor dem Update:** Eine Sicherung dieses Dienstes erstellen. Beim ersten Start wird ein Rechnungsindex in der Datenbank angelegt; große Rechnungsbestände können zusätzliche Zeit und Speicherplatz benötigen.

**Änderungen für Integrationen:** Das bisherige notificationEmail pro Rechnung durch vom Händler gesteuerte E-Mail-Regeln ersetzen. Abmelden erfordert einen geschützten POST; direkte /logout-Links melden nicht mehr ab. API-Weiterleitungs-URLs müssen absolute HTTP- oder HTTPS-URLs sein. Berechtigungen eingeschränkter API-Schlüssel und angepasstes HTML/CSS auf die strengere Validierung prüfen.

[Vollständige Versionshinweise](https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.6)`,
    pl_PL: `Zaktualizowano BTCPay Server do 2.4.6 ze wzmocnieniem bezpieczeństwa uprawnień API, niezaufanych danych wejściowych, generowanych linków i działań przeglądarki. Zawiera poprawkę bezpieczeństwa Brotli w .NET, szybsze listy faktur i trwałą diagnostykę awarii wtyczek. Używa obrazów upstream z poprawionymi magazynami certyfikatów zamiast lokalnych warstw.

**Przed aktualizacją:** Utwórz kopię zapasową usługi. Pierwsze uruchomienie tworzy indeks faktur w bazie danych; duża historia faktur może wymagać dodatkowego czasu i miejsca na dysku.

**Zmiany w integracjach:** Zastąp notificationEmail dla poszczególnych faktur regułami e-mail kontrolowanymi przez sprzedawcę. Wylogowanie wymaga chronionego żądania POST; bezpośrednie linki /logout już nie wylogowują. Adresy przekierowań API muszą być bezwzględnymi adresami HTTP lub HTTPS. Sprawdź uprawnienia ograniczonych kluczy API i własny HTML/CSS pod kątem bardziej rygorystycznej walidacji.

[Pełne informacje o wydaniu](https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.6)`,
    fr_FR: `Mise à jour de BTCPay Server vers 2.4.6 avec renforcement de la sécurité des permissions API, des entrées non fiables, des liens générés et des actions du navigateur. Inclut le correctif de sécurité Brotli de .NET, des listes de factures plus rapides et des diagnostics persistants des échecs de plugins. Utilise les images amont aux magasins de certificats corrigés plutôt que des couches locales.

**Avant la mise à jour :** Sauvegardez ce service. Le premier démarrage crée un index de factures dans la base de données ; un historique volumineux peut nécessiter davantage de temps et d'espace disque.

**Changements pour les intégrations :** Remplacez notificationEmail par facture par des règles de courriel contrôlées par le commerçant. La déconnexion exige un POST protégé ; les liens directs /logout ne déconnectent plus. Les URL de redirection API doivent être des URL absolues HTTP ou HTTPS. Vérifiez les permissions des clés API restreintes et le HTML/CSS personnalisé face à la validation plus stricte.

[Notes de version complètes](https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.6)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
