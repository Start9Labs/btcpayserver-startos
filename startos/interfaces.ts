import { sdk } from './sdk'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multi = sdk.MultiHost.of(effects, 'main')
  const multiOrigin = await multi.bindPort(80, { protocol: 'http' })
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
