import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3:4',
  releaseNotes: {
    en_US: `Adds Eclair to the Lightning nodes **Choose Lightning Node** can wire BTCPay Server to, alongside LND and Core Lightning.`,
    es_ES: `Añade Eclair a los nodos Lightning a los que **Elegir nodo Lightning** puede conectar BTCPay Server, junto a LND y Core Lightning.`,
    de_DE: `Fügt Eclair zu den Lightning-Knoten hinzu, mit denen **Lightning-Knoten wählen** BTCPay Server verbinden kann, neben LND und Core Lightning.`,
    pl_PL: `Dodaje Eclair do węzłów Lightning, z którymi **Wybierz węzeł Lightning** może połączyć BTCPay Server, obok LND i Core Lightning.`,
    fr_FR: `Ajoute Eclair aux nœuds Lightning auxquels **Choisir le nœud Lightning** peut relier BTCPay Server, aux côtés de LND et Core Lightning.`,
  },
  migrations: {},
})
