import { VersionInfo } from '@start9labs/start-sdk'

export const v200_1 = VersionInfo.of({
  version: '2.0.0:1',
  releaseNotes: 'Updated to use new APIs for StartOS 0.3.6.',
  migrations: {
    // @TODO delete old config.yaml file
  },
})
