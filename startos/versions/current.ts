import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3:0',
  releaseNotes: {
    en_US: `Security update — BTCPay Server 2.4.3 — and a fix for a failed update from StartOS 0.3.x.

**About this version:** it ships BTCPay Server's 2.4.3 pre-release build (rc5) from BTCPay Server's internal image channel; upstream has not yet published a 2.4.3 release, git tag, or changelog. The security changes below were identified by comparing the published rc4 and rc5 images. This package will move to the final 2.4.3 build as soon as it is published.

- **Crowdfund** — an app's description is no longer rendered as raw HTML, closing a cross-site scripting vector.
- **Shopify plugin** — BTCPay Server now refuses to load outdated versions of the Shopify plugin and keeps them disabled until they are updated. If you use the Shopify integration, update the Shopify plugin under **Server Settings → Plugins** after this update; the newer plugin fixes a refund webhook vulnerability.
- **Updating from StartOS 0.3.x** — the migration copied a plugins folder that only exists if you had installed a plugin. On a server that never did, the copy failed and took the whole update down with it, with no way past it on retry. The migration now skips what isn't there, and no longer reports success when a file copy fails partway, which could previously finish an update with data left behind.

Upstream's full release notes will appear at https://github.com/btcpayserver/btcpayserver/releases once 2.4.3 is published.`,
    es_ES: `Actualización de seguridad — BTCPay Server 2.4.3 — y corrección de una actualización fallida desde StartOS 0.3.x.

**Acerca de esta versión:** incluye la versión preliminar 2.4.3 (rc5) de BTCPay Server, tomada de su canal de imágenes interno; upstream aún no ha publicado una versión 2.4.3, ni etiqueta de git ni registro de cambios. Los cambios de seguridad siguientes se identificaron comparando las imágenes publicadas de rc4 y rc5. Este paquete pasará a la compilación final de 2.4.3 en cuanto se publique.

- **Crowdfund** — la descripción de una aplicación ya no se representa como HTML sin procesar, lo que cierra un vector de scripting entre sitios.
- **Complemento de Shopify** — BTCPay Server ahora se niega a cargar versiones desactualizadas del complemento de Shopify y las mantiene desactivadas hasta que se actualicen. Si utiliza la integración con Shopify, actualice el complemento de Shopify en **Configuración del servidor → Complementos** después de esta actualización; el complemento más reciente corrige una vulnerabilidad en el webhook de reembolsos.
- **Actualizar desde StartOS 0.3.x** — la migración copiaba una carpeta de complementos que solo existe si había instalado alguno. En un servidor que nunca lo hizo, la copia fallaba y se llevaba consigo toda la actualización, sin forma de superarlo al reintentar. La migración ahora omite lo que no existe y ya no informa de éxito cuando una copia de archivos falla a medias, lo que antes podía terminar una actualización dejando datos atrás.

Las notas de versión completas aparecerán en https://github.com/btcpayserver/btcpayserver/releases cuando se publique 2.4.3.`,
    de_DE: `Sicherheitsupdate — BTCPay Server 2.4.3 — und Behebung eines fehlgeschlagenen Updates von StartOS 0.3.x.

**Zu dieser Version:** Sie enthält den Vorabversions-Build 2.4.3 (rc5) von BTCPay Server aus dem internen Image-Kanal; upstream hat bislang weder eine 2.4.3-Veröffentlichung noch einen Git-Tag oder ein Changelog publiziert. Die folgenden Sicherheitsänderungen wurden durch einen Vergleich der veröffentlichten rc4- und rc5-Images ermittelt. Dieses Paket wechselt auf den finalen 2.4.3-Build, sobald dieser veröffentlicht ist.

- **Crowdfund** — die Beschreibung einer App wird nicht mehr als rohes HTML gerendert, wodurch ein Cross-Site-Scripting-Vektor geschlossen wird.
- **Shopify-Plugin** — BTCPay Server lädt veraltete Versionen des Shopify-Plugins nicht mehr und hält sie deaktiviert, bis sie aktualisiert werden. Wenn Sie die Shopify-Integration nutzen, aktualisieren Sie das Shopify-Plugin nach diesem Update unter **Servereinstellungen → Plugins**; das neuere Plugin behebt eine Schwachstelle im Rückerstattungs-Webhook.
- **Update von StartOS 0.3.x** — die Migration kopierte einen Plugin-Ordner, den es nur gibt, wenn Sie ein Plugin installiert hatten. Auf einem Server ohne Plugin schlug das Kopieren fehl und riss das ganze Update mit sich, ohne dass ein erneuter Versuch daran vorbeikam. Die Migration überspringt jetzt, was nicht vorhanden ist, und meldet keinen Erfolg mehr, wenn ein Dateikopiervorgang mittendrin fehlschlägt — zuvor konnte ein Update so abschließen und Daten zurücklassen.

Die vollständigen Release Notes erscheinen unter https://github.com/btcpayserver/btcpayserver/releases, sobald 2.4.3 veröffentlicht ist.`,
    pl_PL: `Aktualizacja bezpieczeństwa — BTCPay Server 2.4.3 — oraz poprawka nieudanej aktualizacji ze StartOS 0.3.x.

**O tej wersji:** zawiera przedpremierowy build 2.4.3 (rc5) BTCPay Server z wewnętrznego kanału obrazów; upstream nie opublikował jeszcze wydania 2.4.3, tagu git ani listy zmian. Poniższe zmiany bezpieczeństwa ustalono, porównując opublikowane obrazy rc4 i rc5. Pakiet przejdzie na finalny build 2.4.3, gdy tylko zostanie opublikowany.

- **Crowdfund** — opis aplikacji nie jest już renderowany jako surowy HTML, co zamyka wektor ataku cross-site scripting.
- **Wtyczka Shopify** — BTCPay Server odmawia teraz ładowania nieaktualnych wersji wtyczki Shopify i pozostawia je wyłączone do czasu aktualizacji. Jeśli korzystasz z integracji z Shopify, po tej aktualizacji zaktualizuj wtyczkę Shopify w **Ustawienia serwera → Wtyczki**; nowsza wtyczka naprawia lukę w webhooku zwrotów.
- **Aktualizacja ze StartOS 0.3.x** — migracja kopiowała folder wtyczek, który istnieje tylko wtedy, gdy jakąś wtyczkę zainstalowano. Na serwerze bez wtyczek kopiowanie kończyło się błędem i przerywało całą aktualizację, a ponowna próba nic nie dawała. Migracja pomija teraz to, czego nie ma, i nie zgłasza już powodzenia, gdy kopiowanie plików zawiedzie w połowie — wcześniej aktualizacja mogła się zakończyć, zostawiając dane.

Pełne informacje o wydaniu pojawią się na https://github.com/btcpayserver/btcpayserver/releases po opublikowaniu wersji 2.4.3.`,
    fr_FR: `Mise à jour de sécurité — BTCPay Server 2.4.3 — et correction d'une mise à jour échouée depuis StartOS 0.3.x.

**À propos de cette version :** elle embarque la version préliminaire 2.4.3 (rc5) de BTCPay Server, issue de son canal d'images interne ; en amont, 2.4.3 n'a encore ni version publiée, ni étiquette git, ni journal des modifications. Les changements de sécurité ci-dessous ont été identifiés en comparant les images rc4 et rc5 publiées. Ce paquet basculera sur la version finale de 2.4.3 dès sa publication.

- **Crowdfund** — la description d'une application n'est plus rendue en HTML brut, ce qui ferme un vecteur de script intersites.
- **Extension Shopify** — BTCPay Server refuse désormais de charger les versions obsolètes de l'extension Shopify et les maintient désactivées jusqu'à leur mise à jour. Si vous utilisez l'intégration Shopify, mettez à jour l'extension Shopify dans **Paramètres du serveur → Extensions** après cette mise à jour ; la nouvelle extension corrige une vulnérabilité du webhook de remboursement.
- **Mise à jour depuis StartOS 0.3.x** — la migration copiait un dossier d'extensions qui n'existe que si vous en aviez installé une. Sur un serveur qui n'en a jamais eu, la copie échouait et emportait toute la mise à jour, sans moyen de passer outre en réessayant. La migration ignore désormais ce qui est absent et ne signale plus un succès lorsqu'une copie de fichiers échoue en cours de route, ce qui pouvait auparavant terminer une mise à jour en laissant des données de côté.

Les notes de version complètes apparaîtront sur https://github.com/btcpayserver/btcpayserver/releases une fois 2.4.3 publiée.`,
  },
  migrations: {},
})
