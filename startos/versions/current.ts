import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.5:4',
  releaseNotes: {
    en_US: 'Includes the October 2026 Node.js security fixes.',
    es_ES:
      'Incluye las correcciones de seguridad de Node.js de octubre de 2026.',
    de_DE: 'Enthält die Node.js-Sicherheitskorrekturen vom Oktober 2026.',
    pl_PL: 'Zawiera poprawki bezpieczeństwa Node.js z października 2026.',
    fr_FR: "Inclut les correctifs de sécurité Node.js d'octobre 2026.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
