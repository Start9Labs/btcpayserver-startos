import { sdk } from '../sdk'
import { resyncNbx } from './resyncNbx'
import { lightningNode } from './lightningNode'
import { enableRegistrations } from './enableRegistrations'
import { resetAdminPassword } from './resetAdminPassword'

export const actions = sdk.Actions.of()
  .addAction(resyncNbx)
  .addAction(lightningNode)
  .addAction(enableRegistrations)
  .addAction(resetAdminPassword)
