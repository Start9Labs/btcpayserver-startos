import { T } from '@start9labs/start-sdk'
import { revokeRunes } from 'cln-startos/startos/actions/revokeRunes'
import { manifest as clnManifest } from 'cln-startos/startos/manifest'
import { revokeMacaroons } from 'lnd-startos/startos/actions/revoke-macaroons'
import { manifest as lndManifest } from 'lnd-startos/startos/manifest'
import { btcpayConfig } from './fileModels/btcpay.config'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { isCln, isLnd } from './utils'

/**
 * Raise the credential-rotation task for the Lightning node BTCPay Server is
 * wired to, after the vulnerability patched in 2.4.2.
 *
 * Called from both the `2.4.2:1` migration and the legacy layout repair: the
 * migration does not reach a 0.3.x install that converts to `2.4.2:1` or above,
 * which is every install the repair exists for. Re-raising is a no-op — the
 * default replayId is `<package>:<action>`, so the second call overwrites the
 * first rather than stacking.
 */
export async function raiseLightningCredentialTask(effects: T.Effects) {
  const backend = await btcpayConfig.read((s) => s.btclightning).once()

  // A critical task stops this service until the target action is run, and
  // only the target service running it clears the task — so raising one for
  // a package that is not installed would leave BTCPay Server unstartable.
  const installed = await sdk.getInstalledPackages(effects)

  if (isLnd(backend) && installed.includes(lndManifest.id))
    await sdk.action.createTask(
      effects,
      lndManifest.id,
      revokeMacaroons,
      'critical',
      {
        reason: i18n(
          "BTCPay Server can read LND's admin macaroon, which may have been exposed by the vulnerability patched in 2.4.2. Recreate LND's macaroons to revoke the old ones.",
        ),
      },
    )

  if (isCln(backend) && installed.includes(clnManifest.id))
    await sdk.action.createTask(
      effects,
      clnManifest.id,
      revokeRunes,
      'critical',
      {
        reason: i18n(
          "BTCPay Server reaches Core Lightning over its admin RPC socket, so a server compromised through the vulnerability patched in 2.4.2 could have issued itself a rune. Revoke this node's runes to invalidate any that were.",
        ),
      },
    )
}
