import { sdk } from './sdk'
import { setInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'
import { exposedStore } from './store'
import { setDependencies } from './dependencies'

const install = sdk.setupInstall(async ({ effects }) => {
  console.log('Initializing PostgreSQL...')
  await sdk.runCommand(
    effects,
    { imageId: 'postgres' },
    ['chmod', '777', '/datadir'],
    {},
  )
  await sdk.runCommand(
    effects,
    { imageId: 'postgres' },
    ['mkdir', '-p', '/datadir/postgresql/data'],
    {},
  )
  await sdk.runCommand(
    effects,
    { imageId: 'postgres' },
    ['chmod', '777', '/datadir/postgresql'],
    {},
  )
  await sdk.runCommand(
    effects,
    { imageId: 'postgres' },
    ['chown', '-R', 'postgres:postgres', '/datadir/postgresql/data'],
    {},
  )
  await sdk.runCommand(
    effects,
    { imageId: 'postgres' },
    [
      'sudo',
      '-u',
      'postgres',
      '/usr/lib/postgresql/13/bin/initdb',
      '-D',
      '/datadir/postgresql/data',
    ],
    {},
  )
  await sdk.runCommand(
    effects,
    { imageId: 'postgres' },
    ['chmod', 'a+x', '/assets/postgres-ready.sh'],
    {},
  )

  console.log('PostgreSQL initialization complete')
})

const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  install,
  uninstall,
  setInterfaces,
  setDependencies,
  actions,
  exposedStore,
)
