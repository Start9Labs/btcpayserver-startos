import { LangDict } from './default'

export default {
  es_ES: {
    // main.ts
    1: 'Almacén no encontrado',
    2: 'Las cadenas de BTCPay no existen',
    3: 'Esperando a que PostgreSQL esté listo',
    4: 'PostgreSQL está listo',
    5: 'Rastreador UTXO',
    6: 'El explorador está accesible',
    7: 'El explorador no está accesible',
    8: 'Sincronización del rastreador UTXO',
    9: 'Error al obtener el estado del rastreador UTXO.',
    10: 'Interfaz web',
    11: 'La interfaz web está accesible',
    12: 'La interfaz web no está accesible',
    13: 'Plugin de Shopify',
    14: 'La aplicación de Shopify está en ejecución',
    15: 'La aplicación de Shopify no está en ejecución',
    16: 'Sincronizado con la punta de la blockchain de Bitcoin',
    17: 'El nodo Bitcoin se está sincronizando. Esto debe completarse antes de que el rastreador UTXO pueda sincronizar. Progreso de sincronización: ${percentage}%',
    18: 'El rastreador UTXO se está sincronizando. Progreso de sincronización: ${progress}%',
    19: 'Error al conectar con el nodo Bitcoin.',

    // interfaces.ts
    100: 'Interfaz web',
    101: 'La interfaz web para interactuar con BTCPay Server en un navegador.',

    // actions/altcoins.ts
    200: 'Monero',
    201: 'Habilitar integración con Monero',
    202: 'Habilitar altcoins',
    203: 'Elige qué altcoins habilitar.',

    // actions/lightningNode.ts
    300: 'Nodo Lightning',
    301: 'Usa esta configuración para otorgar acceso al nodo Lightning interno seleccionado. Si prefieres usar un nodo Lightning externo, o no tienes intención de usar Lightning, selecciona "Ninguno/Externo". Por favor consulta la página de "Instrucciones" para más detalles.',
    302: 'Elegir nodo Lightning',
    303: 'Usa esta configuración para otorgar acceso al nodo Lightning interno seleccionado para usar Lightning en facturas.',
    304: "Si es la primera vez que seleccionas un nodo Lightning, necesitas ir a BTCPay Server, hacer clic en 'Lightning', elegir 'Nodo Interno' y guardar.",

    // actions/resetAdminPassword.ts
    400: 'Restablecer contraseña de administrador del servidor',
    401: 'Restablece el primer usuario administrador del servidor con una contraseña temporal. Solo deberías necesitar realizar esta acción si existe un único usuario administrador. De lo contrario, otro administrador puede restablecer su contraseña.',
    402: '¿Estás seguro de que quieres restablecer la contraseña del administrador del servidor?',
    403: 'Contraseña restablecida exitosamente',
    404: 'Esta contraseña no estará disponible para recuperación después de que salgas de la pantalla, así que no olvides cambiar tu contraseña después de iniciar sesión.',

    // actions/resyncNbx.ts
    500: 'Volver a escanear',
    501: 'La altura de bloque desde la que iniciar la resincronización',
    502: 'Resincronizar NBXplorer',
    503: 'Sincroniza NBXplorer desde la altura de bloque ingresada.',

    // actions/plugins.ts
    600: 'Shopify',
    601: 'Te permite conectar tu instancia con tu tienda Shopify. Por favor consulta la pestaña "Instrucciones" para más detalles.',
    602: 'Habilitar plugins',
    603: 'Elige qué plugins del sistema habilitar.',

    // manifest/index.ts - dependencies
    700: 'Se usa para suscribirse a nuevos eventos de bloques.',
    701: 'Se usa para comunicarse con la red Lightning.',
    702: 'Se usa para conectarse a la red de Monero.',
  },
  de_DE: {
    // main.ts
    1: 'Shop nicht gefunden',
    2: 'BTCPay Chains existieren nicht',
    3: 'Warten, bis PostgreSQL bereit ist',
    4: 'PostgreSQL ist bereit',
    5: 'UTXO-Tracker',
    6: 'Der Explorer ist erreichbar',
    7: 'Der Explorer ist nicht erreichbar',
    8: 'UTXO-Tracker-Synchronisation',
    9: 'UTXO-Tracker-Status konnte nicht abgerufen werden.',
    10: 'Weboberfläche',
    11: 'Die Weboberfläche ist erreichbar',
    12: 'Die Weboberfläche ist nicht erreichbar',
    13: 'Shopify-Plugin',
    14: 'Die Shopify-App läuft',
    15: 'Die Shopify-App läuft nicht',
    16: 'Synchronisiert mit der Spitze der Bitcoin-Blockchain',
    17: 'Der Bitcoin-Knoten synchronisiert. Dies muss abgeschlossen sein, bevor der UTXO-Tracker synchronisieren kann. Synchronisierungsfortschritt: ${percentage}%',
    18: 'Der UTXO-Tracker synchronisiert. Synchronisierungsfortschritt: ${progress}%',
    19: 'Verbindung zum Bitcoin-Knoten fehlgeschlagen.',

    // interfaces.ts
    100: 'Weboberfläche',
    101: 'Die Weboberfläche zur Interaktion mit BTCPay Server in einem Browser.',

    // actions/altcoins.ts
    200: 'Monero',
    201: 'Monero-Integration aktivieren',
    202: 'Altcoins aktivieren',
    203: 'Wählen Sie, welche Altcoins aktiviert werden sollen.',

    // actions/lightningNode.ts
    300: 'Lightning-Knoten',
    301: 'Verwenden Sie diese Einstellung, um Zugriff auf den ausgewählten internen Lightning-Knoten zu gewähren. Wenn Sie einen externen Lightning-Knoten bevorzugen oder nicht beabsichtigen, Lightning zu verwenden, wählen Sie "Keiner/Extern". Weitere Informationen finden Sie auf der Seite "Anweisungen".',
    302: 'Lightning-Knoten auswählen',
    303: 'Verwenden Sie diese Einstellung, um Zugriff auf den ausgewählten internen Lightning-Knoten für die Verwendung von Lightning bei Rechnungen zu gewähren.',
    304: 'Wenn Sie zum ersten Mal einen Lightning-Knoten auswählen, müssen Sie in BTCPay Server auf "Lightning" klicken, "Interner Knoten" auswählen und speichern.',

    // actions/resetAdminPassword.ts
    400: 'Server-Administratorpasswort zurücksetzen',
    401: 'Setzt den ersten Server-Administrator-Benutzer mit einem temporären Passwort zurück. Sie sollten diese Aktion nur ausführen, wenn nur ein Administrator-Benutzer existiert. Andernfalls kann ein anderer Administrator dessen Passwort zurücksetzen.',
    402: 'Sind Sie sicher, dass Sie das Server-Administratorpasswort zurücksetzen möchten?',
    403: 'Passwort erfolgreich zurückgesetzt',
    404: 'Dieses Passwort wird nach Verlassen des Bildschirms nicht mehr abrufbar sein. Vergessen Sie also nicht, Ihr Passwort nach der Anmeldung zu ändern.',

    // actions/resyncNbx.ts
    500: 'Erneut scannen',
    501: 'Die Blockhöhe, bei der die Neusynchronisation beginnen soll',
    502: 'NBXplorer neu synchronisieren',
    503: 'Synchronisiert NBXplorer ab der eingegebenen Blockhöhe.',

    // actions/plugins.ts
    600: 'Shopify',
    601: 'Ermöglicht es Ihnen, Ihre Instanz mit Ihrem Shopify-Shop zu verbinden. Weitere Informationen finden Sie auf der Registerkarte "Anweisungen".',
    602: 'Plugins aktivieren',
    603: 'Wählen Sie, welche System-Plugins aktiviert werden sollen.',

    // manifest/index.ts - dependencies
    700: 'Wird verwendet, um neue Block-Ereignisse zu abonnieren.',
    701: 'Wird verwendet, um mit dem Lightning-Netzwerk zu kommunizieren.',
    702: 'Wird verwendet, um sich mit dem Monero-Netzwerk zu verbinden.',
  },
  pl_PL: {
    // main.ts
    1: 'Sklep nie został znaleziony',
    2: 'Łańcuchy BTCPay nie istnieją',
    3: 'Oczekiwanie na gotowość PostgreSQL',
    4: 'PostgreSQL jest gotowy',
    5: 'Tracker UTXO',
    6: 'Eksplorator jest dostępny',
    7: 'Eksplorator jest niedostępny',
    8: 'Synchronizacja trackera UTXO',
    9: 'Nie udało się uzyskać statusu trackera UTXO.',
    10: 'Interfejs webowy',
    11: 'Interfejs webowy jest dostępny',
    12: 'Interfejs webowy jest niedostępny',
    13: 'Wtyczka Shopify',
    14: 'Aplikacja Shopify jest uruchomiona',
    15: 'Aplikacja Shopify nie jest uruchomiona',
    16: 'Zsynchronizowano do najnowszego bloku w łańcuchu Bitcoin',
    17: 'Węzeł Bitcoin synchronizuje się. Musi to zostać zakończone przed synchronizacją trackera UTXO. Postęp synchronizacji: ${percentage}%',
    18: 'Tracker UTXO synchronizuje się. Postęp synchronizacji: ${progress}%',
    19: 'Nie udało się połączyć z węzłem Bitcoin.',

    // interfaces.ts
    100: 'Interfejs webowy',
    101: 'Interfejs webowy do interakcji z BTCPay Server w przeglądarce.',

    // actions/altcoins.ts
    200: 'Monero',
    201: 'Włącz integrację z Monero',
    202: 'Włącz altcoiny',
    203: 'Wybierz, które altcoiny włączyć.',

    // actions/lightningNode.ts
    300: 'Węzeł Lightning',
    301: 'Użyj tego ustawienia, aby przyznać dostęp do wybranego wewnętrznego węzła Lightning. Jeśli wolisz używać zewnętrznego węzła Lightning lub nie zamierzasz używać Lightning, wybierz "Brak/Zewnętrzny". Zobacz stronę "Instrukcje", aby uzyskać więcej szczegółów.',
    302: 'Wybierz węzeł Lightning',
    303: 'Użyj tego ustawienia, aby przyznać dostęp do wybranego wewnętrznego węzła Lightning, aby używać Lightning w fakturach.',
    304: 'Jeśli po raz pierwszy wybierasz węzeł Lightning, musisz wejść do BTCPay Server, kliknąć "Lightning", wybrać "Węzeł wewnętrzny" i zapisać.',

    // actions/resetAdminPassword.ts
    400: 'Zresetuj hasło administratora serwera',
    401: 'Resetuje pierwszego administratora serwera, ustawiając tymczasowe hasło. Powinieneś wykonać tę akcję tylko wtedy, gdy istnieje tylko jeden administrator. W przeciwnym razie inny administrator może zresetować jego hasło.',
    402: 'Czy na pewno chcesz zresetować hasło administratora serwera?',
    403: 'Hasło zresetowane pomyślnie',
    404: 'To hasło nie będzie dostępne do odzyskania po opuszczeniu ekranu, więc nie zapomnij zmienić hasła po zalogowaniu.',

    // actions/resyncNbx.ts
    500: 'Przeskanuj ponownie',
    501: 'Wysokość bloku, od której rozpocząć ponowną synchronizację',
    502: 'Ponownie zsynchronizuj NBXplorer',
    503: 'Synchronizuje NBXplorer od wprowadzonej wysokości bloku.',

    // actions/plugins.ts
    600: 'Shopify',
    601: 'Umożliwia połączenie twojej instancji ze sklepem Shopify. Zobacz zakładkę "Instrukcje", aby uzyskać więcej szczegółów.',
    602: 'Włącz wtyczki',
    603: 'Wybierz, które wtyczki systemowe włączyć.',

    // manifest/index.ts - dependencies
    700: 'Służy do subskrybowania nowych zdarzeń bloków.',
    701: 'Służy do komunikacji z siecią Lightning.',
    702: 'Służy do łączenia się z siecią Monero.',
  },
  fr_FR: {
    // main.ts
    1: 'Boutique non trouvée',
    2: 'Les chaînes BTCPay n\'existent pas',
    3: 'En attente de la disponibilité de PostgreSQL',
    4: 'PostgreSQL est prêt',
    5: 'Tracker UTXO',
    6: "L'explorateur est accessible",
    7: "L'explorateur est inaccessible",
    8: 'Synchronisation du tracker UTXO',
    9: "Impossible d'obtenir le statut du tracker UTXO.",
    10: 'Interface web',
    11: "L'interface web est accessible",
    12: "L'interface web est inaccessible",
    13: 'Plugin Shopify',
    14: "L'application Shopify est en cours d'exécution",
    15: "L'application Shopify n'est pas en cours d'exécution",
    16: 'Synchronisé avec le sommet de la blockchain Bitcoin',
    17: 'Le nœud Bitcoin se synchronise. Cela doit être terminé avant que le tracker UTXO puisse se synchroniser. Progression de la synchronisation : ${percentage}%',
    18: 'Le tracker UTXO se synchronise. Progression de la synchronisation : ${progress}%',
    19: 'Échec de la connexion au nœud Bitcoin.',

    // interfaces.ts
    100: 'Interface web',
    101: "L'interface web pour interagir avec BTCPay Server dans un navigateur.",

    // actions/altcoins.ts
    200: 'Monero',
    201: "Activer l'intégration Monero",
    202: 'Activer les altcoins',
    203: 'Choisissez les altcoins à activer.',

    // actions/lightningNode.ts
    300: 'Nœud Lightning',
    301: 'Utilisez ce paramètre pour accorder l\'accès au nœud Lightning interne sélectionné. Si vous préférez utiliser un nœud Lightning externe, ou si vous n\'avez pas l\'intention d\'utiliser Lightning, sélectionnez "Aucun/Externe". Veuillez consulter la page "Instructions" pour plus de détails.',
    302: 'Choisir un nœud Lightning',
    303: 'Utilisez ce paramètre pour accorder l\'accès au nœud Lightning interne sélectionné afin d\'utiliser Lightning pour les factures.',
    304: 'Si c\'est la première fois que vous sélectionnez un nœud Lightning, vous devez aller dans BTCPay Server, cliquer sur "Lightning", choisir "Nœud interne" et enregistrer.',

    // actions/resetAdminPassword.ts
    400: "Réinitialiser le mot de passe de l'administrateur du serveur",
    401: "Réinitialise le premier utilisateur administrateur du serveur avec un mot de passe temporaire. Vous ne devriez avoir besoin d'effectuer cette action que si un seul utilisateur administrateur existe. Sinon, un autre administrateur peut réinitialiser son mot de passe.",
    402: "Êtes-vous sûr de vouloir réinitialiser le mot de passe de l'administrateur du serveur ?",
    403: 'Mot de passe réinitialisé avec succès',
    404: "Ce mot de passe ne pourra plus être récupéré après avoir quitté l'écran, alors n'oubliez pas de le changer après vous être connecté.",

    // actions/resyncNbx.ts
    500: 'Rescanner',
    501: 'La hauteur de bloc à laquelle commencer la resynchronisation',
    502: 'Resynchroniser NBXplorer',
    503: 'Synchronise NBXplorer à partir de la hauteur de bloc saisie.',

    // actions/plugins.ts
    600: 'Shopify',
    601: 'Vous permet de connecter votre instance à votre boutique Shopify. Veuillez consulter l\'onglet "Instructions" pour plus de détails.',
    602: 'Activer les plugins',
    603: 'Choisissez les plugins système à activer.',

    // manifest/index.ts - dependencies
    700: 'Utilisé pour s\'abonner aux nouveaux événements de blocs.',
    701: 'Utilisé pour communiquer avec le Lightning Network.',
    702: 'Utilisé pour se connecter au réseau Monero.',
  },
} satisfies Record<string, LangDict>
