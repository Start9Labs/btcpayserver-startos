import { sdk } from '../sdk'
import { resyncNbx } from './resyncNbx'
import { config } from './config/config'

export const actions = sdk.Actions.of().addAction(resyncNbx).addAction(config)
