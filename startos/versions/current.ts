import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3:6',
  releaseNotes: {
    en_US: `Updated NBXplorer to 2.6.13. This release fixes a crash loop in the Liquid indexer when processing outputs with an explicit asset and a confidential value.

See https://github.com/btcpayserver/NBXplorer/compare/v2.6.12...v2.6.13`,
    es_ES: `Se actualizó NBXplorer a 2.6.13. Esta versión corrige un bucle de fallos en el indexador de Liquid al procesar salidas con un activo explícito y un valor confidencial.

Consulta https://github.com/btcpayserver/NBXplorer/compare/v2.6.12...v2.6.13`,
    de_DE: `NBXplorer wurde auf 2.6.13 aktualisiert. Diese Version behebt eine Absturzschleife im Liquid-Indexer bei der Verarbeitung von Ausgaben mit einem expliziten Asset und einem vertraulichen Wert.

Siehe https://github.com/btcpayserver/NBXplorer/compare/v2.6.12...v2.6.13`,
    pl_PL: `Zaktualizowano NBXplorer do wersji 2.6.13. Ta wersja naprawia pętlę awarii indeksatora Liquid podczas przetwarzania wyjść z jawnym aktywem i poufną wartością.

Zobacz https://github.com/btcpayserver/NBXplorer/compare/v2.6.12...v2.6.13`,
    fr_FR: `Mise à jour de NBXplorer vers la version 2.6.13. Cette version corrige une boucle de plantage de l'indexeur Liquid lors du traitement de sorties avec un actif explicite et une valeur confidentielle.

Voir https://github.com/btcpayserver/NBXplorer/compare/v2.6.12...v2.6.13`,
  },
  migrations: {},
})
