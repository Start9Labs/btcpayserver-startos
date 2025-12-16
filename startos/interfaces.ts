import { sdk } from './sdk'
import { uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multi = sdk.MultiHost.of(effects, 'main')
  const multiOrigin = await multi.bindPort(uiPort, {
    protocol: 'http',
    addSsl: { addXForwardedHeaders: true },
  })
  const multiInterface = sdk.createInterface(effects, {
    name: 'Web UI',
    id: 'main',
    description:
      'The web interface for interacting with BTCPay Server in a browser.',
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const uiReceipt = await multiOrigin.export([multiInterface])
  return [uiReceipt]
})
