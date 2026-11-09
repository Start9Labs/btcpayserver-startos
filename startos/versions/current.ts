import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.7:3',
  releaseNotes: {
    en_US: `Requires StartOS 0.4.1 or later. BTCPay Server's access to your Bitcoin node's data is now read-only. BTCPay Server now reads only the credential it needs from LND, Core Lightning or Eclair, and can no longer read that node's seed or other files. Requires LND 0.21.6-beta:3, Core Lightning 26.6.10:3 or Eclair 0.14.6:2 or later.`,
    es_ES: `Requiere StartOS 0.4.1 o posterior. El acceso de BTCPay Server a los datos de su nodo de Bitcoin ahora es de solo lectura. BTCPay Server ahora lee solo la credencial que necesita de LND, Core Lightning o Eclair, y ya no puede leer la semilla ni otros archivos de ese nodo. Requiere LND 0.21.6-beta:3, Core Lightning 26.6.10:3 o Eclair 0.14.6:2 o posterior.`,
    de_DE: `Erfordert StartOS 0.4.1 oder neuer. Der Zugriff von BTCPay Server auf die Daten Ihres Bitcoin-Knotens ist jetzt schreibgeschützt. BTCPay Server liest von LND, Core Lightning oder Eclair jetzt nur noch die benötigte Zugangsberechtigung und kann den Seed und andere Dateien dieses Knotens nicht mehr lesen. Erfordert LND 0.21.6-beta:3, Core Lightning 26.6.10:3 oder Eclair 0.14.6:2 oder neuer.`,
    pl_PL: `Wymaga StartOS 0.4.1 lub nowszego. Dostęp BTCPay Server do danych Twojego węzła Bitcoin jest teraz tylko do odczytu. BTCPay Server odczytuje teraz z LND, Core Lightning lub Eclair tylko potrzebne mu poświadczenie i nie może już odczytać seeda ani innych plików tego węzła. Wymaga LND 0.21.6-beta:3, Core Lightning 26.6.10:3 lub Eclair 0.14.6:2 albo nowszych.`,
    fr_FR: `Nécessite StartOS 0.4.1 ou ultérieur. L'accès de BTCPay Server aux données de votre nœud Bitcoin est désormais en lecture seule. BTCPay Server ne lit désormais que l'identifiant dont il a besoin auprès de LND, Core Lightning ou Eclair, et ne peut plus lire la seed ni les autres fichiers de ce nœud. Nécessite LND 0.21.6-beta:3, Core Lightning 26.6.10:3 ou Eclair 0.14.6:2 ou ultérieur.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
