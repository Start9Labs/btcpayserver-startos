import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3:2',
  releaseNotes: {
    en_US: `Restores BTCPay Server data left behind by an update from StartOS 0.3.x, and updates BTCPay Server to the 2.4.3 pre-release build rc6.

Updating from StartOS 0.3.x moves your BTCPay Server data — stores, invoices, wallets and settings — onto the storage this package uses. On servers running BTCPay Server 2.4.2 or later under StartOS 0.3.x, that move was skipped, and BTCPay Server started against empty storage: no stores, no accounts, every password rejected, and "No server admins exist" from the **Reset Server Admin Password** action.

**Nothing was deleted.** Your data stayed where the previous package kept it. This release moves it across on the first start after updating, so that start takes longer than usual — it is moving a database — and your original login works again once it finishes.

If you already hit this and created a new account in the empty BTCPay Server, that account and anything created with it is moved aside rather than deleted, and your original data takes its place. Contact support before removing what was set aside if you might need it.

**Lightning credentials.** If BTCPay Server is wired to a Lightning node, this update raises a critical task asking you to replace that node's credentials, and stops BTCPay Server until you clear it. The servers affected above never received that prompt when they should have; the 2.4.2 release notes explain why it matters.

**New in rc6:**

- **Store users** — a server admin can no longer be added to a store, nor have their role in a store changed, by someone who is not a server admin themselves. The rule applies both to a store's **Users** page and to the API.
- **Plugins** — the check that keeps an outdated plugin disabled until it is updated now covers seven more: Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark and Cashu. If you use any of them, update it under **Server Settings → Plugins**; until then it stays disabled.

**If you are updating from a version earlier than 2.4.3**, that release was also a security update:

- **Crowdfund** — an app's description is no longer rendered as raw HTML, closing a cross-site scripting vector.
- **Shopify plugin** — BTCPay Server now refuses to load outdated versions of the Shopify plugin and keeps them disabled until they are updated. If you use the Shopify integration, update the Shopify plugin under **Server Settings → Plugins** after this update; the newer plugin fixes a refund webhook vulnerability.

**About this version:** it ships BTCPay Server's 2.4.3 pre-release build (rc6) from BTCPay Server's internal image channel; upstream has not yet published a 2.4.3 release, git tag, or changelog. The upstream changes above were identified by comparing the published images. Upstream's full release notes will appear at https://github.com/btcpayserver/btcpayserver/releases once 2.4.3 is published.`,
    es_ES: `Restaura los datos de BTCPay Server que quedaron atrás en una actualización desde StartOS 0.3.x y actualiza BTCPay Server a la versión preliminar 2.4.3 rc6.

Al actualizar desde StartOS 0.3.x, tus datos de BTCPay Server —tiendas, facturas, monederos y ajustes— se trasladan al almacenamiento que usa este paquete. En servidores con BTCPay Server 2.4.2 o posterior bajo StartOS 0.3.x, ese traslado se omitió y BTCPay Server arrancó con el almacenamiento vacío: sin tiendas, sin cuentas, rechazando todas las contraseñas y respondiendo «No server admins exist» en la acción **Restablecer la contraseña del administrador del servidor**.

**No se ha borrado nada.** Tus datos siguen donde los dejó el paquete anterior. Esta versión los traslada en el primer arranque tras la actualización, así que ese arranque tarda más de lo habitual —está moviendo una base de datos— y después tu inicio de sesión original vuelve a funcionar.

Si ya te encontraste con esto y creaste una cuenta nueva en el BTCPay Server vacío, esa cuenta y todo lo creado con ella se aparta en lugar de borrarse, y tus datos originales ocupan su lugar. Contacta con soporte antes de eliminar lo que se apartó si crees que puedes necesitarlo.

**Credenciales de Lightning.** Si BTCPay Server está conectado a un nodo Lightning, esta actualización genera una tarea crítica que te pide sustituir las credenciales de ese nodo y detiene BTCPay Server hasta que la resuelvas. Los servidores afectados por lo anterior nunca recibieron ese aviso cuando debían; las notas de la versión 2.4.2 explican por qué importa.

**Novedades de rc6:**

- **Usuarios de la tienda** — un administrador del servidor ya no puede ser añadido a una tienda, ni ver modificado su rol en ella, por alguien que no sea también administrador del servidor. La regla se aplica tanto a la página **Usuarios** de la tienda como a la API.
- **Complementos** — la comprobación que mantiene desactivado un complemento desactualizado hasta que se actualice ahora abarca siete más: Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark y Cashu. Si utilizas alguno de ellos, actualízalo en **Configuración del servidor → Complementos**; hasta entonces permanecerá desactivado.

**Si actualizas desde una versión anterior a la 2.4.3**, esa versión fue además una actualización de seguridad:

- **Crowdfund** — la descripción de una aplicación ya no se representa como HTML sin procesar, lo que cierra un vector de scripting entre sitios.
- **Complemento de Shopify** — BTCPay Server ahora se niega a cargar versiones desactualizadas del complemento de Shopify y las mantiene desactivadas hasta que se actualicen. Si utilizas la integración con Shopify, actualiza el complemento de Shopify en **Configuración del servidor → Complementos** después de esta actualización; el complemento más reciente corrige una vulnerabilidad en el webhook de reembolsos.

**Acerca de esta versión:** incluye la versión preliminar 2.4.3 (rc6) de BTCPay Server, tomada de su canal de imágenes interno; upstream aún no ha publicado una versión 2.4.3, ni etiqueta de git ni registro de cambios. Los cambios de upstream anteriores se identificaron comparando las imágenes publicadas. Las notas de versión completas aparecerán en https://github.com/btcpayserver/btcpayserver/releases cuando se publique la 2.4.3.`,
    de_DE: `Stellt BTCPay-Server-Daten wieder her, die bei einem Update von StartOS 0.3.x zurückgeblieben sind, und aktualisiert BTCPay Server auf den Vorabversions-Build 2.4.3 rc6.

Beim Update von StartOS 0.3.x werden Ihre BTCPay-Server-Daten – Shops, Rechnungen, Wallets und Einstellungen – auf den Speicher dieses Pakets verschoben. Auf Servern mit BTCPay Server 2.4.2 oder neuer unter StartOS 0.3.x wurde dieser Schritt übersprungen, und BTCPay Server startete mit leerem Speicher: keine Shops, keine Konten, jedes Passwort abgelehnt und „No server admins exist" als Antwort der Aktion **Server-Admin-Passwort zurücksetzen**.

**Es wurde nichts gelöscht.** Ihre Daten liegen weiterhin dort, wo das vorherige Paket sie abgelegt hat. Diese Version verschiebt sie beim ersten Start nach dem Update. Dieser Start dauert daher länger als gewohnt – es wird eine Datenbank verschoben – und danach funktioniert Ihre ursprüngliche Anmeldung wieder.

Wenn Sie bereits betroffen waren und im leeren BTCPay Server ein neues Konto angelegt haben, wird dieses Konto samt allem damit Erstellten beiseitegelegt statt gelöscht, und Ihre ursprünglichen Daten treten an seine Stelle. Wenden Sie sich an den Support, bevor Sie das Beiseitegelegte entfernen, falls Sie es noch benötigen könnten.

**Lightning-Zugangsdaten.** Wenn BTCPay Server mit einem Lightning-Knoten verbunden ist, erzeugt dieses Update eine kritische Aufgabe, die Sie auffordert, die Zugangsdaten dieses Knotens zu ersetzen, und stoppt BTCPay Server, bis Sie sie erledigen. Die oben beschriebenen Server haben diese Aufforderung nie erhalten, obwohl sie sie hätten erhalten müssen; die Versionshinweise zu 2.4.2 erklären, warum das wichtig ist.

**Neu in rc6:**

- **Store-Benutzer** — ein Serveradministrator kann einem Store nicht mehr hinzugefügt werden, und seine Rolle in einem Store nicht mehr geändert werden, von jemandem, der nicht selbst Serveradministrator ist. Die Regel gilt sowohl für die Seite **Benutzer** eines Stores als auch für die API.
- **Plugins** — die Prüfung, die ein veraltetes Plugin bis zu seiner Aktualisierung deaktiviert hält, erfasst jetzt sieben weitere: Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark und Cashu. Wenn Sie eines davon nutzen, aktualisieren Sie es unter **Servereinstellungen → Plugins**; bis dahin bleibt es deaktiviert.

**Wenn Sie von einer Version vor 2.4.3 aktualisieren**, war jene Version zudem ein Sicherheitsupdate:

- **Crowdfund** — die Beschreibung einer App wird nicht mehr als rohes HTML gerendert, wodurch ein Cross-Site-Scripting-Vektor geschlossen wird.
- **Shopify-Plugin** — BTCPay Server lädt veraltete Versionen des Shopify-Plugins nicht mehr und hält sie deaktiviert, bis sie aktualisiert werden. Wenn Sie die Shopify-Integration nutzen, aktualisieren Sie das Shopify-Plugin nach diesem Update unter **Servereinstellungen → Plugins**; das neuere Plugin behebt eine Schwachstelle im Rückerstattungs-Webhook.

**Zu dieser Version:** Sie enthält den Vorabversions-Build 2.4.3 (rc6) von BTCPay Server aus dessen internem Image-Kanal; upstream hat bislang weder eine 2.4.3-Veröffentlichung noch einen Git-Tag oder ein Changelog publiziert. Die obigen Upstream-Änderungen wurden durch einen Vergleich der veröffentlichten Images ermittelt. Die vollständigen Release Notes erscheinen unter https://github.com/btcpayserver/btcpayserver/releases, sobald 2.4.3 veröffentlicht ist.`,
    pl_PL: `Przywraca dane BTCPay Server pozostawione przez aktualizację ze StartOS 0.3.x i aktualizuje BTCPay Server do przedpremierowego builda 2.4.3 rc6.

Aktualizacja ze StartOS 0.3.x przenosi dane BTCPay Server — sklepy, faktury, portfele i ustawienia — do pamięci używanej przez ten pakiet. Na serwerach z BTCPay Server 2.4.2 lub nowszym pod StartOS 0.3.x to przeniesienie zostało pominięte i BTCPay Server uruchomił się z pustą pamięcią: bez sklepów, bez kont, odrzucając każde hasło i zwracając „No server admins exist" w akcji **Zresetuj hasło administratora serwera**.

**Nic nie zostało usunięte.** Twoje dane pozostały tam, gdzie zostawił je poprzedni pakiet. Ta wersja przenosi je przy pierwszym uruchomieniu po aktualizacji, więc to uruchomienie trwa dłużej niż zwykle — przenoszona jest baza danych — a potem twoje pierwotne logowanie znów działa.

Jeśli już to napotkałeś i utworzyłeś nowe konto w pustym BTCPay Server, to konto i wszystko, co za jego pomocą utworzono, zostaje odłożone na bok, a nie usunięte, a twoje pierwotne dane zajmują jego miejsce. Skontaktuj się ze wsparciem przed usunięciem tego, co odłożono, jeśli może ci to być potrzebne.

**Poświadczenia Lightning.** Jeśli BTCPay Server jest połączony z węzłem Lightning, ta aktualizacja tworzy zadanie krytyczne z prośbą o wymianę poświadczeń tego węzła i zatrzymuje BTCPay Server do czasu jego wykonania. Serwery, których dotyczy powyższy problem, nigdy nie otrzymały tego monitu, choć powinny; informacje o wydaniu 2.4.2 wyjaśniają, dlaczego to ważne.

**Nowości w rc6:**

- **Użytkownicy sklepu** — administrator serwera nie może już zostać dodany do sklepu ani mieć zmienionej roli w sklepie przez osobę, która sama nie jest administratorem serwera. Zasada obowiązuje zarówno na stronie **Użytkownicy** sklepu, jak i w API.
- **Wtyczki** — kontrola, która pozostawia nieaktualną wtyczkę wyłączoną do czasu jej aktualizacji, obejmuje teraz siedem kolejnych: Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark i Cashu. Jeśli korzystasz z którejś z nich, zaktualizuj ją w **Ustawienia serwera → Wtyczki**; do tego czasu pozostanie wyłączona.

**Jeśli aktualizujesz z wersji starszej niż 2.4.3**, tamto wydanie było ponadto aktualizacją bezpieczeństwa:

- **Crowdfund** — opis aplikacji nie jest już renderowany jako surowy HTML, co zamyka wektor ataku cross-site scripting.
- **Wtyczka Shopify** — BTCPay Server odmawia teraz ładowania nieaktualnych wersji wtyczki Shopify i pozostawia je wyłączone do czasu aktualizacji. Jeśli korzystasz z integracji z Shopify, po tej aktualizacji zaktualizuj wtyczkę Shopify w **Ustawienia serwera → Wtyczki**; nowsza wtyczka naprawia lukę w webhooku zwrotów.

**O tej wersji:** zawiera przedpremierowy build 2.4.3 (rc6) BTCPay Server z wewnętrznego kanału obrazów; upstream nie opublikował jeszcze wydania 2.4.3, tagu git ani listy zmian. Powyższe zmiany upstreamu ustalono, porównując opublikowane obrazy. Pełne informacje o wydaniu pojawią się na https://github.com/btcpayserver/btcpayserver/releases po opublikowaniu wersji 2.4.3.`,
    fr_FR: `Restaure les données de BTCPay Server laissées de côté par une mise à jour depuis StartOS 0.3.x et met à jour BTCPay Server vers la version préliminaire 2.4.3 rc6.

La mise à jour depuis StartOS 0.3.x déplace vos données BTCPay Server — boutiques, factures, portefeuilles et paramètres — vers le stockage utilisé par ce paquet. Sur les serveurs exécutant BTCPay Server 2.4.2 ou plus récent sous StartOS 0.3.x, ce déplacement a été ignoré et BTCPay Server a démarré sur un stockage vide : aucune boutique, aucun compte, tous les mots de passe refusés, et « No server admins exist » en réponse à l'action **Réinitialiser le mot de passe administrateur du serveur**.

**Rien n'a été supprimé.** Vos données sont restées là où le paquet précédent les avait placées. Cette version les déplace au premier démarrage après la mise à jour ; ce démarrage est donc plus long que d'habitude — une base de données est en cours de déplacement — et votre identifiant d'origine fonctionne de nouveau ensuite.

Si vous avez déjà rencontré ce problème et créé un nouveau compte dans le BTCPay Server vide, ce compte et tout ce qui a été créé avec lui est mis de côté plutôt que supprimé, et vos données d'origine reprennent leur place. Contactez l'assistance avant de supprimer ce qui a été mis de côté si vous pourriez en avoir besoin.

**Identifiants Lightning.** Si BTCPay Server est relié à un nœud Lightning, cette mise à jour crée une tâche critique vous demandant de renouveler les identifiants de ce nœud et arrête BTCPay Server jusqu'à ce que vous la traitiez. Les serveurs concernés ci-dessus n'ont jamais reçu cette invite alors qu'ils auraient dû ; les notes de version 2.4.2 expliquent pourquoi cela compte.

**Nouveautés de rc6 :**

- **Utilisateurs de la boutique** — un administrateur du serveur ne peut plus être ajouté à une boutique, ni voir son rôle dans une boutique modifié, par quelqu'un qui n'est pas lui-même administrateur du serveur. La règle s'applique aussi bien à la page **Utilisateurs** d'une boutique qu'à l'API.
- **Extensions** — le contrôle qui maintient une extension obsolète désactivée jusqu'à sa mise à jour couvre désormais sept extensions de plus : Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark et Cashu. Si vous utilisez l'une d'elles, mettez-la à jour dans **Paramètres du serveur → Extensions** ; d'ici là, elle reste désactivée.

**Si vous effectuez la mise à jour depuis une version antérieure à 2.4.3**, cette version était en outre une mise à jour de sécurité :

- **Crowdfund** — la description d'une application n'est plus rendue en HTML brut, ce qui ferme un vecteur de script intersites.
- **Extension Shopify** — BTCPay Server refuse désormais de charger les versions obsolètes de l'extension Shopify et les maintient désactivées jusqu'à leur mise à jour. Si vous utilisez l'intégration Shopify, mettez à jour l'extension Shopify dans **Paramètres du serveur → Extensions** après cette mise à jour ; la nouvelle extension corrige une vulnérabilité du webhook de remboursement.

**À propos de cette version :** elle embarque la version préliminaire 2.4.3 (rc6) de BTCPay Server, issue de son canal d'images interne ; en amont, 2.4.3 n'a encore ni version publiée, ni étiquette git, ni journal des modifications. Les changements en amont ci-dessus ont été identifiés en comparant les images publiées. Les notes de version complètes apparaîtront sur https://github.com/btcpayserver/btcpayserver/releases une fois la 2.4.3 publiée.`,
  },
  migrations: {},
})
