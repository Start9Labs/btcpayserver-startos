import { sdk } from '../../sdk'
import { resyncNbx } from './resyncNbx'

export const { actions, actionsMetadata } = sdk.setupActions(resyncNbx)
