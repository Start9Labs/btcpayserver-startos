import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:4',
  releaseNotes: {
    en_US: `Uses a dedicated, trusted connection to Bitcoin for downloading blocks.

BTCPay Server's block indexer, NBXplorer, pulls blocks from Bitcoin over the peer protocol. It was connecting on the same port as anonymous peers from the internet, so Bitcoin could drop the connection to make room for another peer, or cut it off under the limits that protect your upload bandwidth. It now uses a separate, local-only port that Bitcoin trusts. This requires Bitcoin to be updated first; StartOS will prompt you.`,
    es_ES: `Usa una conexión dedicada y de confianza con Bitcoin para descargar bloques.

El indexador de bloques de BTCPay Server, NBXplorer, obtiene bloques de Bitcoin mediante el protocolo entre pares. Se conectaba por el mismo puerto que los pares anónimos de internet, así que Bitcoin podía cortar la conexión para dejar sitio a otro par, o interrumpirla por los límites que protegen tu ancho de banda de subida. Ahora usa un puerto aparte, solo local, en el que Bitcoin confía. Para ello hay que actualizar antes Bitcoin; StartOS te lo pedirá.`,
    de_DE: `Nutzt eine eigene, vertrauenswürdige Verbindung zu Bitcoin zum Herunterladen von Blöcken.

NBXplorer, der Block-Indexer von BTCPay Server, bezieht Blöcke über das Peer-Protokoll von Bitcoin. Er verband sich über denselben Port wie anonyme Gegenstellen aus dem Internet, sodass Bitcoin die Verbindung trennen konnte, um Platz für eine andere Gegenstelle zu schaffen, oder sie durch die Limits zum Schutz deiner Upload-Bandbreite unterbrach. Jetzt wird ein separater, rein lokaler Port genutzt, dem Bitcoin vertraut. Dafür muss zuerst Bitcoin aktualisiert werden; StartOS fordert dich dazu auf.`,
    pl_PL: `Korzysta z dedykowanego, zaufanego połączenia z Bitcoin do pobierania bloków.

NBXplorer, indekser bloków BTCPay Server, pobiera bloki z Bitcoin przez protokół peer-to-peer. Łączył się tym samym portem co anonimowe węzły z internetu, więc Bitcoin mógł zerwać połączenie, by zrobić miejsce innemu węzłowi, albo przerwać je z powodu limitów chroniących twoje pasmo wysyłania. Teraz używa osobnego, wyłącznie lokalnego portu, któremu Bitcoin ufa. Wymaga to wcześniejszej aktualizacji Bitcoina; StartOS o tym przypomni.`,
    fr_FR: `Utilise une connexion dédiée et de confiance vers Bitcoin pour télécharger les blocs.

NBXplorer, l'indexeur de blocs de BTCPay Server, récupère les blocs auprès de Bitcoin via le protocole pair-à-pair. Il se connectait sur le même port que les pairs anonymes d'internet, si bien que Bitcoin pouvait couper la connexion pour laisser la place à un autre pair, ou l'interrompre au titre des limites qui protègent votre bande passante montante. Il utilise désormais un port distinct, uniquement local, auquel Bitcoin fait confiance. Cela requiert de mettre d'abord à jour Bitcoin ; StartOS vous y invitera.`,
  },
  migrations: {},
})
