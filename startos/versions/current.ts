import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3-rc.4:1',
  releaseNotes: {
    en_US: `Updated NBXplorer to 2.6.11.

A maintenance release with no changes to NBXplorer itself: it rebuilds on the .NET 10.0.11 runtime, which carries this month's .NET security fixes, and on NBitcoin 10.0.9.

BTCPay Server stays on the 2.4.3-rc4 pre-release build shipped in the previous release.

Full changes: https://github.com/btcpayserver/NBXplorer/compare/v2.6.10...v2.6.11`,
    es_ES: `NBXplorer actualizado a 2.6.11.

Una versión de mantenimiento sin cambios en NBXplorer: se recompila sobre el entorno de ejecución .NET 10.0.11, que incluye las correcciones de seguridad de .NET de este mes, y sobre NBitcoin 10.0.9.

BTCPay Server permanece en la versión preliminar 2.4.3-rc4 publicada en la versión anterior.

Cambios completos: https://github.com/btcpayserver/NBXplorer/compare/v2.6.10...v2.6.11`,
    de_DE: `NBXplorer auf 2.6.11 aktualisiert.

Eine Wartungsversion ohne Änderungen an NBXplorer selbst: Sie wird auf der .NET-Laufzeit 10.0.11 neu gebaut, die die .NET-Sicherheitskorrekturen dieses Monats enthält, sowie auf NBitcoin 10.0.9.

BTCPay Server bleibt beim Vorabversions-Build 2.4.3-rc4 aus der vorherigen Veröffentlichung.

Vollständige Änderungen: https://github.com/btcpayserver/NBXplorer/compare/v2.6.10...v2.6.11`,
    pl_PL: `Zaktualizowano NBXplorer do 2.6.11.

Wydanie konserwacyjne bez zmian w samym NBXplorerze: zostało przebudowane na środowisku uruchomieniowym .NET 10.0.11, które zawiera tegomiesięczne poprawki bezpieczeństwa .NET, oraz na NBitcoin 10.0.9.

BTCPay Server pozostaje na wersji przedpremierowej 2.4.3-rc4 opublikowanej w poprzednim wydaniu.

Pełna lista zmian: https://github.com/btcpayserver/NBXplorer/compare/v2.6.10...v2.6.11`,
    fr_FR: `NBXplorer mis à jour vers 2.6.11.

Une version de maintenance sans modification de NBXplorer lui-même : elle est reconstruite sur l'environnement d'exécution .NET 10.0.11, qui intègre les correctifs de sécurité .NET de ce mois-ci, ainsi que sur NBitcoin 10.0.9.

BTCPay Server reste sur la version préliminaire 2.4.3-rc4 publiée précédemment.

Changements complets : https://github.com/btcpayserver/NBXplorer/compare/v2.6.10...v2.6.11`,
  },
  migrations: {},
})
