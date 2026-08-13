import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3-rc.4:0',
  releaseNotes: {
    en_US: `Security update — BTCPay Server 2.4.3-rc4.

This is a **pre-release build**. It is packaged from BTCPay Server's internal image channel ahead of upstream's public release: at packaging time, 2.4.3 had no published release, git tag, or changelog, so the specifics of the fix are not yet public.

Upstream's full release notes will appear at https://github.com/btcpayserver/btcpayserver/releases once 2.4.3 is published.`,
    es_ES: `Actualización de seguridad — BTCPay Server 2.4.3-rc4.

Esta es una **versión preliminar**. Se empaqueta desde el canal de imágenes interno de BTCPay Server antes de la publicación oficial: en el momento del empaquetado, 2.4.3 no tenía publicación, etiqueta de git ni registro de cambios, por lo que los detalles de la corrección aún no son públicos.

Las notas de versión completas aparecerán en https://github.com/btcpayserver/btcpayserver/releases cuando se publique 2.4.3.`,
    de_DE: `Sicherheitsupdate — BTCPay Server 2.4.3-rc4.

Dies ist ein **Vorabversions-Build**. Er wird aus dem internen Image-Kanal von BTCPay Server vor der öffentlichen Veröffentlichung paketiert: Zum Zeitpunkt der Paketierung hatte 2.4.3 weder eine veröffentlichte Release noch einen Git-Tag oder ein Changelog, sodass die Einzelheiten der Korrektur noch nicht öffentlich sind.

Die vollständigen Release Notes erscheinen unter https://github.com/btcpayserver/btcpayserver/releases, sobald 2.4.3 veröffentlicht ist.`,
    pl_PL: `Aktualizacja bezpieczeństwa — BTCPay Server 2.4.3-rc4.

To jest **wersja przedpremierowa**. Została spakowana z wewnętrznego kanału obrazów BTCPay Server przed publicznym wydaniem: w chwili pakowania 2.4.3 nie miała opublikowanego wydania, tagu git ani listy zmian, więc szczegóły poprawki nie są jeszcze publiczne.

Pełne informacje o wydaniu pojawią się na https://github.com/btcpayserver/btcpayserver/releases po opublikowaniu 2.4.3.`,
    fr_FR: `Mise à jour de sécurité — BTCPay Server 2.4.3-rc4.

Il s'agit d'une **version préliminaire**. Elle est empaquetée depuis le canal d'images interne de BTCPay Server avant la publication officielle : au moment de l'empaquetage, 2.4.3 n'avait ni publication, ni étiquette git, ni journal des modifications, de sorte que les détails du correctif ne sont pas encore publics.

Les notes de version complètes paraîtront sur https://github.com/btcpayserver/btcpayserver/releases dès la publication de 2.4.3.`,
  },
  migrations: {},
})
