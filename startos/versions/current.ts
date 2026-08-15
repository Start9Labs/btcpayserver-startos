import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3-rc.5:0',
  releaseNotes: {
    en_US: `Updated BTCPay Server to the 2.4.3-rc5 pre-release build.

This is still a **pre-release**, packaged from BTCPay Server's internal image channel ahead of upstream's public release. As with rc4, 2.4.3 has no published release, git tag, or changelog, and upstream's public branch has not moved since 2.4.2 — so what changed between rc4 and rc5 is not yet public.

NBXplorer and PostgreSQL are unchanged.

Upstream's full release notes will appear at https://github.com/btcpayserver/btcpayserver/releases once 2.4.3 is published.`,
    es_ES: `BTCPay Server actualizado a la versión preliminar 2.4.3-rc5.

Sigue siendo una **versión preliminar**, empaquetada desde el canal de imágenes interno de BTCPay Server antes de la publicación oficial. Al igual que con rc4, 2.4.3 no tiene publicación, etiqueta de git ni registro de cambios, y la rama pública no ha avanzado desde 2.4.2, por lo que los cambios entre rc4 y rc5 aún no son públicos.

NBXplorer y PostgreSQL no han cambiado.

Las notas de versión completas aparecerán en https://github.com/btcpayserver/btcpayserver/releases cuando se publique 2.4.3.`,
    de_DE: `BTCPay Server auf den Vorabversions-Build 2.4.3-rc5 aktualisiert.

Dies ist weiterhin eine **Vorabversion**, paketiert aus dem internen Image-Kanal von BTCPay Server vor der öffentlichen Veröffentlichung. Wie schon bei rc4 hat 2.4.3 weder eine veröffentlichte Release noch einen Git-Tag oder ein Changelog, und der öffentliche Zweig hat sich seit 2.4.2 nicht bewegt — was sich zwischen rc4 und rc5 geändert hat, ist daher noch nicht öffentlich.

NBXplorer und PostgreSQL bleiben unverändert.

Die vollständigen Release Notes erscheinen unter https://github.com/btcpayserver/btcpayserver/releases, sobald 2.4.3 veröffentlicht ist.`,
    pl_PL: `Zaktualizowano BTCPay Server do wersji przedpremierowej 2.4.3-rc5.

To nadal **wersja przedpremierowa**, spakowana z wewnętrznego kanału obrazów BTCPay Server przed publicznym wydaniem. Podobnie jak przy rc4, wersja 2.4.3 nie ma opublikowanego wydania, tagu git ani listy zmian, a publiczna gałąź nie zmieniła się od 2.4.2 — dlatego zmiany między rc4 a rc5 nie są jeszcze publiczne.

NBXplorer i PostgreSQL pozostają bez zmian.

Pełne informacje o wydaniu pojawią się na https://github.com/btcpayserver/btcpayserver/releases po opublikowaniu 2.4.3.`,
    fr_FR: `BTCPay Server mis à jour vers la version préliminaire 2.4.3-rc5.

Il s'agit toujours d'une **version préliminaire**, empaquetée depuis le canal d'images interne de BTCPay Server avant la publication officielle. Comme pour rc4, 2.4.3 n'a ni publication, ni étiquette git, ni journal des modifications, et la branche publique n'a pas évolué depuis 2.4.2 : les changements entre rc4 et rc5 ne sont donc pas encore publics.

NBXplorer et PostgreSQL restent inchangés.

Les notes de version complètes paraîtront sur https://github.com/btcpayserver/btcpayserver/releases dès la publication de 2.4.3.`,
  },
  migrations: {},
})
