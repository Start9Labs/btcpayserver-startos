import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.7:4',
  releaseNotes: {
    en_US: `Requires StartOS 0.4.1 or later. Backups now include NBXplorer's database, which holds hot-wallet seeds and keys and your wallets' history; take a new backup after updating. Resync NBXplorer restarts the service once and rescans from the chosen height. Enable Plugins opens with your current Shopify setting. Reset Server Admin Password also signs that account out of its existing sessions.`,
    es_ES: `Requiere StartOS 0.4.1 o posterior. Las copias de seguridad ahora incluyen la base de datos de NBXplorer, que guarda las semillas y claves de las carteras calientes y el historial de sus carteras; haga una nueva copia de seguridad después de actualizar. Resincronizar NBXplorer reinicia el servicio una sola vez y vuelve a escanear desde la altura elegida. Habilitar plugins se abre con su configuración actual de Shopify. Restablecer contraseña de administrador del servidor también cierra las sesiones existentes de esa cuenta.`,
    de_DE: `Erfordert StartOS 0.4.1 oder neuer. Backups enthalten jetzt die Datenbank von NBXplorer, in der die Seeds und Schlüssel von Hot Wallets sowie der Verlauf Ihrer Wallets liegen; erstellen Sie nach dem Update ein neues Backup. NBXplorer neu synchronisieren startet den Dienst einmal neu und scannt ab der gewählten Blockhöhe. Plugins aktivieren öffnet sich mit Ihrer aktuellen Shopify-Einstellung. Server-Admin-Passwort zurücksetzen meldet dieses Konto außerdem von seinen bestehenden Sitzungen ab.`,
    pl_PL: `Wymaga StartOS 0.4.1 lub nowszego. Kopie zapasowe zawierają teraz bazę danych NBXplorer, w której przechowywane są seedy i klucze gorących portfeli oraz historia Twoich portfeli; po aktualizacji wykonaj nową kopię zapasową. Ponowna synchronizacja NBXplorer uruchamia usługę ponownie tylko raz i skanuje od wybranej wysokości. Włącz wtyczki otwiera się z Twoim bieżącym ustawieniem Shopify. Zresetuj hasło administratora serwera wylogowuje też to konto z istniejących sesji.`,
    fr_FR: `Nécessite StartOS 0.4.1 ou ultérieur. Les sauvegardes incluent désormais la base de données de NBXplorer, qui contient les seeds et clés des portefeuilles chauds ainsi que l'historique de vos portefeuilles ; effectuez une nouvelle sauvegarde après la mise à jour. Resynchroniser NBXplorer redémarre le service une seule fois et rescanne à partir de la hauteur choisie. Activer les plugins s'ouvre avec votre réglage Shopify actuel. Réinitialiser le mot de passe de l'administrateur du serveur déconnecte aussi ce compte de ses sessions existantes.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
