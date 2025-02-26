import { sdk } from '../sdk'
import { resyncNbx } from './resyncNbx'
import { config } from './config/config'
import { enableRegistrations } from './enableRegistrations'
import { resetAdminPassword } from './resetAdminPassword'

export const actions = sdk.Actions.of()
  .addAction(resyncNbx)
  .addAction(config)
  .addAction(enableRegistrations)
  .addAction(resetAdminPassword)
