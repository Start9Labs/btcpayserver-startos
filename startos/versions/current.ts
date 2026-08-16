import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3-rc.5:0',
  releaseNotes: {
    en_US: `Security update — BTCPay Server 2.4.3-rc5.

This is a **pre-release build**, packaged from BTCPay Server's internal image channel ahead of upstream's public release: 2.4.3 still has no published release, git tag, or changelog. The changes below were identified by comparing the published rc4 and rc5 images.

- **Crowdfund** — an app's description is no longer rendered as raw HTML, closing a cross-site scripting vector.
- **Shopify plugin** — BTCPay Server now refuses to load outdated versions of the Shopify plugin and keeps them disabled until they are updated. If you use the Shopify integration, update the Shopify plugin under **Server Settings → Plugins** after this update; the newer plugin fixes a refund webhook vulnerability.

Upstream's full release notes will appear at https://github.com/btcpayserver/btcpayserver/releases once 2.4.3 is published.`,
    es_ES: `Actualización de seguridad — BTCPay Server 2.4.3-rc5.

Esta es una **versión preliminar**, empaquetada desde el canal de imágenes interno de BTCPay Server antes de la publicación oficial: 2.4.3 aún no tiene publicación, etiqueta de git ni registro de cambios. Los cambios siguientes se identificaron comparando las imágenes publicadas de rc4 y rc5.

- **Crowdfund** — la descripción de una aplicación ya no se representa como HTML sin procesar, lo que cierra un vector de scripting entre sitios.
- **Complemento de Shopify** — BTCPay Server ahora se niega a cargar versiones desactualizadas del complemento de Shopify y las mantiene desactivadas hasta que se actualicen. Si utiliza la integración con Shopify, actualice el complemento de Shopify en **Configuración del servidor → Complementos** después de esta actualización; el complemento más reciente corrige una vulnerabilidad en el webhook de reembolsos.

Las notas de versión completas aparecerán en https://github.com/btcpayserver/btcpayserver/releases cuando se publique 2.4.3.`,
    de_DE: `Sicherheitsupdate — BTCPay Server 2.4.3-rc5.

Dies ist ein **Vorabversions-Build**, paketiert aus dem internen Image-Kanal von BTCPay Server vor der öffentlichen Veröffentlichung: 2.4.3 hat weiterhin weder eine veröffentlichte Release noch einen Git-Tag oder ein Changelog. Die folgenden Änderungen wurden durch einen Vergleich der veröffentlichten rc4- und rc5-Images ermittelt.

- **Crowdfund** — die Beschreibung einer App wird nicht mehr als rohes HTML gerendert, wodurch ein Cross-Site-Scripting-Vektor geschlossen wird.
- **Shopify-Plugin** — BTCPay Server lädt veraltete Versionen des Shopify-Plugins nicht mehr und hält sie deaktiviert, bis sie aktualisiert werden. Wenn Sie die Shopify-Integration nutzen, aktualisieren Sie das Shopify-Plugin nach diesem Update unter **Servereinstellungen → Plugins**; das neuere Plugin behebt eine Schwachstelle im Rückerstattungs-Webhook.

Die vollständigen Release Notes erscheinen unter https://github.com/btcpayserver/btcpayserver/releases, sobald 2.4.3 veröffentlicht ist.`,
    pl_PL: `Aktualizacja bezpieczeństwa — BTCPay Server 2.4.3-rc5.

To jest **wersja przedpremierowa**, spakowana z wewnętrznego kanału obrazów BTCPay Server przed publicznym wydaniem: wersja 2.4.3 nadal nie ma opublikowanego wydania, tagu git ani listy zmian. Poniższe zmiany ustalono, porównując opublikowane obrazy rc4 i rc5.

- **Crowdfund** — opis aplikacji nie jest już renderowany jako surowy HTML, co zamyka wektor ataku cross-site scripting.
- **Wtyczka Shopify** — BTCPay Server odmawia teraz ładowania nieaktualnych wersji wtyczki Shopify i pozostawia je wyłączone do czasu aktualizacji. Jeśli korzystasz z integracji z Shopify, po tej aktualizacji zaktualizuj wtyczkę Shopify w **Ustawienia serwera → Wtyczki**; nowsza wtyczka naprawia lukę w webhooku zwrotów.

Pełne informacje o wydaniu pojawią się na https://github.com/btcpayserver/btcpayserver/releases po opublikowaniu wersji 2.4.3.`,
    fr_FR: `Mise à jour de sécurité — BTCPay Server 2.4.3-rc5.

Il s'agit d'une **version préliminaire**, empaquetée depuis le canal d'images interne de BTCPay Server avant la publication officielle : 2.4.3 n'a toujours ni version publiée, ni étiquette git, ni journal des modifications. Les changements ci-dessous ont été identifiés en comparant les images rc4 et rc5 publiées.

- **Crowdfund** — la description d'une application n'est plus rendue en HTML brut, ce qui ferme un vecteur de script intersites.
- **Extension Shopify** — BTCPay Server refuse désormais de charger les versions obsolètes de l'extension Shopify et les maintient désactivées jusqu'à leur mise à jour. Si vous utilisez l'intégration Shopify, mettez à jour l'extension Shopify dans **Paramètres du serveur → Extensions** après cette mise à jour ; la nouvelle extension corrige une vulnérabilité du webhook de remboursement.

Les notes de version complètes apparaîtront sur https://github.com/btcpayserver/btcpayserver/releases une fois 2.4.3 publiée.`,
  },
  migrations: {},
})
