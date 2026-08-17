# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Every cross-service address is a resolver in `startos/utils.ts`, and the host-id and port constants are imported from the dependency packages, never written as literals.** `bitcoindRpcBridge`, `bitcoindPeerBridge`, `torSocksBridge`, `lndRestBridge`, `monerodRpcBridge`, `selfUiBridge`. Add a new one there rather than calling `sdk.host.getBridgeAddress` inline, and chain `.const()` in `main` / `.once()` in an action.
- **`btc.rescan` / `btc.startheight` are transient, and the `reset-start-height` oneshot is what makes them so.** Don't remove it: without it a rescan set once would re-run on every subsequent start.
