# BTCPay Server

## Documentation

- [Start9 Bitcoin Guides](https://docs.start9.com/bitcoin-guides/) — connecting wallets to a Bitcoin or Lightning node on StartOS, Electrum servers, and archival versus pruned nodes.
- [BTCPay Server documentation](https://docs.btcpayserver.org/) — the upstream operator and merchant guide covering stores, invoices, wallets, plugins, and the Greenfield API.

## What you get on StartOS

- The BTCPay Server **Web UI** interface — the merchant dashboard for stores, invoices, point-of-sale, crowdfund pages, pay buttons, and the Greenfield REST API.
- A bundled **NBXplorer** UTXO tracker, a bundled **PostgreSQL** database and, with Monero enabled, a bundled Monero wallet RPC; you do not configure any of them.
- Auto-wired connection to **Bitcoin** (required) and, on demand, to **LND**, **Core Lightning**, **Eclair**, or **Monero**.
- Optional **Shopify** integration via the bundled plugin deployer.

## Getting set up

1. Install **Bitcoin** first and let it finish its initial block download — BTCPay Server depends on it and NBXplorer cannot index until Bitcoin is synced.
2. Start BTCPay Server. NBXplorer will then sync the UTXO set from Bitcoin; the **UTXO Tracker Sync** health check shows progress, and the Web UI will not be fully usable until it reads "Synced".
3. Open the **Web UI** interface and create your first server admin account. The first account registered through the UI becomes the server administrator.
4. (Optional) Run **Choose Lightning Node** to wire BTCPay to an internal Lightning node — pick **LND**, **Core Lightning**, **Eclair**, or **None/External**. The matching service must be installed and becomes a hard dependency once selected. With Eclair, run its **Set API Password** action first — BTCPay authenticates with that password. After your first selection, open BTCPay's **Lightning** settings in the Web UI, choose **Internal Node**, and save — BTCPay requires this one-time confirmation before it will use the wired node for invoices.
5. (Optional) To accept Monero, install **Monero**, run **Enable Altcoins** to turn Monero on, and run the task that then appears under Monero's **Tasks**. In the BTCPay Web UI, install the **Monero** plugin from the **Plugin Directory** and restart BTCPay Server. Then open your store's **Monero** wallet, enter your wallet's primary address, private view key and restore height under **Set View-Only Wallet Details**, and choose **Set Wallet Details**.
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
- **Enable Altcoins** — toggle Monero on or off. Turning Monero on makes Monero a required dependency and runs the wallet RPC that BTCPay's Monero plugin connects to.
- **Enable Plugins** — toggle the bundled Shopify integration on or off.
- **Configure Private Destinations** — allow requests to a trusted private webhook, LNURL service or custom Lightning node. Enter exact hostnames or IP addresses separated by commas, optionally with ports: `nas.home.arpa:8080,[fd00::1]:443`. Do not enter URLs, wildcards or network ranges. A hostname trusts all addresses it resolves to; specify a port to limit access. Leave empty to remove every exception. Saving restarts BTCPay. Nodes chosen with **Choose Lightning Node** need no exception.
- **Resync NBXplorer** — re-scan the UTXO set from a chosen block height. Provide the height as an integer; BTCPay restarts and NBXplorer rescans from there.
- **Reset Server Admin Password** — generate a new random password for the server admin account. Only works when exactly one server admin user exists; copy the password from the result screen before dismissing, it is not retrievable afterwards.

### Backups

StartOS backups include the BTCPay app data, the PostgreSQL `btcpayserver` database (users, stores, invoices), the Monero view-only wallet, and the package configuration. The NBXplorer index is **not** backed up — on restore, NBXplorer resyncs from Bitcoin, which can take time before the Web UI becomes fully usable again.

## Limitations

- **Mainnet only.** Testnet and signet are not exposed by this package.
- **The Monero plugin is not bundled.** Install it from BTCPay's Plugin Directory after turning Monero on.
- **Monero's RPC Credentials must stay disabled.** BTCPay Server connects to Monero without a username or password, so leave **RPC Credentials** off in Monero's **Daemon RPC Settings**.
- **One internal Lightning node at a time.** You can wire BTCPay to LND, Core Lightning _or_ Eclair, not several simultaneously.
- **Reset Server Admin Password requires exactly one server admin.** If multiple admin accounts exist, use another admin account to reset the password through the Web UI instead.
