import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3:2',
  releaseNotes: {
    en_US: `Restores BTCPay Server data left behind by an update from StartOS 0.3.x.

Updating from StartOS 0.3.x moves your BTCPay Server data — stores, invoices, wallets and settings — onto the storage this package uses. On servers running BTCPay Server 2.4.0.3 or later under StartOS 0.3.x, that move was skipped, and BTCPay Server started against empty storage: no stores, no accounts, every password rejected, and "No server admins exist" from the **Reset Server Admin Password** action.

**Nothing was deleted.** Your data stayed where the previous package kept it. This release moves it across on the first start after updating, so that start takes longer than usual — it is moving a database — and your original login works again once it finishes.

If you already hit this and created a new account in the empty BTCPay Server, that account and anything created with it is moved aside rather than deleted, and your original data takes its place. Contact support before removing what was set aside if you might need it.

**Shopify plugin** — if you use the Shopify integration and have not already done so since 2.4.3, update the Shopify plugin under **Server Settings → Plugins**. The newer plugin fixes a refund webhook vulnerability.`,
    es_ES: `Restaura los datos de BTCPay Server que quedaron atrás en una actualización desde StartOS 0.3.x.

Al actualizar desde StartOS 0.3.x, tus datos de BTCPay Server —tiendas, facturas, monederos y ajustes— se trasladan al almacenamiento que usa este paquete. En servidores con BTCPay Server 2.4.0.3 o posterior bajo StartOS 0.3.x, ese traslado se omitió y BTCPay Server arrancó con el almacenamiento vacío: sin tiendas, sin cuentas, rechazando todas las contraseñas y respondiendo «No server admins exist» en la acción **Restablecer la contraseña del administrador del servidor**.

**No se ha borrado nada.** Tus datos siguen donde los dejó el paquete anterior. Esta versión los traslada en el primer arranque tras la actualización, así que ese arranque tarda más de lo habitual —está moviendo una base de datos— y después tu inicio de sesión original vuelve a funcionar.

Si ya te encontraste con esto y creaste una cuenta nueva en el BTCPay Server vacío, esa cuenta y todo lo creado con ella se aparta en lugar de borrarse, y tus datos originales ocupan su lugar. Contacta con soporte antes de eliminar lo que se apartó si crees que puedes necesitarlo.

**Complemento de Shopify** — si usas la integración con Shopify y no lo has hecho ya desde la 2.4.3, actualiza el complemento de Shopify en **Configuración del servidor → Complementos**. El complemento más reciente corrige una vulnerabilidad en el webhook de reembolsos.`,
    de_DE: `Stellt BTCPay-Server-Daten wieder her, die bei einem Update von StartOS 0.3.x zurückgeblieben sind.

Beim Update von StartOS 0.3.x werden Ihre BTCPay-Server-Daten – Shops, Rechnungen, Wallets und Einstellungen – auf den Speicher dieses Pakets verschoben. Auf Servern mit BTCPay Server 2.4.0.3 oder neuer unter StartOS 0.3.x wurde dieser Schritt übersprungen, und BTCPay Server startete mit leerem Speicher: keine Shops, keine Konten, jedes Passwort abgelehnt und „No server admins exist" als Antwort der Aktion **Server-Admin-Passwort zurücksetzen**.

**Es wurde nichts gelöscht.** Ihre Daten liegen weiterhin dort, wo das vorherige Paket sie abgelegt hat. Diese Version verschiebt sie beim ersten Start nach dem Update. Dieser Start dauert daher länger als gewohnt – es wird eine Datenbank verschoben – und danach funktioniert Ihre ursprüngliche Anmeldung wieder.

Wenn Sie bereits betroffen waren und im leeren BTCPay Server ein neues Konto angelegt haben, wird dieses Konto samt allem damit Erstellten beiseitegelegt statt gelöscht, und Ihre ursprünglichen Daten treten an seine Stelle. Wenden Sie sich an den Support, bevor Sie das Beiseitegelegte entfernen, falls Sie es noch benötigen könnten.

**Shopify-Plugin** — wenn Sie die Shopify-Integration nutzen und dies seit 2.4.3 noch nicht getan haben, aktualisieren Sie das Shopify-Plugin unter **Servereinstellungen → Plugins**. Das neuere Plugin behebt eine Schwachstelle im Rückerstattungs-Webhook.`,
    pl_PL: `Przywraca dane BTCPay Server pozostawione przez aktualizację ze StartOS 0.3.x.

Aktualizacja ze StartOS 0.3.x przenosi dane BTCPay Server — sklepy, faktury, portfele i ustawienia — do pamięci używanej przez ten pakiet. Na serwerach z BTCPay Server 2.4.0.3 lub nowszym pod StartOS 0.3.x to przeniesienie zostało pominięte i BTCPay Server uruchomił się z pustą pamięcią: bez sklepów, bez kont, odrzucając każde hasło i zwracając „No server admins exist" w akcji **Zresetuj hasło administratora serwera**.

**Nic nie zostało usunięte.** Twoje dane pozostały tam, gdzie zostawił je poprzedni pakiet. Ta wersja przenosi je przy pierwszym uruchomieniu po aktualizacji, więc to uruchomienie trwa dłużej niż zwykle — przenoszona jest baza danych — a potem twoje pierwotne logowanie znów działa.

Jeśli już to napotkałeś i utworzyłeś nowe konto w pustym BTCPay Server, to konto i wszystko, co za jego pomocą utworzono, zostaje odłożone na bok, a nie usunięte, a twoje pierwotne dane zajmują jego miejsce. Skontaktuj się ze wsparciem przed usunięciem tego, co odłożono, jeśli może ci to być potrzebne.

**Wtyczka Shopify** — jeśli korzystasz z integracji z Shopify i nie zrobiłeś tego od wersji 2.4.3, zaktualizuj wtyczkę Shopify w **Ustawienia serwera → Wtyczki**. Nowsza wtyczka naprawia lukę w webhooku zwrotów.`,
    fr_FR: `Restaure les données de BTCPay Server laissées de côté par une mise à jour depuis StartOS 0.3.x.

La mise à jour depuis StartOS 0.3.x déplace vos données BTCPay Server — boutiques, factures, portefeuilles et paramètres — vers le stockage utilisé par ce paquet. Sur les serveurs exécutant BTCPay Server 2.4.0.3 ou plus récent sous StartOS 0.3.x, ce déplacement a été ignoré et BTCPay Server a démarré sur un stockage vide : aucune boutique, aucun compte, tous les mots de passe refusés, et « No server admins exist » en réponse à l'action **Réinitialiser le mot de passe administrateur du serveur**.

**Rien n'a été supprimé.** Vos données sont restées là où le paquet précédent les avait placées. Cette version les déplace au premier démarrage après la mise à jour ; ce démarrage est donc plus long que d'habitude — une base de données est en cours de déplacement — et votre identifiant d'origine fonctionne de nouveau ensuite.

Si vous avez déjà rencontré ce problème et créé un nouveau compte dans le BTCPay Server vide, ce compte et tout ce qui a été créé avec lui est mis de côté plutôt que supprimé, et vos données d'origine reprennent leur place. Contactez l'assistance avant de supprimer ce qui a été mis de côté si vous pourriez en avoir besoin.

**Extension Shopify** — si vous utilisez l'intégration Shopify et ne l'avez pas déjà fait depuis la 2.4.3, mettez à jour l'extension Shopify dans **Paramètres du serveur → Extensions**. La nouvelle extension corrige une vulnérabilité du webhook de remboursement.`,
  },
  migrations: {},
})
