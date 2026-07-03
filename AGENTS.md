# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `btcpayserver`.** It bundles its own PostgreSQL and NBXplorer, running four subcontainers in `main.ts`: `postgres`, `nbx` (NBXplorer), `btcpay`, and `shopify` (only when the Shopify plugin is enabled). It hard-depends on `bitcoind` and optionally on `lnd` / `c-lightning` / `monerod`.
- **Cross-container addresses are resolved over the LXC bridge, not `.startos` DNS.** `startos/utils.ts` holds the resolvers — `bitcoindRpcBridge` / `bitcoindPeerBridge` (nbxplorer.config), `lndRestBridge` (LND REST for `btclightning`), `monerodRpcBridge` (`XMR_daemon_uri`), and `selfUiBridge` (our own Web UI `host:port`, passed to monerod's `block-notify` callback). `main.ts` resolves them at startup and merges the live values into the config files; the file models keep the old `.startos` strings only as `.catch()` fallbacks. Host-id/interface-id constants come from the dependency packages (`bitcoin-core-startos/startos/utils`, `lnd-startos/startos/interfaces`, `monerod-startos/startos/utils`) — imports, not string literals.
- **Lightning selection is discriminated by the `type=` prefix of `btclightning`** (`isLnd` / `isCln` in `utils.ts`), not full-string equality — LND's connection string embeds a bridge address that varies per install, so `lndConnectionString` is a builder function, while CLN's is a static Unix-socket string.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach btcpayserver -n <name> -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — `btcpay`, `nbx`, `postgres`, or `shopify`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
