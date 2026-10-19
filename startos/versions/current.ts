import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.5:3',
  releaseNotes: {
    en_US: 'BTCPay Server now starts on servers set to a language other than English.',
    es_ES: 'BTCPay Server ahora se inicia en servidores configurados en un idioma distinto del inglés.',
    de_DE: 'BTCPay Server startet jetzt auch auf Servern, die auf eine andere Sprache als Englisch eingestellt sind.',
    pl_PL: 'BTCPay Server uruchamia się teraz na serwerach ustawionych na język inny niż angielski.',
    fr_FR: "BTCPay Server démarre désormais sur les serveurs configurés dans une autre langue que l'anglais.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
