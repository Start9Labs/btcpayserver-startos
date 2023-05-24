import { sdk } from '../sdk'
import { configSpec } from './config/spec'

export const uiPort = 23000
export const webUiInterfaceId = 'webui'

export const setInterfaces = sdk.setupInterfaces(
  configSpec,
  async ({ effects, utils, input }) => {
    const multi = utils.host.multi('multi')
    const multiOrigin = await multi.bindPort(uiPort, { protocol: 'http' })
    const multiInterface = utils.createInterface({
      name: 'Web UI',
      id: webUiInterfaceId,
      description: 'The web interface for interacting with BTCPay Server in a browser.',
      ui: true,
      hasPrimary: false,
      disabled: false,
      username: null,
      path: '',
      search: {},
    })

    const multiReceipt = await multiInterface.export([multiOrigin])

    return [multiReceipt]
  },
)
