import { sdk } from '../sdk'
import { query, getRandomPassword } from '../utils'
import { pbkdf2Sync, randomBytes } from 'node:crypto'

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
    const admins = await query(
      effects,
      `SELECT "UserId" FROM "AspNetUserRoles"`,
    )

    if (!admins) {
      throw new Error('No admins exist')
    }

    if (admins.rows.length > 1) {
      throw new Error(
        'More than one admin user exists, please use another admin account to adminset the password.',
      )
    }

    const firstAdmin = await query(
      effects,
      `SELECT "Id" FROM "AspNetUsers" WHERE "Id" IN ($1) ORDER BY "Created" ASC LIMIT 1`,
      [admins.rows[0].UserId],
    )
    const pw = getRandomPassword()
    const hash = generateHash(pw)
    await query(
      effects,
      `UPDATE "AspNetUsers" SET "PasswordHash"=$1 WHERE "Id"=$2`,
      [hash, firstAdmin?.rows[0].Id],
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

function generateHash(input: string): string {
  const Pbkdf2IterCount = 1000
  const Pbkdf2SubkeyLength = 256 / 8 // 32 bytes
  const SaltSize = 128 / 8 // 16 bytes

  // Generate salt
  const salt = randomBytes(SaltSize)

  // Derive subkey using PBKDF2 with HMAC-SHA1
  const subkey = pbkdf2Sync(
    input,
    salt,
    Pbkdf2IterCount,
    Pbkdf2SubkeyLength,
    'sha1',
  )

  // Create the output buffer with format marker (0x00)
  const outputBytes = Buffer.alloc(1 + SaltSize + Pbkdf2SubkeyLength)
  outputBytes[0] = 0x00
  salt.copy(outputBytes, 1)
  subkey.copy(outputBytes, 1 + SaltSize)

  // Return base64 string
  return outputBytes.toString('base64')
}
