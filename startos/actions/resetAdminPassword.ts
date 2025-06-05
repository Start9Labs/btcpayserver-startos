import { sdk } from '../sdk'
import { query, getRandomPassword } from '../utils'
import { pbkdf2, randomBytes } from 'node:crypto'

// TODO reset first admin user

export const resetAdminPassword = sdk.Action.withoutInput(
  'reset-admin-password',

  async ({ effects }) => ({
    name: 'Reset First Admin Password',
    description:
      'Resets the first admin user with a temporary password. You should only need to preform this action if a single admin user exists. Otherwise, another admin can reset their password.',
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const res = JSON.parse(
      await query(effects, `SELECT "UserId" FROM "AspNetUserRoles"`), // change to created at - check if column
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
