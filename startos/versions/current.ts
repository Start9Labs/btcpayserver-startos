import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.5:2',
  releaseNotes: {
    en_US:
      'BTCPay Server keeps tracking new blocks after Bitcoin catches up from an outage.',
    es_ES:
      'BTCPay Server sigue registrando los nuevos bloques después de que Bitcoin se ponga al día tras un corte.',
    de_DE:
      'BTCPay Server verfolgt neue Blöcke weiter, nachdem Bitcoin nach einem Ausfall aufgeholt hat.',
    pl_PL:
      'BTCPay Server nadal śledzi nowe bloki po tym, jak Bitcoin nadrobi zaległości po awarii.',
    fr_FR:
      'BTCPay Server continue de suivre les nouveaux blocs une fois que Bitcoin a rattrapé son retard après une coupure.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
