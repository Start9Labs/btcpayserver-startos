import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_2_4_0_2 = VersionInfo.of({
  version: '2.4.0:2',
  releaseNotes: {
    en_US:
      'Internal updates (start-sdk 2.0.x). Fixes database backups that could previously be created empty.',
    es_ES:
      'Actualizaciones internas (start-sdk 2.0.x). Corrige las copias de seguridad de la base de datos que anteriormente podían crearse vacías.',
    de_DE:
      'Interne Aktualisierungen (start-sdk 2.0.x). Behebt Datenbank-Backups, die zuvor leer erstellt werden konnten.',
    pl_PL:
      'Aktualizacje wewnętrzne (start-sdk 2.0.x). Naprawia kopie zapasowe bazy danych, które wcześniej mogły być tworzone puste.',
    fr_FR:
      'Mises à jour internes (start-sdk 2.0.x). Corrige les sauvegardes de base de données qui pouvaient auparavant être créées vides.',
  },
  migrations: {
    // The 0.3.x layout move used to live here, so it only ran for installs
    // sorting below 2.4.0:2 — and every 0.3.x release from 2.4.2 onward
    // converts above it. Now keyed on the layout, in
    // init/repairLegacyLayout.ts.
    down: IMPOSSIBLE,
  },
})
