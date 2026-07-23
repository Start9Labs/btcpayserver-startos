import { i18n } from './i18n'
import { sdk } from './sdk'
import { mainHostId, mainInterfaceId, uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multi = sdk.MultiHost.of(effects, mainHostId)
  const multiOrigin = await multi.bindPort(uiPort, {
    protocol: 'http',
  })
  const multiInterface = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: mainInterfaceId,
    description: i18n(
      'The web interface for interacting with BTCPay Server in a browser.',
    ),
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
