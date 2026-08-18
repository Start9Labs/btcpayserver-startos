import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { repairLegacyLayout } from './repairLegacyLayout'
import { seedFiles } from './seedFiles'

export const init = sdk.setupInit(
  restoreInit,
  // Before the version graph: 2.4.2:1 decides whether to raise the Lightning
  // credential-rotation task by reading `btclightning`, and on a 0.3.x install
  // nothing has written that field until this step translates the old
  // config.yaml. Running it after would silently skip the task for exactly the
  // installs that need it.
  repairLegacyLayout,
  versionGraph,
  seedFiles,
  setInterfaces,
  setDependencies,
  actions,
)

export const uninit = sdk.setupUninit(versionGraph)
