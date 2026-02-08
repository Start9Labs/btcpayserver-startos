export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Store not found': 1,
  'BTCPay chains does not exist': 2,
  'Waiting for PostgreSQL to be ready': 3,
  'PostgreSQL is ready': 4,
  'UTXO Tracker': 5,
  'The explorer is reachable': 6,
  'The explorer is unreachable': 7,
  'UTXO Tracker Sync': 8,
  'Failed to get UTXO tracker status.': 9,
  'Web Interface': 10,
  'The web interface is reachable': 11,
  'The web interface is unreachable': 12,
  'Shopify Plugin': 13,
  'The Shopify app is running': 14,
  'The Shopify app is not running': 15,
  'Synced to the tip of the Bitcoin blockchain': 16,
  'The Bitcoin node is syncing. This must complete before the UTXO tracker can sync. Sync progress: ${percentage}%': 17,
  'The UTXO tracker is syncing. Sync progress: ${progress}%': 18,
  'Failed to connect to Bitcoin node.': 19,

  // interfaces.ts
  'Web UI': 100,
  'The web interface for interacting with BTCPay Server in a browser.': 101,

  // actions/altcoins.ts
  'Monero': 200,
  'Enable Monero integration': 201,
  'Enable Altcoins': 202,
  'Choose which altcoins to enable.': 203,

  // actions/lightningNode.ts
  'Lightning Node': 300,
  'Use this setting to grant access to the selected internal Lightning node. If you prefer to use an external Lightning node, or you do not intend to use Lightning, select "None/External". Please see the "Instructions" page for more details.': 301,
  'Choose Lightning Node': 302,
  'Use this setting to grant access to the selected internal Lightning node to use lightning for invoices.': 303,
  "If this is the first time selecting a lightning node, you need to go into BTCPay Server, click on 'Lightning', choose 'Internal Node' and save.": 304,

  // actions/resetAdminPassword.ts
  'Reset Server Admin Password': 400,
  'Resets the first server admin user with a temporary password. You should only need to perform this action if a single admin user exists. Otherwise, another admin can reset their password.': 401,
  'Are you sure you want to reset the server admin password?': 402,
  'Password reset successful': 403,
  "This password will be unavailable for retrieval after you leave the screen, so don't forget to change your password after logging in.": 404,

  // actions/resyncNbx.ts
  'Rescan': 500,
  'The block height at which to begin resync': 501,
  'Resync NBXplorer': 502,
  'Syncs NBXplorer from the inputted block height.': 503,

  // actions/plugins.ts
  'Shopify': 600,
  'Enables you to connect your instance with your Shopify store. Please see the "Instructions" tab for more details.': 601,
  'Enable Plugins': 602,
  'Choose which system plugins to enable.': 603,

  // manifest/index.ts - dependencies
  'Used to subscribe to new block events.': 700,
  'Used to communicate with the Lightning Network.': 701,
  'Used to connect to the Monero network.': 702,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
