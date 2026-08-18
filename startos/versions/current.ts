import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3:2',
  releaseNotes: {
    en_US: `Updated BTCPay Server to the 2.4.3 pre-release build rc6.

**About this version:** it ships BTCPay Server's 2.4.3 pre-release build (rc6) from BTCPay Server's internal image channel; upstream has not yet published a 2.4.3 release, git tag, or changelog. The changes below were identified by comparing the published rc5 and rc6 images.

- **Store users** — a server admin can no longer be added to a store, nor have their role in a store changed, by someone who is not a server admin themselves. The rule applies both to a store's **Users** page and to the API.
- **Plugins** — the check that keeps an outdated plugin disabled until it is updated now covers seven more: Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark and Cashu. If you use any of them, update it under **Server Settings → Plugins**; until then it stays disabled.

Upstream's full release notes will appear at https://github.com/btcpayserver/btcpayserver/releases once 2.4.3 is published.`,
    es_ES: `BTCPay Server actualizado a la versión preliminar 2.4.3 rc6.

**Acerca de esta versión:** incluye la versión preliminar 2.4.3 (rc6) de BTCPay Server, tomada de su canal de imágenes interno; upstream aún no ha publicado una versión 2.4.3, ni etiqueta de git ni registro de cambios. Los cambios siguientes se identificaron comparando las imágenes publicadas de rc5 y rc6.

- **Usuarios de la tienda** — un administrador del servidor ya no puede ser añadido a una tienda, ni ver modificado su rol en ella, por alguien que no sea también administrador del servidor. La regla se aplica tanto a la página **Usuarios** de la tienda como a la API.
- **Complementos** — la comprobación que mantiene desactivado un complemento desactualizado hasta que se actualice ahora abarca siete más: Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark y Cashu. Si utiliza alguno de ellos, actualícelo en **Configuración del servidor → Complementos**; hasta entonces permanecerá desactivado.

Las notas de versión completas aparecerán en https://github.com/btcpayserver/btcpayserver/releases cuando se publique 2.4.3.`,
    de_DE: `BTCPay Server auf den Vorabversions-Build 2.4.3 rc6 aktualisiert.

**Zu dieser Version:** Sie enthält den Vorabversions-Build 2.4.3 (rc6) von BTCPay Server aus dem internen Image-Kanal; upstream hat bislang weder eine 2.4.3-Veröffentlichung noch einen Git-Tag oder ein Changelog publiziert. Die folgenden Änderungen wurden durch einen Vergleich der veröffentlichten rc5- und rc6-Images ermittelt.

- **Store-Benutzer** — ein Serveradministrator kann einem Store nicht mehr hinzugefügt werden, und seine Rolle in einem Store nicht mehr geändert werden, von jemandem, der nicht selbst Serveradministrator ist. Die Regel gilt sowohl für die Seite **Benutzer** eines Stores als auch für die API.
- **Plugins** — die Prüfung, die ein veraltetes Plugin bis zu seiner Aktualisierung deaktiviert hält, erfasst jetzt sieben weitere: Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark und Cashu. Wenn Sie eines davon nutzen, aktualisieren Sie es unter **Servereinstellungen → Plugins**; bis dahin bleibt es deaktiviert.

Die vollständigen Release Notes erscheinen unter https://github.com/btcpayserver/btcpayserver/releases, sobald 2.4.3 veröffentlicht ist.`,
    pl_PL: `Zaktualizowano BTCPay Server do przedpremierowego builda 2.4.3 rc6.

**O tej wersji:** zawiera przedpremierowy build 2.4.3 (rc6) BTCPay Server z wewnętrznego kanału obrazów; upstream nie opublikował jeszcze wydania 2.4.3, tagu git ani listy zmian. Poniższe zmiany ustalono, porównując opublikowane obrazy rc5 i rc6.

- **Użytkownicy sklepu** — administrator serwera nie może już zostać dodany do sklepu ani mieć zmienionej roli w sklepie przez osobę, która sama nie jest administratorem serwera. Zasada obowiązuje zarówno na stronie **Użytkownicy** sklepu, jak i w API.
- **Wtyczki** — kontrola, która pozostawia nieaktualną wtyczkę wyłączoną do czasu jej aktualizacji, obejmuje teraz siedem kolejnych: Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark i Cashu. Jeśli korzystasz z którejś z nich, zaktualizuj ją w **Ustawienia serwera → Wtyczki**; do tego czasu pozostanie wyłączona.

Pełne informacje o wydaniu pojawią się na https://github.com/btcpayserver/btcpayserver/releases po opublikowaniu wersji 2.4.3.`,
    fr_FR: `BTCPay Server mis à jour vers la version préliminaire 2.4.3 rc6.

**À propos de cette version :** elle embarque la version préliminaire 2.4.3 (rc6) de BTCPay Server, issue de son canal d'images interne ; en amont, 2.4.3 n'a encore ni version publiée, ni étiquette git, ni journal des modifications. Les changements ci-dessous ont été identifiés en comparant les images rc5 et rc6 publiées.

- **Utilisateurs de la boutique** — un administrateur du serveur ne peut plus être ajouté à une boutique, ni voir son rôle dans une boutique modifié, par quelqu'un qui n'est pas lui-même administrateur du serveur. La règle s'applique aussi bien à la page **Utilisateurs** d'une boutique qu'à l'API.
- **Extensions** — le contrôle qui maintient une extension obsolète désactivée jusqu'à sa mise à jour couvre désormais sept extensions de plus : Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark et Cashu. Si vous utilisez l'une d'elles, mettez-la à jour dans **Paramètres du serveur → Extensions** ; d'ici là, elle reste désactivée.

Les notes de version complètes apparaîtront sur https://github.com/btcpayserver/btcpayserver/releases une fois 2.4.3 publiée.`,
  },
  migrations: {},
})
