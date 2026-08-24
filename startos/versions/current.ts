import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3:3',
  releaseNotes: {
    en_US: `Restores BTCPay Server data left behind by an update from StartOS 0.3.x, and updates BTCPay Server to 2.4.3.

Updating from StartOS 0.3.x moves your BTCPay Server data — stores, invoices, wallets and settings — onto the storage this package uses. On servers running BTCPay Server 2.4.2 or later under StartOS 0.3.x, that move was skipped, and BTCPay Server started against empty storage: no stores, no accounts, every password rejected, and "No server admins exist" from the **Reset Server Admin Password** action.

**Nothing was deleted.** Your data stayed where the previous package kept it. This release moves it across on the first start after updating, so that start takes longer than usual — it is moving a database — and your original login works again once it finishes.

If you already hit this and created a new account in the empty BTCPay Server, that account and anything created with it is moved aside rather than deleted, and your original data takes its place. Contact support before removing what was set aside if you might need it.

**Lightning credentials.** If BTCPay Server is wired to a Lightning node, this update raises a critical task asking you to replace that node's credentials, and stops BTCPay Server until you clear it. The servers affected above never received that prompt when they should have; the 2.4.2 release notes explain why it matters.

**BTCPay Server 2.4.3 is a security release.** If you are updating from an earlier version, it matters most where other people hold accounts on your BTCPay Server:

- **Store users** — a server admin can no longer be added to a store, nor have their role in a store changed, by someone who is not a server admin themselves. The rule applies both to a store's **Users** page and to the API.
- **Crowdfund** — an app's description and the descriptions of its perks are no longer rendered as raw HTML, closing a cross-site scripting vector. Disqus comments go with it: the setting and the public **Discussion** tab are removed.
- **Plugins** — BTCPay Server now refuses to load outdated versions of eight plugins and keeps each one disabled until it is updated: Shopify, Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark and Cashu. If you use any of them, update it under **Server Settings → Plugins**; the newer Shopify plugin also closes a refund webhook vulnerability.

Upstream's full release notes: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.3`,
    es_ES: `Restaura los datos de BTCPay Server que quedaron atrás en una actualización desde StartOS 0.3.x y actualiza BTCPay Server a la versión 2.4.3.

Al actualizar desde StartOS 0.3.x, tus datos de BTCPay Server —tiendas, facturas, monederos y ajustes— se trasladan al almacenamiento que usa este paquete. En servidores con BTCPay Server 2.4.2 o posterior bajo StartOS 0.3.x, ese traslado se omitió y BTCPay Server arrancó con el almacenamiento vacío: sin tiendas, sin cuentas, rechazando todas las contraseñas y respondiendo «No server admins exist» en la acción **Restablecer la contraseña del administrador del servidor**.

**No se ha borrado nada.** Tus datos siguen donde los dejó el paquete anterior. Esta versión los traslada en el primer arranque tras la actualización, así que ese arranque tarda más de lo habitual —está moviendo una base de datos— y después tu inicio de sesión original vuelve a funcionar.

Si ya te encontraste con esto y creaste una cuenta nueva en el BTCPay Server vacío, esa cuenta y todo lo creado con ella se aparta en lugar de borrarse, y tus datos originales ocupan su lugar. Contacta con soporte antes de eliminar lo que se apartó si crees que puedes necesitarlo.

**Credenciales de Lightning.** Si BTCPay Server está conectado a un nodo Lightning, esta actualización genera una tarea crítica que te pide sustituir las credenciales de ese nodo y detiene BTCPay Server hasta que la resuelvas. Los servidores afectados por lo anterior nunca recibieron ese aviso cuando debían; las notas de la versión 2.4.2 explican por qué importa.

**BTCPay Server 2.4.3 es una versión de seguridad.** Si actualizas desde una versión anterior, importa sobre todo allí donde otras personas tienen cuentas en tu BTCPay Server:

- **Usuarios de la tienda** — un administrador del servidor ya no puede ser añadido a una tienda, ni ver modificado su rol en ella, por alguien que no sea también administrador del servidor. La regla se aplica tanto a la página **Usuarios** de la tienda como a la API.
- **Crowdfund** — la descripción de una aplicación y las de sus recompensas ya no se representan como HTML sin procesar, lo que cierra un vector de scripting entre sitios. Los comentarios de Disqus desaparecen con ello: se eliminan el ajuste y la pestaña pública **Discusión**.
- **Complementos** — BTCPay Server ahora se niega a cargar versiones desactualizadas de ocho complementos y mantiene cada uno desactivado hasta que se actualice: Shopify, Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark y Cashu. Si utilizas alguno de ellos, actualízalo en **Configuración del servidor → Complementos**; el complemento de Shopify más reciente corrige además una vulnerabilidad en el webhook de reembolsos.

Notas de versión completas de upstream: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.3`,
    de_DE: `Stellt BTCPay-Server-Daten wieder her, die bei einem Update von StartOS 0.3.x zurückgeblieben sind, und aktualisiert BTCPay Server auf 2.4.3.

Beim Update von StartOS 0.3.x werden Ihre BTCPay-Server-Daten – Shops, Rechnungen, Wallets und Einstellungen – auf den Speicher dieses Pakets verschoben. Auf Servern mit BTCPay Server 2.4.2 oder neuer unter StartOS 0.3.x wurde dieser Schritt übersprungen, und BTCPay Server startete mit leerem Speicher: keine Shops, keine Konten, jedes Passwort abgelehnt und „No server admins exist" als Antwort der Aktion **Server-Admin-Passwort zurücksetzen**.

**Es wurde nichts gelöscht.** Ihre Daten liegen weiterhin dort, wo das vorherige Paket sie abgelegt hat. Diese Version verschiebt sie beim ersten Start nach dem Update. Dieser Start dauert daher länger als gewohnt – es wird eine Datenbank verschoben – und danach funktioniert Ihre ursprüngliche Anmeldung wieder.

Wenn Sie bereits betroffen waren und im leeren BTCPay Server ein neues Konto angelegt haben, wird dieses Konto samt allem damit Erstellten beiseitegelegt statt gelöscht, und Ihre ursprünglichen Daten treten an seine Stelle. Wenden Sie sich an den Support, bevor Sie das Beiseitegelegte entfernen, falls Sie es noch benötigen könnten.

**Lightning-Zugangsdaten.** Wenn BTCPay Server mit einem Lightning-Knoten verbunden ist, erzeugt dieses Update eine kritische Aufgabe, die Sie auffordert, die Zugangsdaten dieses Knotens zu ersetzen, und stoppt BTCPay Server, bis Sie sie erledigen. Die oben beschriebenen Server haben diese Aufforderung nie erhalten, obwohl sie sie hätten erhalten müssen; die Versionshinweise zu 2.4.2 erklären, warum das wichtig ist.

**BTCPay Server 2.4.3 ist ein Sicherheitsupdate.** Wenn Sie von einer älteren Version aktualisieren, ist es vor allem dort wichtig, wo andere Personen Konten auf Ihrem BTCPay Server haben:

- **Store-Benutzer** — ein Serveradministrator kann einem Store nicht mehr hinzugefügt werden, und seine Rolle in einem Store nicht mehr geändert werden, von jemandem, der nicht selbst Serveradministrator ist. Die Regel gilt sowohl für die Seite **Benutzer** eines Stores als auch für die API.
- **Crowdfund** — die Beschreibung einer App und die ihrer Prämien werden nicht mehr als rohes HTML gerendert, wodurch ein Cross-Site-Scripting-Vektor geschlossen wird. Die Disqus-Kommentare entfallen damit: Die Einstellung und der öffentliche Reiter **Diskussion** werden entfernt.
- **Plugins** — BTCPay Server lädt veraltete Versionen von acht Plugins nicht mehr und hält jedes davon deaktiviert, bis es aktualisiert wird: Shopify, Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark und Cashu. Wenn Sie eines davon nutzen, aktualisieren Sie es unter **Servereinstellungen → Plugins**; das neuere Shopify-Plugin behebt zudem eine Schwachstelle im Rückerstattungs-Webhook.

Vollständige Release Notes von upstream: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.3`,
    pl_PL: `Przywraca dane BTCPay Server pozostawione przez aktualizację ze StartOS 0.3.x i aktualizuje BTCPay Server do wersji 2.4.3.

Aktualizacja ze StartOS 0.3.x przenosi dane BTCPay Server — sklepy, faktury, portfele i ustawienia — do pamięci używanej przez ten pakiet. Na serwerach z BTCPay Server 2.4.2 lub nowszym pod StartOS 0.3.x to przeniesienie zostało pominięte i BTCPay Server uruchomił się z pustą pamięcią: bez sklepów, bez kont, odrzucając każde hasło i zwracając „No server admins exist" w akcji **Zresetuj hasło administratora serwera**.

**Nic nie zostało usunięte.** Twoje dane pozostały tam, gdzie zostawił je poprzedni pakiet. Ta wersja przenosi je przy pierwszym uruchomieniu po aktualizacji, więc to uruchomienie trwa dłużej niż zwykle — przenoszona jest baza danych — a potem twoje pierwotne logowanie znów działa.

Jeśli już to napotkałeś i utworzyłeś nowe konto w pustym BTCPay Server, to konto i wszystko, co za jego pomocą utworzono, zostaje odłożone na bok, a nie usunięte, a twoje pierwotne dane zajmują jego miejsce. Skontaktuj się ze wsparciem przed usunięciem tego, co odłożono, jeśli może ci to być potrzebne.

**Poświadczenia Lightning.** Jeśli BTCPay Server jest połączony z węzłem Lightning, ta aktualizacja tworzy zadanie krytyczne z prośbą o wymianę poświadczeń tego węzła i zatrzymuje BTCPay Server do czasu jego wykonania. Serwery, których dotyczy powyższy problem, nigdy nie otrzymały tego monitu, choć powinny; informacje o wydaniu 2.4.2 wyjaśniają, dlaczego to ważne.

**BTCPay Server 2.4.3 to wydanie bezpieczeństwa.** Jeśli aktualizujesz ze starszej wersji, ma ono znaczenie przede wszystkim tam, gdzie inne osoby mają konta w twoim BTCPay Server:

- **Użytkownicy sklepu** — administrator serwera nie może już zostać dodany do sklepu ani mieć zmienionej roli w sklepie przez osobę, która sama nie jest administratorem serwera. Zasada obowiązuje zarówno na stronie **Użytkownicy** sklepu, jak i w API.
- **Crowdfund** — opis aplikacji ani opisy jej nagród nie są już renderowane jako surowy HTML, co zamyka wektor ataku cross-site scripting. Znikają wraz z tym komentarze Disqus: usunięto to ustawienie i publiczną kartę **Dyskusja**.
- **Wtyczki** — BTCPay Server odmawia teraz ładowania nieaktualnych wersji ośmiu wtyczek i pozostawia każdą wyłączoną do czasu jej aktualizacji: Shopify, Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark i Cashu. Jeśli korzystasz z którejś z nich, zaktualizuj ją w **Ustawienia serwera → Wtyczki**; nowsza wtyczka Shopify naprawia dodatkowo lukę w webhooku zwrotów.

Pełne informacje o wydaniu upstreamu: https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.3`,
    fr_FR: `Restaure les données de BTCPay Server laissées de côté par une mise à jour depuis StartOS 0.3.x et met à jour BTCPay Server vers la version 2.4.3.

La mise à jour depuis StartOS 0.3.x déplace vos données BTCPay Server — boutiques, factures, portefeuilles et paramètres — vers le stockage utilisé par ce paquet. Sur les serveurs exécutant BTCPay Server 2.4.2 ou plus récent sous StartOS 0.3.x, ce déplacement a été ignoré et BTCPay Server a démarré sur un stockage vide : aucune boutique, aucun compte, tous les mots de passe refusés, et « No server admins exist » en réponse à l'action **Réinitialiser le mot de passe administrateur du serveur**.

**Rien n'a été supprimé.** Vos données sont restées là où le paquet précédent les avait placées. Cette version les déplace au premier démarrage après la mise à jour ; ce démarrage est donc plus long que d'habitude — une base de données est en cours de déplacement — et votre identifiant d'origine fonctionne de nouveau ensuite.

Si vous avez déjà rencontré ce problème et créé un nouveau compte dans le BTCPay Server vide, ce compte et tout ce qui a été créé avec lui est mis de côté plutôt que supprimé, et vos données d'origine reprennent leur place. Contactez l'assistance avant de supprimer ce qui a été mis de côté si vous pourriez en avoir besoin.

**Identifiants Lightning.** Si BTCPay Server est relié à un nœud Lightning, cette mise à jour crée une tâche critique vous demandant de renouveler les identifiants de ce nœud et arrête BTCPay Server jusqu'à ce que vous la traitiez. Les serveurs concernés ci-dessus n'ont jamais reçu cette invite alors qu'ils auraient dû ; les notes de version 2.4.2 expliquent pourquoi cela compte.

**BTCPay Server 2.4.3 est une mise à jour de sécurité.** Si vous effectuez la mise à jour depuis une version antérieure, elle compte surtout là où d'autres personnes ont un compte sur votre BTCPay Server :

- **Utilisateurs de la boutique** — un administrateur du serveur ne peut plus être ajouté à une boutique, ni voir son rôle dans une boutique modifié, par quelqu'un qui n'est pas lui-même administrateur du serveur. La règle s'applique aussi bien à la page **Utilisateurs** d'une boutique qu'à l'API.
- **Crowdfund** — la description d'une application et celles de ses contreparties ne sont plus rendues en HTML brut, ce qui ferme un vecteur de script intersites. Les commentaires Disqus disparaissent avec : le paramètre et l'onglet public **Discussion** sont supprimés.
- **Extensions** — BTCPay Server refuse désormais de charger les versions obsolètes de huit extensions et maintient chacune désactivée jusqu'à sa mise à jour : Shopify, Ecwid, SamRock, Stripe, BigCommerce, Mark Paid at Checkout, Ark et Cashu. Si vous utilisez l'une d'elles, mettez-la à jour dans **Paramètres du serveur → Extensions** ; la nouvelle extension Shopify corrige en outre une vulnérabilité du webhook de remboursement.

Notes de version complètes de l'upstream : https://github.com/btcpayserver/btcpayserver/releases/tag/v2.4.3`,
  },
  migrations: {},
})
