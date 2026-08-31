# BTCPay Server

## Documentation

- [Start9 Bitcoin Guides](https://docs.start9.com/bitcoin-guides/) — connecting wallets to a Bitcoin or Lightning node on StartOS, Electrum servers, and archival versus pruned nodes.
- [BTCPay Server documentation](https://docs.btcpayserver.org/) — the upstream operator and merchant guide covering stores, invoices, wallets, plugins, and the Greenfield API.

## What you get on StartOS

- The BTCPay Server **Web UI** interface — the merchant dashboard for stores, invoices, point-of-sale, crowdfund pages, pay buttons, and the Greenfield REST API.
- A bundled **NBXplorer** UTXO tracker and a bundled **PostgreSQL** database; you do not configure either.
- Auto-wired connection to **Bitcoin** (required) and, on demand, to **LND**, **Core Lightning**, or **Monerod**.
- Optional **Shopify** integration via the bundled plugin deployer.

## Getting set up

1. Install **Bitcoin** first and let it finish its initial block download — BTCPay Server depends on it and NBXplorer cannot index until Bitcoin is synced.
2. Start BTCPay Server. NBXplorer will then sync the UTXO set from Bitcoin; the **UTXO Tracker Sync** health check shows progress, and the Web UI will not be fully usable until it reads "Synced".
3. Open the **Web UI** interface and create your first server admin account. The first account registered through the UI becomes the server administrator.
4. (Optional) Run **Choose Lightning Node** to wire BTCPay to an internal Lightning node — pick **LND**, **Core Lightning**, **Eclair**, or **None/External**. The matching service must be installed and becomes a hard dependency once selected. With Eclair, run its **Set API Password** action first — BTCPay authenticates with that password. After your first selection, open BTCPay's **Lightning** settings in the Web UI, choose **Internal Node**, and save — BTCPay requires this one-time confirmation before it will use the wired node for invoices.
5. (Optional) Run **Enable Altcoins** to turn on Monero. Monerod becomes a required dependency, and BTCPay sets the Monero `block-notify` command on it automatically.
6. (Optional) Run **Enable Plugins** to turn on the **Shopify** integration if you want to connect a Shopify store.

## Using BTCPay Server

### Web UI

The Web UI is the full BTCPay merchant interface — create stores, generate invoices, manage wallets, configure plugins, and administer users. See the [upstream documentation](https://docs.btcpayserver.org/) for day-to-day operation.

#### Mapping a custom domain to a specific app

You can point a custom domain (e.g. `donate.example.com`, `shop.example.com`) directly at a specific BTCPay app — a crowdfund page, point-of-sale terminal, or pay button — so visitors land on it without navigating the dashboard:

1. Add the domain to the BTCPay **Web UI** interface in the StartOS UI (use Let's Encrypt and create the port-forwarding rules StartOS prompts for).
2. In the BTCPay Web UI, open **Server Settings** and find **Map specific domains to specific apps**. Enter the domain, pick the app from the dropdown, and save.

### Actions

- **Choose Lightning Node** — pick LND, Core Lightning, Eclair, or None/External. The selected service becomes a required dependency. After the first selection you must also confirm **Internal Node** under BTCPay's own **Lightning** settings.
- **Enable Altcoins** — toggle Monero on or off. Turning Monero on makes Monerod a required dependency.
- **Enable Plugins** — toggle the bundled Shopify integration on or off.
- **Resync NBXplorer** — re-scan the UTXO set from a chosen block height. Provide the height as an integer; BTCPay restarts and NBXplorer rescans from there.
- **Reset Server Admin Password** — generate a new random password for the server admin account. Only works when exactly one server admin user exists; copy the password from the result screen before dismissing, it is not retrievable afterwards.

### Backups

StartOS backups include the BTCPay app data, the PostgreSQL `btcpayserver` database (users, stores, invoices), and the package configuration. The NBXplorer index is **not** backed up — on restore, NBXplorer resyncs from Bitcoin, which can take time before the Web UI becomes fully usable again.

### Rotating Lightning credentials after the 2.4.2 update

The vulnerability patched in BTCPay Server 2.4.2 was being actively exploited upstream. On any server that ran an earlier version, treat everything BTCPay could reach as exposed — **updating does not by itself undo access an attacker already took.**

If BTCPay is wired to a Lightning node, updating to 2.4.2:1 raises a **critical task** and stops BTCPay until you clear it. Running the action clears the task and BTCPay starts normally again.

- **LND** — run LND's **Revoke Macaroons**. BTCPay reads LND's admin macaroon, which grants full control of the node. This needs LND `0.21.1-beta:11` or later, which BTCPay now requires: earlier releases called the action **Recreate Macaroons** and deleted the macaroon files while leaving the root key that signs them in place, so LND regenerated them from the same key and any copied macaroon kept working. BTCPay picks up the new macaroon from the same path automatically; other services connected to LND may need restarting.
- **Core Lightning** — run Core Lightning's **Revoke All Runes** (added in `26.6.6:9`). BTCPay reaches CLN over its admin RPC socket, which is unrestricted, so a compromised server could have issued itself a rune that outlives the patch. CLN restarts afterwards to issue its web UI a fresh rune; re-issue any other integration's rune with **Create Rune**.

Two things the update cannot do for you:

- **If you have ever pointed BTCPay at a Lightning node** — even if you have since switched away — rotate that node's credentials anyway. The task is only raised for the node BTCPay is wired to right now.
- **If you generated a hot on-chain wallet inside BTCPay, move those funds** to a wallet whose keys BTCPay has never held. A hot wallet's keys cannot be rotated.

## Limitations

- **Mainnet only.** Testnet and signet are not exposed by this package.
- **One internal Lightning node at a time.** You can wire BTCPay to LND, Core Lightning _or_ Eclair, not several simultaneously.
- **Reset Server Admin Password requires exactly one server admin.** If multiple admin accounts exist, use another admin account to reset the password through the Web UI instead.
