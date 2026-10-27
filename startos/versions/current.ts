import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.6:1',
  releaseNotes: {
    en_US:
      'BTCPay Server can receive Monero payments when Monero is enabled, with the Monero plugin installed from its Plugin Directory.',
    es_ES:
      'BTCPay Server puede recibir pagos en Monero cuando Monero está habilitado, con el plugin de Monero instalado desde su directorio de plugins.',
    de_DE:
      'BTCPay Server kann Monero-Zahlungen empfangen, wenn Monero aktiviert und das Monero-Plugin aus seinem Plugin-Verzeichnis installiert ist.',
    pl_PL:
      'BTCPay Server może odbierać płatności w Monero, gdy Monero jest włączone, a wtyczka Monero jest zainstalowana z jego katalogu wtyczek.',
    fr_FR:
      'BTCPay Server peut recevoir des paiements en Monero lorsque Monero est activé et que le plugin Monero est installé depuis son répertoire de plugins.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
