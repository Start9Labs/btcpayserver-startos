import { mkdir } from 'fs'
import { sdk } from '../sdk'
import { setInterfaces } from './interfaces'
import { migrations } from './migrations'
import assert from 'assert'

const install = sdk.setupInstall(async ({ effects, utils }) => {
  console.log("Initializing postgres...")
  await effects.chmod({
    volumeId: "main",
    path: "/datadir",
    mode: "777"
  })
  mkdir("/datadir/postgresql/data", (err) => assert.ifError(err))
  await effects.chmod({
    volumeId: "main",
    path: "/datadir/postgresql",
    mode: "777"
  })
  await effects.chown({
    volumeId: "main",
    path: "/datadir/postgresql/data",
    uid: "postgres:postgres"
  })
  await effects.runCommand(["sudo", "-u", "postgres", "/usr/lib/postgresql/13/bin/initdb", "-D", "/datadir/postgresql/data"])
  console.log("postgres initialization complete")
})

const uninstall = sdk.setupUninstall(async ({ effects, utils }) => {})

export const { init, uninit } = sdk.setupInit(
  migrations,
  install,
  uninstall,
  setInterfaces,
)
