import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.7:2',
  releaseNotes: {
    en_US: `BTCPay Server's access to your Bitcoin node's data is now read-only.`,
    es_ES: `El acceso de BTCPay Server a los datos de su nodo de Bitcoin ahora es de solo lectura.`,
    de_DE: `Der Zugriff von BTCPay Server auf die Daten Ihres Bitcoin-Knotens ist jetzt schreibgeschützt.`,
    pl_PL: `Dostęp BTCPay Server do danych Twojego węzła Bitcoin jest teraz tylko do odczytu.`,
    fr_FR: `L'accès de BTCPay Server aux données de votre nœud Bitcoin est désormais en lecture seule.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
