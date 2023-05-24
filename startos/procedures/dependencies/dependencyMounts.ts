import { sdk } from '../../sdk'
import { manifest as lndManifest } from 'lnd/startos/manifest'
import { manifest as clnManifest } from 'c-lightning/startos/manifest'

export const dependencyMounts = sdk
  .setupDependencyMounts()
  .addPath({
    name: 'dataDir',
    manifest: lndManifest,
    volume: 'main',
    path: '/public',
    readonly: true,
  })
  .addPath({
    name: 'dataDir',
    manifest: clnManifest,
    volume: 'main',
    path: '/shared',
    readonly: true,
  })
  .build()
