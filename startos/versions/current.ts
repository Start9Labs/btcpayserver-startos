import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3:4',
  releaseNotes: {
    en_US: `Adds Eclair to the Lightning nodes **Choose Lightning Node** can wire BTCPay Server to, alongside LND and Core Lightning. Run Eclair's **Set API Password** action before selecting it.`,
    es_ES: `Añade Eclair a los nodos Lightning a los que **Elegir nodo Lightning** puede conectar BTCPay Server, junto a LND y Core Lightning. Ejecute la acción **Establecer la contraseña de la API** de Eclair antes de seleccionarlo.`,
    de_DE: `Fügt Eclair zu den Lightning-Knoten hinzu, mit denen **Lightning-Knoten wählen** BTCPay Server verbinden kann, neben LND und Core Lightning. Führen Sie zuvor die Aktion **API-Passwort festlegen** von Eclair aus.`,
    pl_PL: `Dodaje Eclair do węzłów Lightning, z którymi **Wybierz węzeł Lightning** może połączyć BTCPay Server, obok LND i Core Lightning. Przed wyborem uruchom akcję **Ustaw hasło API** w Eclair.`,
    fr_FR: `Ajoute Eclair aux nœuds Lightning auxquels **Choisir le nœud Lightning** peut relier BTCPay Server, aux côtés de LND et Core Lightning. Exécutez au préalable l'action **Définir le mot de passe de l'API** d'Eclair.`,
  },
  migrations: {},
})
