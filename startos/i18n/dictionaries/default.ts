export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts - health checks
  'UTXO Tracker': 0,
  'The explorer is reachable': 1,
  'The explorer is unreachable': 2,
  'UTXO Tracker Sync': 3,
  'Failed to get UTXO tracker status.': 4,
  'Web Interface': 5,
  'The web interface is reachable': 6,
  'The web interface is unreachable': 7,
  'Shopify Plugin': 8,
  'The Shopify app is running': 9,
  'The Shopify app is not running': 10,
  'Synced to the tip of the Bitcoin blockchain': 11,
  'Failed to connect to Bitcoin node.': 12,

  // actions/resetAdminPassword.ts
  'Reset Server Admin Password': 13,
  'Resets the first server admin user with a temporary password. You should only need to perform this action if a single admin user exists. Otherwise, another admin can reset their password.': 14,
  "Replaces the first server admin's password with a new temporary one. The current password stops working.": 15,
  'Password reset successful': 16,
  "This password will be unavailable for retrieval after you leave the screen, so don't forget to change your password after logging in.": 17,

  // actions/resyncNbx.ts
  Rescan: 18,
  "NBXplorer rescans the chain from this block height. Pick one at or before your wallet's first transaction; the further back, the longer the rescan takes.": 19,
  'Resync NBXplorer': 20,
  'Syncs NBXplorer from the inputted block height.': 21,

  // actions/plugins.ts
  Shopify: 22,
  'Runs the Shopify app alongside BTCPay Server, which you need to connect a Shopify store.': 23,
  'Enable Plugins': 24,
  'Choose which system plugins to enable.': 25,

  // actions/altcoins.ts
  Monero: 26,
  'Accept Monero payments. Monero must be installed on this server and becomes a dependency; a task on Monero then sets the block-notify command BTCPay Server needs.': 27,
  'Enable Altcoins': 28,
  'Choose which altcoins to enable.': 29,

  // actions/lightningNode.ts
  'Lightning Node': 30,
  "The Lightning node on this server that BTCPay Server may use for invoices. Install it first; it becomes a dependency.\n- LND: use this server's LND\n- Core Lightning: use this server's Core Lightning\n- Eclair: use this server's Eclair\n- None/External: use no node on this server; choose this if you do not use Lightning, or to connect an external node inside BTCPay Server": 31,
  LND: 32,
  'Core Lightning': 33,
  'None/External': 34,
  'Choose Lightning Node': 35,
  'Use this setting to grant access to the selected internal Lightning node to use lightning for invoices.': 36,
  "If this is the first time selecting a lightning node, you need to go into BTCPay Server, click on 'Lightning', choose 'Internal Node' and save.": 37,

  // interfaces.ts
  'Web UI': 38,
  'The web interface for interacting with BTCPay Server in a browser.': 39,

  // dependencies.ts
  'BTCPay Server requires a particular block-notify command': 40,

  // versions/current.ts
  "BTCPay Server can read LND's admin macaroon, which may have been exposed by the vulnerability patched in 2.4.2. Run Revoke Macaroons to invalidate the old ones.": 41,
  "BTCPay Server reaches Core Lightning over its admin RPC socket, so a server compromised through the vulnerability patched in 2.4.2 could have issued itself a rune. Revoke this node's runes to invalidate any that were.": 42,
  Eclair: 43,
  'The Bitcoin node is syncing. This must complete before the UTXO tracker can sync. Sync progress: ${percentage}%': 44,
  'The UTXO tracker is syncing. Sync progress: ${progress}%': 45,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
