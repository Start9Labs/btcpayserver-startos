import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.7:1',
  releaseNotes: {
    en_US: `Updated NBXplorer to 2.6.21. Fixes on-chain invoices getting no Bitcoin address when the store wallet was created by importing into the Bitcoin node's wallet, on Bitcoin 30 and later, and includes .NET runtime security updates. Full changes: https://github.com/dgarage/NBXplorer/compare/v2.6.13...v2.6.21`,
    es_ES: `NBXplorer se actualizó a 2.6.21. Corrige que las facturas on-chain no recibieran una dirección de Bitcoin cuando la billetera de la tienda se creó importándola en la billetera del nodo de Bitcoin, en Bitcoin 30 y posteriores, e incluye actualizaciones de seguridad del entorno de ejecución .NET. Cambios completos: https://github.com/dgarage/NBXplorer/compare/v2.6.13...v2.6.21`,
    de_DE: `NBXplorer wurde auf 2.6.21 aktualisiert. Behebt, dass On-Chain-Rechnungen keine Bitcoin-Adresse erhielten, wenn die Wallet des Shops durch Import in die Wallet des Bitcoin-Knotens erstellt wurde, ab Bitcoin 30, und enthält Sicherheitsupdates der .NET-Laufzeitumgebung. Alle Änderungen: https://github.com/dgarage/NBXplorer/compare/v2.6.13...v2.6.21`,
    pl_PL: `Zaktualizowano NBXplorer do wersji 2.6.21. Naprawia brak adresu Bitcoin w fakturach on-chain, gdy portfel sklepu utworzono przez import do portfela węzła Bitcoin, w Bitcoin 30 i nowszych, oraz zawiera aktualizacje bezpieczeństwa środowiska uruchomieniowego .NET. Pełna lista zmian: https://github.com/dgarage/NBXplorer/compare/v2.6.13...v2.6.21`,
    fr_FR: `Mise à jour de NBXplorer vers 2.6.21. Corrige l'absence d'adresse Bitcoin sur les factures on-chain lorsque le portefeuille de la boutique a été créé par import dans le portefeuille du nœud Bitcoin, sur Bitcoin 30 et versions ultérieures, et inclut des mises à jour de sécurité de l'environnement d'exécution .NET. Modifications complètes : https://github.com/dgarage/NBXplorer/compare/v2.6.13...v2.6.21`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
