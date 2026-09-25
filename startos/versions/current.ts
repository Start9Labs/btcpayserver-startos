import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.4:2',
  releaseNotes: {
    en_US: `Moving a large BTCPay Server install from StartOS 0.3.5 onto its new storage no longer fails partway through.`,
    es_ES: `Trasladar una instalación grande de BTCPay Server desde StartOS 0.3.5 a su nuevo almacenamiento ya no falla a mitad del proceso.`,
    de_DE: `Das Verschieben einer großen BTCPay-Server-Installation von StartOS 0.3.5 auf ihren neuen Speicher bricht nicht mehr mittendrin ab.`,
    pl_PL: `Przenoszenie dużej instalacji BTCPay Server ze StartOS 0.3.5 do nowego magazynu danych nie kończy się już błędem w trakcie.`,
    fr_FR: `Le transfert d'une installation volumineuse de BTCPay Server depuis StartOS 0.3.5 vers son nouveau stockage n'échoue plus en cours de route.`,
  },
  migrations: {},
})
