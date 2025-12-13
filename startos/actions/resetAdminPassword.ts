import { Value } from '@start9labs/start-sdk/base/lib/actions/input/builder'
import { sdk } from '../sdk'
import { query } from '../utils'
import { pbkdf2Sync, randomBytes } from 'node:crypto'

export const resetAdminPassword = sdk.Action.withInput(
  'reset-admin-password',
  async ({ effects }) => ({
    name: 'Reset Server Admin Password',
    description:
      'Resets the first server admin user with a temporary password. You should only need to perform this action if a single admin user exists. Otherwise, another admin can reset their password.',
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),
  sdk.InputSpec.of({
    password: Value.text({
      name: 'New Password',
      description: 'Enter new password for the admin user.',
      default: { charset: 'a-z,A-Z,1-9,!,@,$,%,&,*', len: 22 },
      masked: true,
      required: true,
      generate: { charset: 'a-z,A-Z,1-9,!,@,$,%,&,*', len: 22 },
    }),
  }),
  async ({ effects }) => ({}),
  async ({ effects, input }) => {
    await resetServerAdminPassword(input.password)

    return {
      version: '1',
      title: 'Password reset successful',
      message:
        "This password will be unavailable for retrieval after you leave the screen, so don't forget to change your password after logging in.",
      result: {
        type: 'single',
        value: input.password,
        copyable: true,
        qr: false,
        masked: true,
      },
    }
  },
)

async function resetServerAdminPassword(newPassword: string) {
  const admins = await query(
    `
      SELECT u."Id"
      FROM "AspNetUsers" u
      INNER JOIN "AspNetUserRoles" ur ON ur."UserId" = u."Id"
      INNER JOIN "AspNetRoles" r ON r."Id" = ur."RoleId"
      WHERE r."Name" = 'ServerAdmin'
      ORDER BY u."Created" ASC
      `,
  )

  if (!admins || admins.rows.length === 0) {
    throw new Error('No server admins exist')
  }

  if (admins.rows.length > 1) {
    throw new Error(
      'More than one server admin user exists, use another admin account to reset the password.',
    )
  }

  const firstAdminId = admins.rows[0].Id
  const hash = generateHash(newPassword)
  await query(`UPDATE "AspNetUsers" SET "PasswordHash"=$1 WHERE "Id"=$2`, [
    hash,
    firstAdminId,
  ])
}

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
