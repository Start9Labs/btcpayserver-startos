<p align="center">
  <img src="icon.svg" alt="BTCPay Server Logo" width="21%">
</p>

# BTCPay Server on StartOS

> Everything not listed in this document should behave the same as upstream
> BTCPay Server. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[BTCPay Server](https://github.com/btcpayserver/btcpayserver) is a self-hosted Bitcoin payment processor. This package bundles the pieces upstream's Docker deployment expects you to run yourself — PostgreSQL and the NBXplorer UTXO tracker — as private sidecars, and wires them, your Bitcoin node, and an optional Lightning or Monero node together without any addresses being typed in.

- **Upstream repo:** <https://github.com/btcpayserver/btcpayserver>
- **Wrapper repo:** <https://github.com/Start9Labs/btcpayserver-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Four upstream images, unmodified. Three run always; the fourth only when the Shopify plugin is switched on.

| Property      | Value                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Images        | `btcpayserver/btcpayserver-internal`, `nicolasdorier/nbxplorer`, `btcpayserver/postgres`, `btcpayserver/shopify-app-deployer` |
| Architectures | x86_64, aarch64                                                                                                               |
| Entrypoint    | Each image's own                                                                                                              |

| Subcontainer | Purpose                                                                        |
| ------------ | ------------------------------------------------------------------------------ |
| `btcpay`     | The `btcpay` daemon — the server and its web UI, and the one to `attach` to    |
| `nbx`        | NBXplorer, the UTXO tracker that watches the chain on BTCPay's behalf          |
| `postgres`   | The private database, shared by BTCPay and NBXplorer as two separate databases |
| `shopify`    | The Shopify app deployer; present only while that plugin is enabled            |

Startup is ordered: `postgres` first, then `nbxplorer`, then `btcpay`, and `shopify` after that. One oneshot, `reset-start-height`, runs once NBXplorer is up — see [Actions](#actions).

Postgres listens on loopback only and runs with trust authentication, which is safe because that loopback is inside this service's own network namespace: nothing outside the service can reach it, and the two databases are never exposed.

## Volume and Data Layout

Four volumes, and one of them never enters a container. The same volume can appear at different paths in different subcontainers.

| Volume         | Mounted at                                                                                    | Purpose                                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `btcpayserver` | `/datadir` in `btcpay`, with its `Plugins` subdirectory also at `/root/.btcpayserver/Plugins` | BTCPay's data directory, its `settings.config`, and installed plugins                                              |
| `nbxplorer`    | `/datadir` in `nbx`, and `/root/.nbxplorer` in `btcpay`                                       | NBXplorer's data directory, its `settings.config`, and its cookie — which BTCPay reads to authenticate to it       |
| `db`           | `/var/lib/postgresql` in `postgres`                                                           | The PostgreSQL data directory                                                                                      |
| `main`         | — (host side)                                                                                 | `store.json`, and any `superseded-*` directory set aside by the legacy-layout move; never mounted into a container |

Dependency volumes are mounted in as needed:

| Mount                       | Source                         | Access     | Used for                               |
| --------------------------- | ------------------------------ | ---------- | -------------------------------------- |
| `/root/.bitcoin` (in `nbx`) | Bitcoin's `main` volume        | read-write | NBXplorer reads the node's RPC cookie  |
| `/mnt/lnd`                  | LND's `main` volume            | read-only  | The admin macaroon and TLS certificate |
| `/mnt/cln`                  | Core Lightning's `main` volume | read-only  | The `lightning-rpc` unix socket        |
| `/mnt/monero`               | Monero's `main` volume         | read-write | Monero wallet files                    |

## File Models

Three models. Two are the applications' own INI configuration, and in both the package owns the wiring while you own the handful of settings the actions expose.

| File                                 | Format | Modelled                | Written by                                                  |
| ------------------------------------ | ------ | ----------------------- | ----------------------------------------------------------- |
| `btcpayserver:/Main/settings.config` | INI    | Yes — `FileHelper.ini`  | Every init, every start, and the Lightning, Altcoin actions |
| `nbxplorer:/Main/settings.config`    | INI    | Yes — `FileHelper.ini`  | Every init, every start, the Resync action, and its oneshot |
| `main:store.json`                    | JSON   | Yes — `FileHelper.json` | Every init, and the Plugins action                          |

**Both files are wiring, not tuning.** They carry the addresses and credentials linking BTCPay, NBXplorer, Postgres, and your nodes — values that must be correct rather than chosen — plus the few settings the actions expose. Everything else about BTCPay is configured inside BTCPay's own UI and stored in its database, not in a file this package can rewrite.

### btcpayserver settings.config

**Enforced** — rewritten to a fixed value whenever the package writes the file: `network`, `bind`, `btcexplorercookiefile`, `explorerpostgres`, `postgres`, `debuglog`, `dockerdeployment`, `updateurl`, and the two Monero wallet-daemon paths. `BTC.explorer.cookiefile` is modelled as "must be absent" and is deleted if present — the correctly-cased key above replaces it.

Two of those keep BTCPay from advertising updates it cannot perform here, since StartOS does the updating: `dockerdeployment=false` hides the Maintenance page and its update button, and an empty `updateurl` disables the daily GitHub release check — which also removes the "check releases on GitHub" toggle from Server Settings → Policies and stops first-admin registration from switching it on. Plugin updates are a separate mechanism and still work normally from BTCPay's UI.

**Written on every start**, from addresses resolved over the service bridge rather than stored: `socksendpoint` (Tor's SOCKS proxy), `XMR_daemon_uri` (when Monero is enabled), and the `server=` half of `btclightning` when the backend is LND. Editing any of these by hand does not survive a restart, and does not need to — they heal themselves when a dependency is installed, removed, or re-ported.

**Yours, through an action:** `btclightning` selects the Lightning backend, and `chains` enables Monero. `XMR_daemon_username` and `XMR_daemon_password` default to empty and are not exposed.

### nbxplorer settings.config

**Enforced:** `port`, `bind` (loopback), `mainnet`, `btc.rpc.cookiefile`, and `postgres`. `btc.rpc.user` and `btc.rpc.password` are modelled as "must be absent" — NBXplorer authenticates to Bitcoin with the cookie it reads through the mount, never with a stored password.

**Written on every start:** `btc.rpc.url` and `btc.node.endpoint`, both resolved from Bitcoin's own bindings.

**Transient:** `btc.rescan` and `btc.startheight` are set by [Resync NBXplorer](#actions) and reset to their defaults by the `reset-start-height` oneshot as soon as NBXplorer comes back up, so a rescan happens once rather than on every subsequent start.

### store.json

`plugins.shopify` only — whether the Shopify sidecar runs. It lives on the `main` volume, apart from either application's data.

## Dependencies

One is required; the rest appear according to what you have enabled.

| Dependency     | Required?                    | Kind      | Health check | Why                                             |
| -------------- | ---------------------------- | --------- | ------------ | ----------------------------------------------- |
| Bitcoin        | always                       | `running` | `bitcoind`   | Chain data for NBXplorer, over both RPC and P2P |
| LND            | when selected as the backend | `running` | `lnd`        | Lightning invoices                              |
| Core Lightning | when selected as the backend | `running` | `lightningd` | Lightning invoices                              |
| Monero         | when Monero is enabled       | `running` | `monerod`    | Monero payments                                 |

**NBXplorer connects to Bitcoin's whitelisted P2P binding, not its public one.** It pulls blocks over that connection, and Bitcoin's ordinary `peer` binding grants no permissions — a connection there shares the pool with anonymous inbound peers, so it can be evicted to seat another peer or cut off by the upload target. The `peer-local` host is whitelisted, and neither applies.

Enabling Monero also raises a task on Monero itself — see [Tasks](#tasks).

## Network Access and Interfaces

One interface. NBXplorer, Postgres, and the Shopify deployer are all internal and never published.

| Interface | Id     | Type | Port  | Description                     |
| --------- | ------ | ---- | ----- | ------------------------------- |
| Web UI    | `main` | ui   | 23000 | The BTCPay Server web interface |

The port is bound on the `main` MultiHost and is not masked.

## Installation and First-Run Flow

Install seeds the three models with their defaults and nothing else — no credentials are generated and no task is raised. Account creation is BTCPay's own: the first visit to the web UI registers the server admin.

Two ordering points matter, and both come from dependencies rather than from setup:

1. **Bitcoin must be installed and running**, and NBXplorer cannot report itself synced until Bitcoin is. On a fresh node that is the length of an initial block download, followed by NBXplorer's own scan — both are reported as progress rather than as failures. See [Health Checks](#health-checks).
2. **Choosing a Lightning node is a two-step operation.** The [Choose Lightning Node](#actions) action grants BTCPay access to the node; BTCPay then has to be told to use it, inside its own Lightning settings.

An install carried over from the older single-`main` layout has its data moved onto the four volumes on init, and that first start is long — it moves a database, and the Postgres image upgrades the cluster before accepting connections. The trigger is the old cluster still sitting under `main`, not a version, so **an empty BTCPay on such an install — no stores, no accounts, every password rejected — means the move has not run yet, and restarting the service runs it.** Where a destination volume was not already empty, what was in it is set aside under `main/superseded-<timestamp>/` rather than overwritten.

## Actions

Five actions, all user-facing.

### Choose Lightning Node

Selects which Lightning node BTCPay may use — LND, Core Lightning, or neither. Run it after installing the node.

- **What it changes:** `btclightning` in BTCPay's config, and through it the package's dependency set and its mounts. LND is recorded as a REST address resolved at that moment; Core Lightning as a path to the RPC socket it will mount.
- **Cost:** seconds, then a restart, since the node's data volume can only be mounted when the container is recreated.
- **Repeat safety:** safe to re-run and safe to reverse; selecting "None/External" removes the mount and the dependency.
- **Guard:** selecting LND fails with a message if LND is not yet reachable, rather than recording an address that does not work.
- **What happens next:** BTCPay does not start using the node on its own. Open its Lightning settings, choose the internal node, and save.

### Enable Altcoins

Turns Monero support on or off.

- **What it changes:** `chains` in BTCPay's config, and through it the Monero dependency, the Monero wallet mount, and the block-notify task described under [Tasks](#tasks).
- **Cost:** seconds, then a restart.
- **Repeat safety:** safe both ways; disabling removes the dependency and the mount.

### Enable Plugins

Turns the Shopify integration on or off.

- **What it changes:** `plugins.shopify` in `store.json`, which decides whether the Shopify sidecar runs at all.
- **Cost:** seconds, then a restart.
- **Repeat safety:** safe both ways.

### Resync NBXplorer

Rescans the chain from a chosen block height. Run it when BTCPay is missing transactions it should have seen — typically after importing an existing wallet with history.

- **What it changes:** NBXplorer's `btc.startheight` and `btc.rescan`, then restarts the service. The oneshot clears both once NBXplorer is running again, so the rescan is not repeated on later starts.
- **Cost:** the rescan itself, which is proportional to how far back you start; the service is restarted immediately.
- **Repeat safety:** safe to re-run. It does not destroy anything — a rescan re-reads the chain into NBXplorer's database.

### Reset Server Admin Password

Sets a temporary password on the first server-admin account. Run it when locked out.

- **What it changes:** that account's password hash in the BTCPay database, written directly over Postgres.
- **Availability:** only while the service is running, because it goes through the running database.
- **Repeat safety:** safe to re-run; each run generates a fresh password.
- **Outputs:** the new password, masked and copyable, shown once. Change it after logging in.
- **Guards:** it refuses when no server admin exists, and refuses when more than one does — with more than one, the right recovery is for another admin to reset the account from inside BTCPay.

## Tasks

The package raises no task on itself. It raises them on _other_ services, which is why they appear on a page that does not explain where they came from.

| Task                          | Raised on      | Severity    | Raised when                                                                   | Cleared when                                         |
| ----------------------------- | -------------- | ----------- | ----------------------------------------------------------------------------- | ---------------------------------------------------- |
| Auto-Configure (block notify) | Monero         | `important` | Monero is enabled here and its `block-notify` is not the command BTCPay needs | Monero's config matches; it returns if changed again |
| Revoke Macaroons              | LND            | `critical`  | Upgrading to `2.4.2:1` with LND selected and installed                        | LND's action runs                                    |
| Revoke Runes                  | Core Lightning | `critical`  | Upgrading to `2.4.2:1` with Core Lightning selected and installed             | Core Lightning's action runs                         |

The Monero task is a standing condition rather than a one-off: it re-raises whenever Monero's block-notify setting stops matching, because without that callback BTCPay is not told about new blocks.

The two credential-rotation tasks were raised once, by the upgrade that shipped a security fix, on the reasoning that this server could read those credentials and so they should be rotated. They are `critical` on the _Lightning node_, not on BTCPay, and only for a node that is actually installed — a critical task can only be cleared by the service that owns it, so raising one against an absent package would leave it permanently unclearable.

## Health Checks

Four checks at most, and the two that matter to a user are both about sync.

| Check       | Displayed           | Method                                                | Grace | Present                     |
| ----------- | ------------------- | ----------------------------------------------------- | ----- | --------------------------- |
| `btcpay`    | "Web Interface"     | HTTP `GET /api/v1/health`                             | 60s   | always                      |
| `nbxplorer` | "UTXO Tracker"      | NBXplorer's port is listening                         | 30s   | always                      |
| `utxo-sync` | "UTXO Tracker Sync" | NBXplorer's status API, authenticated with its cookie | —     | always                      |
| `postgres`  | — internal          | `pg_isready`                                          | —     | always                      |
| `shopify`   | "Shopify Plugin"    | The deployer's port is listening                      | —     | while the plugin is enabled |

**`utxo-sync` is the one to read**, because it distinguishes the two things that can be behind. While Bitcoin is still syncing it reports Bitcoin's own progress and says so explicitly — nothing is wrong, and NBXplorer cannot get ahead of its node. Once Bitcoin is synced it reports NBXplorer's own scan progress instead. It fails only when it cannot reach the node at all.

**`postgres` has `display: null`** — it exists so that a failed database restarts the service, not to be read. A service restarting with no failing check on screen is usually this one; the service logs name it.

**`btcpay` failing** after a long grace period means the server did not come up. Because it starts only after Postgres and NBXplorer are ready, that points at BTCPay itself rather than at its sidecars.

## Backups and Restore

The strategy is mixed, and the distinction decides what a restore actually gives you.

- **`db` is dumped, not copied.** `Backups.withPgDump` runs a logical dump of the **`btcpayserver` database only**. The volume's files are never captured, and the dump is replayed into a fresh database on restore — which is what lets a future Postgres image read it.
- **`btcpayserver` and `main` are copied wholesale** — BTCPay's data directory, its `settings.config`, installed plugins, `store.json`, and any `superseded-*` directory.
- **`nbxplorer` is not backed up at all**, and neither is the `nbxplorer` database inside Postgres. Both are derived from the chain.

**So a restored instance has your stores, invoices, users, and settings, but no UTXO tracker state.** NBXplorer rebuilds it by scanning the chain, which takes time proportional to how much history your wallets have; [Resync NBXplorer](#actions) is there for when that scan needs to start further back than it did on its own. The Bitcoin node must be present and synced before any of it can begin.

## Limitations and Differences

1. **PostgreSQL and NBXplorer are private sidecars.** They belong to this service, cannot be shared with another, and cannot be substituted for an external instance.
2. **Only a Lightning node on this server can be selected through the action.** An external node is still possible, but it is configured inside BTCPay as "custom", not here.
3. **Monero requires a matching setting on the Monero service**, which is why enabling it raises a task there rather than just working.
4. **NBXplorer state is not in backups.** A restore is followed by a rescan.
5. **The Shopify integration runs as a separate sidecar** and only when explicitly enabled.
6. **A `superseded-*` directory is never reaped.** Nothing removes it and it is copied into every backup; deleting it is the operator's call, once they have confirmed the data it displaced is back.
7. **No riscv64 build.** x86_64 and aarch64 only.

---

## Quick Reference for AI Consumers

```yaml
package_id: btcpayserver
image: btcpayserver/btcpayserver-internal # plus nbxplorer, postgres, shopify-app-deployer
architectures:
  - x86_64
  - aarch64
subcontainers:
  - btcpay # the server; the one to attach to
  - nbx # NBXplorer
  - postgres # private database
  - shopify # only while the Shopify plugin is enabled
volumes:
  btcpayserver: /datadir
  nbxplorer: /datadir (in nbx), /root/.nbxplorer (in btcpay)
  db: /var/lib/postgresql
  main: host side (store.json)
file_models:
  - btcpayserver:/Main/settings.config
  - nbxplorer:/Main/settings.config
  - main:store.json
startos_managed_env_vars:
  - BTCPAY_DATADIR
  - BTCPAY_SHOPIFY_PLUGIN_DEPLOYER
  - LC_ALL
  - NBXPLORER_DATADIR
  - POSTGRES_HOST_AUTH_METHOD
dependencies:
  - bitcoind # required
  - lnd # when selected as the Lightning backend
  - c-lightning # when selected as the Lightning backend
  - monerod # when Monero is enabled
interfaces:
  main: { type: ui, port: 23000 }
actions:
  - lightning-node
  - enable-altcoins
  - enable-plugins
  - resync-nbx
  - reset-admin-password # only-running
tasks: # all raised on other services, not on this one
  - { action: autoconfig, severity: important } # on monerod
  - { action: revoke-macaroons, severity: critical } # on lnd, at the 2.4.2:1 upgrade
  - { action: revoke-runes, severity: critical } # on c-lightning, at the 2.4.2:1 upgrade
health_checks:
  - btcpay # displayed "Web Interface"
  - nbxplorer # displayed "UTXO Tracker"
  - utxo-sync # displayed "UTXO Tracker Sync"
  - postgres # internal
  - shopify # displayed "Shopify Plugin"; only while enabled
```
