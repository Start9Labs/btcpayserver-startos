import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.4:1',
  releaseNotes: {
    en_US: `Installs carried over from StartOS 0.3.5 with the Monero altcoin enabled can now update.`,
    es_ES: `Las instalaciones migradas desde StartOS 0.3.5 con la altcoin Monero activada ya pueden actualizarse.`,
    de_DE: `Installationen, die mit aktivierter Monero-Altcoin von StartOS 0.3.5 übernommen wurden, können jetzt aktualisiert werden.`,
    pl_PL: `Instalacje przeniesione ze StartOS 0.3.5 z włączonym altcoinem Monero mogą teraz zostać zaktualizowane.`,
    fr_FR: `Les installations reprises de StartOS 0.3.5 avec l'altcoin Monero activée peuvent désormais être mises à jour.`,
  },
  migrations: {},
})
