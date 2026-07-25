import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:4',
  releaseNotes: {
    en_US: `Uses a dedicated, trusted connection to Bitcoin Core for downloading blocks.

BTCPay Server's block indexer, NBXplorer, pulls blocks from Bitcoin Core over the peer protocol. It was connecting on the same port as anonymous peers from the internet, so Bitcoin Core could drop the connection to make room for another peer, or cut it off under the limits that protect your upload bandwidth. It now uses a separate, local-only port that Bitcoin Core trusts. This requires Bitcoin Core or Bitcoin Knots to be updated first; StartOS will prompt you.`,
    es_ES: `Usa una conexión dedicada y de confianza con Bitcoin Core para descargar bloques.

El indexador de bloques de BTCPay Server, NBXplorer, obtiene bloques de Bitcoin Core mediante el protocolo entre pares. Se conectaba por el mismo puerto que los pares anónimos de internet, así que Bitcoin Core podía cortar la conexión para dejar sitio a otro par, o interrumpirla por los límites que protegen tu ancho de banda de subida. Ahora usa un puerto aparte, solo local, en el que Bitcoin Core confía. Para ello hay que actualizar antes Bitcoin Core o Bitcoin Knots; StartOS te lo pedirá.`,
    de_DE: `Nutzt eine eigene, vertrauenswürdige Verbindung zu Bitcoin Core zum Herunterladen von Blöcken.

NBXplorer, der Block-Indexer von BTCPay Server, bezieht Blöcke über das Peer-Protokoll von Bitcoin Core. Er verband sich über denselben Port wie anonyme Gegenstellen aus dem Internet, sodass Bitcoin Core die Verbindung trennen konnte, um Platz für eine andere Gegenstelle zu schaffen, oder sie durch die Limits zum Schutz deiner Upload-Bandbreite unterbrach. Jetzt wird ein separater, rein lokaler Port genutzt, dem Bitcoin Core vertraut. Dafür muss zuerst Bitcoin Core bzw. Bitcoin Knots aktualisiert werden; StartOS fordert dich dazu auf.`,
    pl_PL: `Korzysta z dedykowanego, zaufanego połączenia z Bitcoin Core do pobierania bloków.

NBXplorer, indekser bloków BTCPay Server, pobiera bloki z Bitcoin Core przez protokół peer-to-peer. Łączył się tym samym portem co anonimowe węzły z internetu, więc Bitcoin Core mógł zerwać połączenie, by zrobić miejsce innemu węzłowi, albo przerwać je z powodu limitów chroniących twoje pasmo wysyłania. Teraz używa osobnego, wyłącznie lokalnego portu, któremu Bitcoin Core ufa. Wymaga to wcześniejszej aktualizacji Bitcoin Core lub Bitcoin Knots; StartOS o tym przypomni.`,
    fr_FR: `Utilise une connexion dédiée et de confiance vers Bitcoin Core pour télécharger les blocs.

NBXplorer, l'indexeur de blocs de BTCPay Server, récupère les blocs auprès de Bitcoin Core via le protocole pair-à-pair. Il se connectait sur le même port que les pairs anonymes d'internet, si bien que Bitcoin Core pouvait couper la connexion pour laisser la place à un autre pair, ou l'interrompre au titre des limites qui protègent votre bande passante montante. Il utilise désormais un port distinct, uniquement local, auquel Bitcoin Core fait confiance. Cela requiert de mettre d'abord à jour Bitcoin Core ou Bitcoin Knots ; StartOS vous y invitera.`,
  },
  migrations: {},
})
