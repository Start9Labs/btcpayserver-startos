import { sdk } from '../sdk'

export const enableRegistrations = sdk.Action.withoutInput(
  'enableRegistrations',

  async ({ effects }) => ({
    name: 'Enable Registrations',
    description:
      'Resets the policies settings if you cannot create a new user because registrations are disabled.',
    warning:
      '<p>Skip this action if you <b>can</b> create a new user in the web UI using the register button.</p><p> Only if you <b>cannot</b> create a new user because registrations are disabled in the <code>Server Settings > Policies</code> do you need to preform this action.</p><p><b>Please note:</b> This action will <i>restart</i> the BTCPay service.</p>',
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled', // TODO check if enabled and only show when disabled?
  }),

  async ({ effects }) => {},
)
