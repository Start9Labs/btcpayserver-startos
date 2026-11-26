import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.7:6',
  releaseNotes: {
    en_US:
      "Monero payments now keep working when Monero's daemon RPC credentials are turned on. Update Monero first.",
    es_ES:
      'Los pagos en Monero ahora siguen funcionando cuando se activan las credenciales RPC del daemon de Monero. Actualiza Monero primero.',
    de_DE:
      'Monero-Zahlungen funktionieren jetzt auch, wenn die Daemon-RPC-Zugangsdaten von Monero aktiviert sind. Aktualisiere zuerst Monero.',
    pl_PL:
      'Płatności Monero działają teraz także po włączeniu poświadczeń RPC demona Monero. Najpierw zaktualizuj Monero.',
    fr_FR:
      "Les paiements Monero fonctionnent désormais aussi lorsque les identifiants RPC du démon Monero sont activés. Mets d'abord Monero à jour.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
