import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

// @TODO what happens when migrating from v2.2.1 (legacy), will the other (2.1.6) migrations run?
export const v_2_2_1_1_beta0 = VersionInfo.of({
  version: '2.2.1:1-beta.1',
  releaseNotes: 'Updated for StartOS v0.4.0.',
  migrations: {
    down: IMPOSSIBLE,
  },
})
