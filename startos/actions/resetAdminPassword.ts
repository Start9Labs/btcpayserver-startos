import { sdk } from '../sdk'

export const resetAdminPassword = sdk.Action.withoutInput(
  'resetAdminPassword',

  async ({ effects }) => ({
    name: 'Reset Admin Password',
    description: 'Resets the admin user with a temporary password.',
    warning:
      '<p>This action will fail if more than one admin user is present.</p><p>If another admin user exists, please login to this admin account, add SMTP email settings, and utilize the default <code>Forgot Password</code> flow on the login screen instead.</p>',
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {},
)
