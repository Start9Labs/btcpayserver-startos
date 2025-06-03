import { sdk } from '../sdk'
import { resyncNbx } from './resyncNbx'
import { lightningNode } from './lightningNode'
import { enableRegistrations } from './enableRegistrations'
import { resetAdminPassword } from './resetAdminPassword'
import { enableAltcoins } from './altcoins'
import { enablePlugins } from './plugins'

export const actions = sdk.Actions.of()
  .addAction(resyncNbx)
  .addAction(lightningNode)
  .addAction(enableRegistrations)
  .addAction(resetAdminPassword)
  .addAction(enableAltcoins)
  .addAction(enablePlugins)
