import { T } from '@start9labs/start-sdk'
import { autoconfig } from 'monerod-startos/startos/actions/config/autoconfig'
import { btcpayConfig } from './fileModels/btcpay.config'
import { i18n } from './i18n'
import {
  bitcoindDescription,
  clnDescription,
  eclairDescription,
  lndDescription,
  monerodDescription,
} from './manifest/i18n'
import { sdk } from './sdk'
import {
  getEnabledAltcoin,
  isCln,
  isEclair,
  isLnd,
  selfUiBridge,
} from './utils'

const lightning = (effects: T.Effects) =>
  btcpayConfig.read((c) => c.btclightning).const(effects)

const bitcoind = sdk.Dependency.required('bitcoind', {
  description: bitcoindDescription,
  metadata: {
    title: 'Bitcoin',
    icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/feec0b1dae42961a257948fe39b40caf8672fce1/dep-icon.svg',
  },
  versionRange:
    '(>=28.4:29 && <29) || (>=29.4:16 && <30) || (>=30.3:16 && <31) || >=31.1:16 || >=#knotsprerdts:29.3:29',
  kind: 'running',
  healthChecks: ['bitcoind'],
})

// Both floors are set by the credential-rotation task 2.4.2:1 raises:
// revoke-macaroons only rotates LND's macaroon root key — the thing that
// actually revokes — from 0.21.1-beta:11, and revoke-runes does not exist
// before 26.6.6:9.
const lnd = sdk.Dependency.optional('lnd', {
  description: lndDescription,
  metadata: {
    title: 'LND',
    icon: 'https://raw.githubusercontent.com/Start9Labs/lnd-startos/f17336a10769efd8782a347662848c50c6270349/icon.svg',
  },
  versionRange: '>=0.21.1-beta:11',
  kind: 'running',
  healthChecks: ['lnd'],
  enabled: async ({ effects }) => isLnd(await lightning(effects)),
})

const cln = sdk.Dependency.optional('c-lightning', {
  description: clnDescription,
  metadata: {
    title: 'CLN',
    icon: 'https://raw.githubusercontent.com/Start9Labs/cln-startos/71b2d1eb78e2d31cc4d62a410512422d39e856e9/icon.svg',
  },
  versionRange: '>=26.6.6:9',
  kind: 'running',
  healthChecks: ['lightningd'],
  enabled: async ({ effects }) => isCln(await lightning(effects)),
})

const eclair = sdk.Dependency.optional('eclair', {
  description: eclairDescription,
  metadata: {
    title: 'Eclair',
    icon: 'https://raw.githubusercontent.com/Start9Labs/eclair-startos/0f6f6e1dd6faa890422c899d775fb433c7115d3a/icon.png',
  },
  versionRange: '>=0.14.2:0',
  kind: 'running',
  healthChecks: ['eclair'],
  enabled: async ({ effects }) => isEclair(await lightning(effects)),
})

const monerod = sdk.Dependency.optional('monerod', {
  description: monerodDescription,
  metadata: {
    title: 'Monero',
    icon: 'https://raw.githubusercontent.com/kn0wmad/monerod-startos/refs/heads/master/icon.png',
  },
  versionRange: '>=0.18.5.1:2',
  kind: 'running',
  healthChecks: ['monerod'],
  enabled: async ({ effects }) => {
    const chains = await btcpayConfig.read((c) => c.chains).const(effects)
    return !!chains && getEnabledAltcoin('xmr', chains)
  },
}).withInit(async (effects) => {
  // monerod curls this callback on each new block; it reaches our Web UI over
  // the LXC bridge.
  const uiAddr = await selfUiBridge(effects).const()
  if (!uiAddr) return
  const blockNotify = `/usr/bin/curl -so /dev/null "http://${uiAddr}/monerolikedaemoncallback/block?cryptoCode=xmr&hash=%s"`
  await sdk.action.createTask(effects, 'monerod', autoconfig, 'important', {
    input: {
      kind: 'partial',
      accept: [{ 'block-notify': blockNotify }],
      set: { 'block-notify': blockNotify },
    },
    when: { condition: 'input-not-matches', once: false },
    reason: i18n('BTCPay Server requires a particular block-notify command'),
  })
})

export const dependencies = sdk.Dependencies.of()
  .addDependency(bitcoind)
  .addDependency(lnd)
  .addDependency(cln)
  .addDependency(eclair)
  .addDependency(monerod)
