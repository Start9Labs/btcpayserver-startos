import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.5:2',
  releaseNotes: {
    en_US: `BTCPay Server keeps tracking new blocks after Bitcoin catches up from an outage.

Performance improvement`,
    es_ES: `BTCPay Server sigue registrando los nuevos bloques después de que Bitcoin se ponga al día tras un corte.

Mejora de rendimiento`,
    de_DE: `BTCPay Server verfolgt neue Blöcke weiter, nachdem Bitcoin nach einem Ausfall aufgeholt hat.

Leistungsverbesserung`,
    pl_PL: `BTCPay Server nadal śledzi nowe bloki po tym, jak Bitcoin nadrobi zaległości po awarii.

Poprawa wydajności`,
    fr_FR: `BTCPay Server continue de suivre les nouveaux blocs une fois que Bitcoin a rattrapé son retard après une coupure.

Amélioration des performances`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
