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
  'Are you sure you want to reset the server admin password?': 15,
  'Password reset successful': 16,
  "This password will be unavailable for retrieval after you leave the screen, so don't forget to change your password after logging in.": 17,

  // actions/resyncNbx.ts
  Rescan: 18,
  'The block height at which to begin resync': 19,
  'Resync NBXplorer': 20,
  'Syncs NBXplorer from the inputted block height.': 21,

  // actions/plugins.ts
  Shopify: 22,
  'Enables you to connect your instance with your Shopify store. Please see the "Instructions" tab for more details.': 23,
  'Enable Plugins': 24,
  'Choose which system plugins to enable.': 25,

  // actions/altcoins.ts
  Monero: 26,
  'Enable Monero integration': 27,
  'Enable Altcoins': 28,
  'Choose which altcoins to enable.': 29,

  // actions/lightningNode.ts
  'Lightning Node': 30,
  'Use this setting to grant access to the selected internal Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, select "None/External". Please see the "Instructions" page for more details.': 31,
  LND: 32,
  'Core Lightning': 33,
  'None/External': 34,
  'Choose Lightning Node': 35,
  'Use this setting to grant access to the selected internal Lightning node to use lightning for invoices.': 36,
  "If this is the first time selecting a lightning node, you need to go into BTCPay Server, click on 'Lightning', choose 'Internal Node' and save.": 37,

  // interfaces.ts
  'Web UI': 38,
  'The web interface for interacting with BTCPay Server in a browser.': 39,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
