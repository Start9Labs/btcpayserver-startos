import { sdk } from './sdk'
import { uiPort, webInterfaceId } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multi = sdk.MultiHost.of(effects, webInterfaceId)
  const multiOrigin = await multi.bindPort(uiPort, { protocol: 'http' })
  const multiInterface = sdk.createInterface(effects, {
    name: 'Web UI',
    id: webInterfaceId,
    description:
      'The web interface for interacting with BTCPay Server in a browser.',
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    search: {},
  })

  const uiReceipt = await multiOrigin.export([multiInterface])
  return [uiReceipt]
})
