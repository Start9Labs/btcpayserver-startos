import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:1',
  releaseNotes: {
    en_US: `Keeps the the services it connects to connection working when the services it connects to changes how it serves TLS.

BTCPay Server resolved the services it connects to's address from a field that is only populated for one of the two ways a service can publish a port. It now reads the address itself, which is correct either way — so the connection survives the services it connects to's next update instead of going unreachable.`,
    es_ES: `Mantiene la conexión con the services it connects to cuando the services it connects to cambia su forma de servir TLS.

BTCPay Server resolvía la dirección de the services it connects to a partir de un campo que solo se rellena en una de las dos formas en que un servicio puede publicar un puerto. Ahora lee la dirección en sí, que es correcta en ambos casos, así que la conexión sobrevive a la próxima actualización de the services it connects to en lugar de quedar inaccesible.`,
    de_DE: `Hält die the services it connects to-Verbindung aufrecht, wenn the services it connects to die Art der TLS-Bereitstellung ändert.

BTCPay Server ermittelte die Adresse von the services it connects to aus einem Feld, das nur bei einer der beiden Arten gefüllt ist, auf die ein Dienst einen Port veröffentlichen kann. Jetzt wird die Adresse selbst gelesen, die in beiden Fällen stimmt — die Verbindung übersteht damit das nächste the services it connects to-Update, statt unerreichbar zu werden.`,
    pl_PL: `Utrzymuje połączenie z the services it connects to, gdy the services it connects to zmienia sposób udostępniania TLS.

BTCPay Server ustalał adres the services it connects to na podstawie pola wypełnianego tylko przy jednym z dwóch sposobów publikowania portu przez usługę. Teraz odczytuje sam adres, poprawny w obu przypadkach — dzięki temu połączenie przetrwa kolejną aktualizację the services it connects to, zamiast stać się nieosiągalne.`,
    fr_FR: `Maintient la connexion à the services it connects to lorsque the services it connects to change sa façon de servir TLS.

BTCPay Server déterminait l'adresse de the services it connects to à partir d'un champ renseigné dans un seul des deux modes de publication d'un port par un service. Il lit désormais l'adresse elle-même, correcte dans les deux cas — la connexion survit donc à la prochaine mise à jour de the services it connects to au lieu de devenir injoignable.`,
  },
  migrations: {},
})
