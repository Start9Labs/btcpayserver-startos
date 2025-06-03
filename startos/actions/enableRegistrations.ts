import { sdk } from '../sdk'
import { query } from '../utils'

export const enableRegistrations = sdk.Action.withoutInput(
  'enable-registrations',

  async ({ effects }) => {
    const res = JSON.parse(
      await query(
        effects,
        `SELECT "Value" from "Settings" WHERE "Id"='BTCPayServer.Services.PoliciesSettings'`,
      ),
    ) as SelectPoliciesRes

    return {
      name: 'Enable Registrations',
      description:
        'Resets the policies settings if you cannot create a new user because registrations are disabled.',
      warning:
        '<p>Skip this action if you <b>can</b> create a new user in the web UI using the register button.</p><p> Only if you <b>cannot</b> create a new user because registrations are disabled in the <code>Server Settings > Policies</code> do you need to preform this action.</p><p><b>Please note:</b> This action will <i>restart</i> the BTCPay service.</p>',
      allowedStatuses: 'only-running',
      group: null,
      visibility: res.LockSubscription
        ? 'enabled'
        : { disabled: 'Registrations are already enabled' },
    }
  },

  async ({ effects }) => {
    const data = JSON.parse(
      await query(
        effects,
        `SELECT "Value" from "Settings" WHERE "Id"='BTCPayServer.Services.PoliciesSettings'`,
      ),
    ) as SelectPoliciesRes
    data.LockSubscription = false

    await query(
      effects,
      `UPDATE "Settings" SET "Value"='${data}' WHERE "Id"='BTCPayServer.Services.PoliciesSettings'`,
    )

    await sdk.restart(effects)

    return {
      version: '1',
      title: 'Registrations Enabled',
      message:
        'Registrations are now enabled. The service will automatically restart.',
      result: null,
    }
  },
)

interface SelectPoliciesRes {
  RootAppId: null
  DefaultRole: null
  RootAppType: null
  Experimental: boolean
  PluginSource: null
  LangDictionary: string
  DefaultCurrency: null
  LockSubscription: boolean
  DisableSSHService: boolean
  PluginPreReleases: boolean
  BlockExplorerLinks: []
  DomainToAppMapping: []
  CheckForNewVersions: boolean
  AllowHotWalletForAll: boolean
  RequiresUserApproval: boolean
  RequiresConfirmedEmail: boolean
  DiscourageSearchEngines: boolean
  DisableNonAdminCreateUserApi: boolean
  AllowHotWalletRPCImportForAll: boolean
  AllowLightningInternalNodeForAll: boolean
  DisableStoresToUseServerEmailSettings: boolean
}
