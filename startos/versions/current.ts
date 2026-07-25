import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:3',
  releaseNotes: {
    en_US: `Keeps connections to Bitcoin Core, LND and Monero working when those services change how they serve TLS.

BTCPay Server resolved each service's address from a field that is only populated for one of the two ways a service can publish a port. It now reads the address itself, which is correct either way — so these connections survive a dependency's next update instead of going unreachable. This also covers the callback Monero uses to notify BTCPay Server of new blocks.`,
    es_ES: `Mantiene las conexiones con Bitcoin Core, LND y Monero cuando esos servicios cambian su forma de servir TLS.

BTCPay Server resolvía la dirección de cada servicio a partir de un campo que solo se rellena en una de las dos formas en que un servicio puede publicar un puerto. Ahora lee la dirección en sí, que es correcta en ambos casos, así que estas conexiones sobreviven a la próxima actualización de una dependencia en lugar de quedar inaccesibles. Esto cubre también la llamada que Monero usa para notificar a BTCPay Server los bloques nuevos.`,
    de_DE: `Hält die Verbindungen zu Bitcoin Core, LND und Monero aufrecht, wenn diese Dienste die Art der TLS-Bereitstellung ändern.

BTCPay Server ermittelte die Adresse jedes Dienstes aus einem Feld, das nur bei einer der beiden Arten gefüllt ist, auf die ein Dienst einen Port veröffentlichen kann. Jetzt wird die Adresse selbst gelesen, die in beiden Fällen stimmt — diese Verbindungen überstehen damit das nächste Update einer Abhängigkeit, statt unerreichbar zu werden. Das gilt auch für den Rückruf, mit dem Monero BTCPay Server über neue Blöcke informiert.`,
    pl_PL: `Utrzymuje połączenia z Bitcoin Core, LND i Monero, gdy te usługi zmieniają sposób udostępniania TLS.

BTCPay Server ustalał adres każdej usługi na podstawie pola wypełnianego tylko przy jednym z dwóch sposobów publikowania portu przez usługę. Teraz odczytuje sam adres, poprawny w obu przypadkach — dzięki temu połączenia przetrwają kolejną aktualizację zależności, zamiast stać się nieosiągalne. Dotyczy to również wywołania zwrotnego, którym Monero powiadamia BTCPay Server o nowych blokach.`,
    fr_FR: `Maintient les connexions à Bitcoin Core, LND et Monero lorsque ces services changent leur façon de servir TLS.

BTCPay Server déterminait l'adresse de chaque service à partir d'un champ renseigné dans un seul des deux modes de publication d'un port par un service. Il lit désormais l'adresse elle-même, correcte dans les deux cas — ces connexions survivent donc à la prochaine mise à jour d'une dépendance au lieu de devenir injoignables. Cela couvre également le rappel par lequel Monero informe BTCPay Server des nouveaux blocs.`,
  },
  migrations: {},
})
