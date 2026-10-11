import { sdk } from '../sdk'
import { resyncNbx } from './resyncNbx'
import { lightningNode } from './lightningNode'
import { resetAdminPassword } from './resetAdminPassword'
import { enableAltcoins } from './altcoins'
import { enablePlugins } from './plugins'
import { privateDestinations } from './privateDestinations'

export const actions = sdk.Actions.of()
  .addAction(resyncNbx)
  .addAction(lightningNode)
  .addAction(resetAdminPassword)
  .addAction(enableAltcoins)
  .addAction(enablePlugins)
  .addAction(privateDestinations)
