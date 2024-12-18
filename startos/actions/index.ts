import { sdk } from '../sdk'
import { resyncNbx } from './resyncNbx'
import { config } from './config/config'

export const actions = sdk.Actions.of().addAction(resyncNbx).addAction(config)

// TODO add action for changing start height
// translate reset admin password and enable registrations
