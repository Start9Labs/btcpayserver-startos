import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.3:5',
  releaseNotes: {
    en_US: `Updated NBXplorer to 2.6.12 and the bundled PostgreSQL image to 18.6. NBXplorer hardens Basic authentication and improves shutdown reliability; PostgreSQL includes security and bug fixes.

See https://github.com/btcpayserver/NBXplorer/compare/v2.6.11...v2.6.12 and https://www.postgresql.org/docs/release/18.6/`,
    es_ES: `Se actualizaron NBXplorer a 2.6.12 y la imagen de PostgreSQL incluida a 18.6. NBXplorer refuerza la autenticación básica y mejora la fiabilidad del apagado; PostgreSQL incluye correcciones de seguridad y errores.

Consulta https://github.com/btcpayserver/NBXplorer/compare/v2.6.11...v2.6.12 y https://www.postgresql.org/docs/release/18.6/`,
    de_DE: `NBXplorer wurde auf 2.6.12 und das mitgelieferte PostgreSQL-Image auf 18.6 aktualisiert. NBXplorer stärkt die Basic-Authentifizierung und verbessert die Zuverlässigkeit beim Herunterfahren; PostgreSQL enthält Sicherheits- und Fehlerkorrekturen.

Siehe https://github.com/btcpayserver/NBXplorer/compare/v2.6.11...v2.6.12 und https://www.postgresql.org/docs/release/18.6/`,
    pl_PL: `Zaktualizowano NBXplorer do wersji 2.6.12 oraz dołączony obraz PostgreSQL do wersji 18.6. NBXplorer wzmacnia uwierzytelnianie podstawowe i poprawia niezawodność zamykania; PostgreSQL zawiera poprawki zabezpieczeń i błędów.

Zobacz https://github.com/btcpayserver/NBXplorer/compare/v2.6.11...v2.6.12 oraz https://www.postgresql.org/docs/release/18.6/`,
    fr_FR: `Mise à jour de NBXplorer vers 2.6.12 et de l'image PostgreSQL fournie vers 18.6. NBXplorer renforce l'authentification Basic et améliore la fiabilité de l'arrêt ; PostgreSQL inclut des correctifs de sécurité et de bogues.

Voir https://github.com/btcpayserver/NBXplorer/compare/v2.6.11...v2.6.12 et https://www.postgresql.org/docs/release/18.6/`,
  },
  migrations: {},
})
