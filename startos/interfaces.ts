import { sdk } from './sdk'

export const uiPort = 23000
export const id = 'webui'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multi = sdk.host.multi(effects, id)
  const multiOrigin = await multi.bindPort(uiPort, { protocol: 'http' })
  const multiInterface = sdk.createInterface(effects, {
    name: 'Web UI',
    id,
    description:
      'The web interface for interacting with BTCPay Server in a browser.',
    type: 'ui',
    hasPrimary: false,
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    search: {},
  })

  const uiReceipt = await multiOrigin.export([multiInterface])
  return [uiReceipt]
})
