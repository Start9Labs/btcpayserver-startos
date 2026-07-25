import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:5',
  releaseNotes: {
    en_US: `Fixes a failed update from StartOS 0.3.x.

Migrating a BTCPay Server install from StartOS 0.3.x copied a plugins folder that only exists if you had installed a plugin. On a server that never did, the copy failed and took the whole update down with it, with no way past it on retry. The migration now skips what isn't there. It also no longer reports success when a file copy fails partway, which could previously finish an update with data left behind.`,
    es_ES: `Corrige una actualización fallida desde StartOS 0.3.x.

Al migrar una instalación de BTCPay Server desde StartOS 0.3.x se copiaba una carpeta de plugins que solo existe si habías instalado alguno. En un servidor que nunca lo hizo, la copia fallaba y se llevaba consigo toda la actualización, sin forma de superarlo al reintentar. La migración ahora omite lo que no existe. Tampoco informa ya de éxito cuando una copia de archivos falla a medias, lo que antes podía terminar una actualización dejando datos atrás.`,
    de_DE: `Behebt ein fehlgeschlagenes Update von StartOS 0.3.x.

Bei der Migration einer BTCPay-Server-Installation von StartOS 0.3.x wurde ein Plugin-Ordner kopiert, den es nur gibt, wenn du ein Plugin installiert hattest. Auf einem Server ohne Plugin schlug das Kopieren fehl und riss das ganze Update mit sich, ohne dass ein erneuter Versuch daran vorbeikam. Die Migration überspringt jetzt, was nicht vorhanden ist. Zudem meldet sie keinen Erfolg mehr, wenn ein Dateikopiervorgang mittendrin fehlschlägt — zuvor konnte ein Update so abschließen und Daten zurücklassen.`,
    pl_PL: `Naprawia nieudaną aktualizację ze StartOS 0.3.x.

Migracja instalacji BTCPay Server ze StartOS 0.3.x kopiowała folder wtyczek, który istnieje tylko wtedy, gdy jakąś wtyczkę zainstalowano. Na serwerze bez wtyczek kopiowanie kończyło się błędem i przerywało całą aktualizację, a ponowna próba nic nie dawała. Migracja pomija teraz to, czego nie ma. Nie zgłasza też już powodzenia, gdy kopiowanie plików zawiedzie w połowie — wcześniej aktualizacja mogła się zakończyć, zostawiając dane.`,
    fr_FR: `Corrige une mise à jour échouée depuis StartOS 0.3.x.

La migration d'une installation BTCPay Server depuis StartOS 0.3.x copiait un dossier de plugins qui n'existe que si vous en aviez installé un. Sur un serveur qui n'en a jamais eu, la copie échouait et emportait toute la mise à jour, sans moyen de passer outre en réessayant. La migration ignore désormais ce qui est absent. Elle ne signale plus non plus un succès lorsqu'une copie de fichiers échoue en cours de route, ce qui pouvait auparavant terminer une mise à jour en laissant des données de côté.`,
  },
  migrations: {},
})
