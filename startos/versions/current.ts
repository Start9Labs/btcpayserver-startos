import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { mainHostId } from '../utils'

export const current = VersionInfo.of({
  version: '2.4.4:3',
  releaseNotes: {
    en_US: `- Reset Server Admin Password's confirmation says that the current password stops working.
- The descriptions in Choose Lightning Node, Enable Altcoins, Enable Plugins and Resync NBXplorer explain each choice.
- Spanish, German, Polish and French text shows its accented letters.
- UTXO Tracker Sync's progress messages are translated.
- The task raised on LND names its Revoke Macaroons action.
- A network port left reserved by the StartOS 0.3.5 version of this package is freed.
- Bitcoin must be at least 28.4:29, 29.4:16, 30.3:16 or 31.1:16, depending on its major version. Bitcoin Knots (pre-RDTS) 29.3:29 or later also works.`,
    es_ES: `- La confirmación de Restablecer contraseña de administrador del servidor indica que la contraseña actual deja de funcionar.
- Las descripciones de Elegir nodo Lightning, Habilitar altcoins, Habilitar plugins y Resincronizar NBXplorer explican cada opción.
- Los textos en español, alemán, polaco y francés muestran sus letras acentuadas.
- Los mensajes de progreso de Sincronización del rastreador UTXO están traducidos.
- La tarea creada en LND nombra su acción Revocar macaroons.
- Se libera un puerto de red que la versión de este paquete para StartOS 0.3.5 dejó reservado.
- Bitcoin debe ser al menos la versión 28.4:29, 29.4:16, 30.3:16 o 31.1:16, según su versión principal. También funciona Bitcoin Knots (pre-RDTS) 29.3:29 o posterior.`,
    de_DE: `- Die Bestätigung von „Server-Admin-Passwort zurücksetzen“ weist darauf hin, dass das aktuelle Passwort danach nicht mehr funktioniert.
- Die Beschreibungen in „Lightning-Knoten wählen“, „Altcoins aktivieren“, „Plugins aktivieren“ und „NBXplorer neu synchronisieren“ erklären jede Wahl.
- Spanische, deutsche, polnische und französische Texte zeigen ihre Umlaute und Akzente.
- Die Fortschrittsmeldungen von „UTXO-Tracker-Synchronisation“ sind übersetzt.
- Die in LND erzeugte Aufgabe nennt dessen Aktion „Macaroons widerrufen“.
- Ein Netzwerkport, den die StartOS-0.3.5-Version dieses Pakets belegt gelassen hatte, wird freigegeben.
- Bitcoin muss je nach Hauptversion mindestens 28.4:29, 29.4:16, 30.3:16 oder 31.1:16 sein. Bitcoin Knots (pre-RDTS) ab 29.3:29 funktioniert ebenfalls.`,
    pl_PL: `- Potwierdzenie akcji „Zresetuj hasło administratora serwera” informuje, że obecne hasło przestaje działać.
- Opisy w akcjach „Wybierz węzeł Lightning”, „Włącz altcoiny”, „Włącz wtyczki” i „Ponowna synchronizacja NBXplorer” wyjaśniają każdy wybór.
- Teksty po hiszpańsku, niemiecku, polsku i francusku wyświetlają litery ze znakami diakrytycznymi.
- Komunikaty postępu „Synchronizacja śledzenia UTXO” są przetłumaczone.
- Zadanie tworzone w LND wskazuje jego akcję „Unieważnij macaroons”.
- Zwolniono port sieciowy, który wersja tego pakietu dla StartOS 0.3.5 pozostawiła zajęty.
- Bitcoin musi być co najmniej w wersji 28.4:29, 29.4:16, 30.3:16 lub 31.1:16, zależnie od wersji głównej. Działa też Bitcoin Knots (pre-RDTS) 29.3:29 lub nowszy.`,
    fr_FR: `- La confirmation de « Réinitialiser le mot de passe de l'administrateur du serveur » indique que le mot de passe actuel cesse de fonctionner.
- Les descriptions de « Choisir le nœud Lightning », « Activer les altcoins », « Activer les plugins » et « Resynchroniser NBXplorer » expliquent chaque choix.
- Les textes en espagnol, allemand, polonais et français affichent leurs lettres accentuées.
- Les messages de progression de « Synchronisation du suivi UTXO » sont traduits.
- La tâche créée dans LND nomme son action « Révoquer les macaroons ».
- Un port réseau laissé réservé par la version de ce paquet pour StartOS 0.3.5 est libéré.
- Bitcoin doit être au moins en version 28.4:29, 29.4:16, 30.3:16 ou 31.1:16, selon sa version majeure. Bitcoin Knots (pre-RDTS) 29.3:29 ou plus récent fonctionne aussi.`,
  },
  migrations: {
    // The 0.3.x package's LAN binding on 80; the Web UI is on 23000.
    up: async ({ effects }) => {
      await sdk.MultiHost.of(effects, mainHostId).retirePort(80)
    },
    down: IMPOSSIBLE,
  },
})
