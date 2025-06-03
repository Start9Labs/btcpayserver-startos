import { sdk } from '../sdk'
import { query, getRandomPassword } from '../utils'
import { pbkdf2, randomBytes } from 'node:crypto'

export const resetAdminPassword = sdk.Action.withoutInput(
  'reset-admin-password',

  async ({ effects }) => ({
    name: 'Reset Admin Password',
    description: 'Resets the admin user with a temporary password.',
    warning:
      '<p>This action will fail if more than one admin user is present.</p><p>If another admin user exists, please login to this admin account, add SMTP email settings, and utilize the default <code>Forgot Password</code> flow on the login screen instead.</p>',
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const res = JSON.parse(
      await query(effects, `SELECT "UserId" FROM "AspNetUserRoles"`),
    ) as string[]

    if (res.length > 1)
      throw new Error(
        'More than one admin user exists, please use this account to create a new admin user.',
      )

    const pw = getRandomPassword()
    const salt = randomBytes(128).toString('base64')
    const hash = pbkdf2(pw, salt, 1000, 32, 'sha1', (err, derivedKey) => {
      if (err) throw err
      return derivedKey.toString('base64')
    })
    await query(
      effects,
      `UPDATE "AspNetUsers" SET "PasswordHash"='${hash}' WHERE "Id"='${res[0]}'"`,
    )
    return {
      version: '1',
      title: 'New Admin Password',
      message:
        "This password will be unavailable for retrieval after you leave the screen, so don't forget to change your password after logging in.",
      result: {
        type: 'single',
        value: pw,
        copyable: true,
        qr: false,
        masked: true,
      },
    }
  },
)
