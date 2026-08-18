import { VersionInfo } from '@start9labs/start-sdk'
import { raiseLightningCredentialTask } from '../lightningCredentialTask'

export const v_2_4_2_1 = VersionInfo.of({
  version: '2.4.2:1',
  releaseNotes: {
    en_US: `Prompts you to replace your Lightning node's credentials after the 2.4.2 security update.

The vulnerability patched in 2.4.2 was being actively exploited, so on any server that ran an earlier build, treat everything BTCPay Server could reach as exposed. **Updating does not by itself undo access an attacker already took.**

If BTCPay Server is wired to a Lightning node, updating raises a critical task and stops BTCPay Server until you clear it:

- **LND** — run LND's "Revoke Macaroons" action. BTCPay Server reads LND's admin macaroon, which grants full control of the node. This needs LND \`0.21.1-beta:11\` or later, now required as a dependency: earlier releases called the action "Recreate Macaroons" and only deleted the macaroon files, leaving the root key that signs them in place, so nothing was actually revoked.
- **Core Lightning** — run Core Lightning's "Revoke All Runes" action. BTCPay Server reaches CLN over its admin RPC socket, so a compromised server could have issued itself a rune that outlives the patch.

Two things this update cannot do for you:

- **If you have ever connected BTCPay Server to a Lightning node** — even if you have since switched away — rotate that node's credentials anyway. The task is only raised for the node BTCPay Server is wired to right now.
- **If you generated a hot on-chain wallet inside BTCPay Server, move those funds** to a wallet whose keys BTCPay Server has never held. A hot wallet's keys cannot be rotated.`,
    es_ES: `Te pide sustituir las credenciales de tu nodo Lightning tras la actualización de seguridad 2.4.2.

La vulnerabilidad corregida en 2.4.2 se estaba explotando activamente, así que en cualquier servidor que ejecutara una versión anterior debes considerar expuesto todo lo que BTCPay Server podía alcanzar. **Actualizar por sí solo no revierte el acceso que un atacante ya haya obtenido.**

Si BTCPay Server está conectado a un nodo Lightning, la actualización genera una tarea crítica y detiene BTCPay Server hasta que la resuelvas:

- **LND** — ejecuta la acción «Revocar macaroons» de LND. BTCPay Server lee el macaroon de administrador de LND, que otorga control total del nodo. Requiere LND \`0.21.1-beta:11\` o posterior, ahora exigido como dependencia: en versiones anteriores la acción se llamaba «Recrear Macaroons» y solo borraba los archivos de macaroons, dejando intacta la clave raíz que los firma, así que no revocaba nada.
- **Core Lightning** — ejecuta la acción «Revocar todas las runas» de Core Lightning. BTCPay Server se comunica con CLN por su socket RPC de administración, así que un servidor comprometido pudo emitirse una runa que sobrevive al parche.

Dos cosas que esta actualización no puede hacer por ti:

- **Si alguna vez conectaste BTCPay Server a un nodo Lightning** —aunque ya hayas cambiado a otra opción—, rota igualmente las credenciales de ese nodo. La tarea solo se genera para el nodo al que BTCPay Server está conectado ahora mismo.
- **Si generaste un monedero caliente on-chain dentro de BTCPay Server, mueve esos fondos** a un monedero cuyas claves BTCPay Server nunca haya tenido. Las claves de un monedero caliente no se pueden rotar.`,
    de_DE: `Fordert Sie nach dem Sicherheitsupdate 2.4.2 auf, die Zugangsdaten Ihres Lightning-Knotens zu ersetzen.

Die in 2.4.2 behobene Sicherheitslücke wurde aktiv ausgenutzt. Auf jedem Server, der eine ältere Version ausgeführt hat, sollten Sie daher alles als offengelegt betrachten, was BTCPay Server erreichen konnte. **Das Update allein macht einen bereits erfolgten Zugriff nicht rückgängig.**

Wenn BTCPay Server mit einem Lightning-Knoten verbunden ist, erzeugt das Update eine kritische Aufgabe und stoppt BTCPay Server, bis Sie sie erledigen:

- **LND** — führen Sie die LND-Aktion „Macaroons widerrufen“ aus. BTCPay Server liest das Admin-Macaroon von LND, das vollständige Kontrolle über den Knoten gewährt. Dafür wird LND \`0.21.1-beta:11\` oder neuer benötigt, jetzt als Abhängigkeit vorausgesetzt: davor hieß die Aktion „Macaroons neu erstellen“ und löschte nur die Macaroon-Dateien, ließ aber den signierenden Root-Schlüssel bestehen und widerrief damit nichts.
- **Core Lightning** — führen Sie die Core-Lightning-Aktion „Alle Runes widerrufen“ aus. BTCPay Server erreicht CLN über dessen Admin-RPC-Socket, sodass ein kompromittierter Server sich selbst eine Rune ausgestellt haben könnte, die den Patch überdauert.

Zwei Dinge, die dieses Update nicht für Sie erledigen kann:

- **Wenn Sie BTCPay Server jemals mit einem Lightning-Knoten verbunden haben** – auch wenn Sie inzwischen gewechselt sind –, wechseln Sie die Zugangsdaten dieses Knotens trotzdem. Die Aufgabe wird nur für den Knoten erzeugt, mit dem BTCPay Server aktuell verbunden ist.
- **Wenn Sie in BTCPay Server eine On-Chain-Hot-Wallet erzeugt haben, verschieben Sie diese Mittel** in eine Wallet, deren Schlüssel BTCPay Server nie besessen hat. Die Schlüssel einer Hot Wallet lassen sich nicht wechseln.`,
    pl_PL: `Przypomina o wymianie poświadczeń węzła Lightning po aktualizacji bezpieczeństwa 2.4.2.

Luka naprawiona w wersji 2.4.2 była aktywnie wykorzystywana, więc na każdym serwerze, na którym działała wcześniejsza wersja, uznaj za ujawnione wszystko, do czego BTCPay Server miał dostęp. **Sama aktualizacja nie cofa dostępu, który atakujący już uzyskał.**

Jeśli BTCPay Server jest połączony z węzłem Lightning, aktualizacja tworzy zadanie krytyczne i zatrzymuje BTCPay Server do czasu jego wykonania:

- **LND** — uruchom akcję „Unieważnij macaroons” w LND. BTCPay Server odczytuje macaroon administratora LND, który daje pełną kontrolę nad węzłem. Wymaga to LND \`0.21.1-beta:11\` lub nowszego, teraz wymaganego jako zależność: wcześniej akcja nazywała się „Odtwórz Macaroons” i usuwała tylko pliki macaroonów, pozostawiając podpisujący je klucz główny, więc niczego nie unieważniała.
- **Core Lightning** — uruchom akcję „Unieważnij wszystkie runy” w Core Lightning. BTCPay Server łączy się z CLN przez jego administracyjne gniazdo RPC, więc przejęty serwer mógł wydać sobie runę, która przetrwa załatanie luki.

Dwie rzeczy, których ta aktualizacja nie zrobi za ciebie:

- **Jeśli kiedykolwiek łączyłeś BTCPay Server z węzłem Lightning** — nawet jeśli od tego czasu zmieniłeś konfigurację — i tak wymień poświadczenia tego węzła. Zadanie tworzone jest tylko dla węzła, z którym BTCPay Server jest połączony obecnie.
- **Jeśli utworzyłeś w BTCPay Server gorący portfel on-chain, przenieś te środki** do portfela, którego kluczy BTCPay Server nigdy nie posiadał. Kluczy gorącego portfela nie da się wymienić.`,
    fr_FR: `Vous invite à remplacer les identifiants de votre nœud Lightning après la mise à jour de sécurité 2.4.2.

La vulnérabilité corrigée dans la version 2.4.2 était activement exploitée : sur tout serveur ayant exécuté une version antérieure, considérez comme exposé tout ce que BTCPay Server pouvait atteindre. **La mise à jour seule n'annule pas un accès déjà obtenu par un attaquant.**

Si BTCPay Server est relié à un nœud Lightning, la mise à jour crée une tâche critique et arrête BTCPay Server jusqu'à ce que vous la traitiez :

- **LND** — lancez l'action « Révoquer les macaroons » de LND. BTCPay Server lit le macaroon administrateur de LND, qui donne un contrôle total du nœud. Cela nécessite LND \`0.21.1-beta:11\` ou plus récent, désormais exigé comme dépendance : auparavant l'action s'appelait « Recréer les Macaroons » et supprimait seulement les fichiers de macaroons, laissant en place la clé racine qui les signe, sans donc rien révoquer.
- **Core Lightning** — lancez l'action « Révoquer toutes les runes » de Core Lightning. BTCPay Server atteint CLN via son socket RPC d'administration : un serveur compromis a donc pu s'émettre une rune qui survit au correctif.

Deux choses que cette mise à jour ne peut pas faire à votre place :

- **Si vous avez déjà relié BTCPay Server à un nœud Lightning** — même si vous en avez changé depuis —, renouvelez tout de même les identifiants de ce nœud. La tâche n'est créée que pour le nœud auquel BTCPay Server est relié actuellement.
- **Si vous avez généré un portefeuille chaud on-chain dans BTCPay Server, déplacez ces fonds** vers un portefeuille dont BTCPay Server n'a jamais détenu les clés. Les clés d'un portefeuille chaud ne peuvent pas être renouvelées.`,
  },
  migrations: {
    // Also raised by the legacy layout repair, which reaches the 0.3.x installs
    // this vertex does not.
    up: async ({ effects }) => raiseLightningCredentialTask(effects),
  },
})
