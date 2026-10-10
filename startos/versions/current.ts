import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.5:0',
  releaseNotes: {
    en_US: `Updated BTCPay Server to 2.4.5.

- Security: outbound HTTP requests to private networks are blocked by default. Use Configure Private Destinations for trusted private webhooks, LNURL services or custom Lightning connections. Nodes selected with Choose Lightning Node need no exception.
- Refund auto-approval and invoice status changes require the appropriate permissions. Public invoice pages expire one month after monitoring ends; authorized users retain access.
- Faster invoice creation, Greenfield report APIs, and fixes for store-scoped searches, refunds and RBF payouts.
- Web Interface readiness now requires a valid health response instead of accepting HTTP errors.
- The UTXO tracker now enforces mainnet with the supported configuration setting.
- Updated the StartOS SDK to 3.0.4.

[Full upstream release notes](https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.5)`,
    es_ES: `BTCPay Server actualizado a 2.4.5.

- Seguridad: las solicitudes HTTP salientes a redes privadas se bloquean de forma predeterminada. Use Configurar destinos privados para webhooks privados, servicios LNURL o conexiones Lightning personalizadas de confianza. Los nodos elegidos con Elegir nodo Lightning no necesitan una excepción.
- La aprobación automática de reembolsos y los cambios de estado de facturas requieren los permisos adecuados. Las páginas públicas de facturas caducan un mes después de terminar la supervisión; los usuarios autorizados conservan el acceso.
- Creación de facturas más rápida, API de informes Greenfield y correcciones de búsquedas limitadas a la tienda, reembolsos y pagos RBF.
- La comprobación de la interfaz web ahora requiere una respuesta de estado válida en lugar de aceptar errores HTTP.
- El rastreador UTXO ahora exige mainnet mediante la opción de configuración admitida.
- SDK de StartOS actualizado a 3.0.4.

[Notas completas de la versión original](https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.5)`,
    de_DE: `BTCPay Server auf 2.4.5 aktualisiert.

- Sicherheit: Ausgehende HTTP-Anfragen an private Netzwerke werden standardmäßig blockiert. „Private Ziele konfigurieren“ erlaubt vertrauenswürdige private Webhooks, LNURL-Dienste oder benutzerdefinierte Lightning-Verbindungen. Mit „Lightning-Knoten wählen“ ausgewählte Knoten benötigen keine Ausnahme.
- Automatische Rückerstattungsfreigaben und Änderungen des Rechnungsstatus erfordern passende Berechtigungen. Öffentliche Rechnungsseiten laufen einen Monat nach Ende der Überwachung ab; berechtigte Benutzer behalten Zugriff.
- Schnellere Rechnungserstellung, Greenfield-Berichts-APIs sowie Korrekturen für storebezogene Suchen, Rückerstattungen und RBF-Auszahlungen.
- Die Bereitschaftsprüfung der Weboberfläche verlangt eine gültige Statusantwort, statt HTTP-Fehler zu akzeptieren.
- Der UTXO-Tracker erzwingt Mainnet jetzt mit der unterstützten Konfigurationseinstellung.
- StartOS-SDK auf 3.0.4 aktualisiert.

[Vollständige Upstream-Versionshinweise](https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.5)`,
    pl_PL: `Zaktualizowano BTCPay Server do 2.4.5.

- Bezpieczeństwo: wychodzące żądania HTTP do sieci prywatnych są domyślnie blokowane. Użyj „Konfiguruj prywatne adresy docelowe” dla zaufanych prywatnych webhooków, usług LNURL lub niestandardowych połączeń Lightning. Węzły wybrane przez „Wybierz węzeł Lightning” nie wymagają wyjątku.
- Automatyczne zatwierdzanie zwrotów i zmiany statusu faktur wymagają odpowiednich uprawnień. Publiczne strony faktur wygasają miesiąc po zakończeniu monitorowania; uprawnieni użytkownicy zachowują dostęp.
- Szybsze tworzenie faktur, API raportów Greenfield oraz poprawki wyszukiwania w obrębie sklepu, zwrotów i wypłat RBF.
- Sprawdzanie gotowości interfejsu webowego wymaga teraz prawidłowej odpowiedzi stanu zamiast akceptowania błędów HTTP.
- Śledzenie UTXO wymusza teraz mainnet za pomocą obsługiwanego ustawienia konfiguracji.
- Zaktualizowano SDK StartOS do 3.0.4.

[Pełne informacje o wydaniu projektu źródłowego](https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.5)`,
    fr_FR: `BTCPay Server mis à jour vers 2.4.5.

- Sécurité : les requêtes HTTP sortantes vers les réseaux privés sont bloquées par défaut. Utilisez « Configurer les destinations privées » pour les webhooks privés, services LNURL ou connexions Lightning personnalisées de confiance. Les nœuds sélectionnés avec « Choisir le nœud Lightning » ne nécessitent aucune exception.
- L’approbation automatique des remboursements et les changements d’état des factures exigent les permissions appropriées. Les pages publiques des factures expirent un mois après la fin du suivi ; les utilisateurs autorisés conservent leur accès.
- Création de factures plus rapide, API de rapports Greenfield et corrections des recherches limitées à la boutique, des remboursements et des paiements RBF.
- Le contrôle de disponibilité de l’interface web exige désormais une réponse d’état valide au lieu d’accepter les erreurs HTTP.
- Le suivi UTXO impose désormais le réseau principal avec le paramètre de configuration pris en charge.
- SDK StartOS mis à jour vers 3.0.4.

[Notes de version complètes du projet amont](https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.5)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
