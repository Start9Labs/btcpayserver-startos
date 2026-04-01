<p align="center">
  <img src="icon.svg" alt="BTCPay Server Logo" width="21%">
</p>

# BTCPay Server on StartOS

> **Upstream docs:** <https://docs.btcpayserver.org/>
>
> Everything not listed in this document should behave the same as upstream
> BTCPay Server. If a feature, setting, or behavior is not mentioned
> here, the upstream documentation is accurate and fully applicable.

[BTCPay Server](https://github.com/btcpayserver/btcpayserver) is a free and open-source cryptocurrency payment processor which allows you to receive payments in Bitcoin (on-chain and via the Lightning Network) directly, with no fees, transaction cost or a middleman.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property       | Value                               |
| -------------- | ----------------------------------- |
| BTCPay Server  | `btcpayserver/btcpayserver`         |
| NBXplorer      | `nicolasdorier/nbxplorer`           |
| PostgreSQL     | `btcpayserver/postgres`             |
| Shopify Plugin | `btcpayserver/shopify-app-deployer` |
| Architectures  | x86_64, aarch64                     |

All images are upstream unmodified. The service runs four containers: BTCPay Server, NBXplorer (UTXO tracker), PostgreSQL, and optionally the Shopify plugin deployer.

---

## Volume and Data Layout

| Volume         | Mount Point                   | Purpose             |
| -------------- | ----------------------------- | ------------------- |
| `btcpayserver` | `/datadir`                    | BTCPay Server data  |
| `btcpayserver` | `/root/.btcpayserver/Plugins` | BTCPay plugins      |
| `nbxplorer`    | `/datadir`                    | NBXplorer data      |
| `db`           | `/var/lib/postgresql`         | PostgreSQL database |

**StartOS-specific files on `main` volume:**

- `store.json` — persists plugin state
- `btcpay.env` — BTCPay Server environment variables
- `nbxplorer.env` — NBXplorer environment variables

---

## Installation and First-Run Flow

| Step         | Upstream                                  | StartOS                        |
| ------------ | ----------------------------------------- | ------------------------------ |
| Installation | Docker Compose with multiple config files | Install from marketplace       |
| Database     | Manual PostgreSQL setup                   | Automatic                      |
| Bitcoin Core | Manual RPC configuration                  | Auto-configured via dependency |
| NBXplorer    | Separate manual setup                     | Bundled and auto-configured    |
| Lightning    | Manual configuration                      | Select via action              |

**First-run steps:**

1. Ensure Bitcoin Core is installed (will be auto-configured)
2. Install BTCPay Server from the StartOS marketplace
3. Wait for UTXO Tracker to sync (check health status)
4. Optionally run "Choose Lightning Node" to enable Lightning invoicing
5. Create your admin account through the web UI

---

## Configuration Management

### Auto-Configured by StartOS

| Setting                        | Value                           | Purpose         |
| ------------------------------ | ------------------------------- | --------------- |
| `BTCPAY_NETWORK`               | `mainnet`                       | Bitcoin network |
| `BTCPAY_BIND`                  | `0.0.0.0:23000`                 | Web UI binding  |
| `BTCPAY_SOCKSENDPOINT`         | `tor.startos:9050`              | Tor proxy       |
| `BTCPAY_BTCEXPLORERCOOKIEFILE` | `/root/.nbxplorer/Main/.cookie` | NBXplorer auth  |
| `NBXPLORER_BTCNODEENDPOINT`    | `bitcoind.startos:8333`         | Bitcoin P2P     |
| `NBXPLORER_BTCRPCURL`          | `http://bitcoind.startos:8332/` | Bitcoin RPC     |
| `POSTGRES_HOST_AUTH_METHOD`    | `trust`                         | Database auth   |

### Configurable via Actions

| Setting           | Action                | Purpose                             |
| ----------------- | --------------------- | ----------------------------------- |
| Lightning node    | Choose Lightning Node | LND, CLN, or none                   |
| Altcoins (Monero) | Enable Altcoins       | Enable XMR support                  |
| Shopify plugin    | Enable Plugins        | Shopify store integration           |
| NBXplorer resync  | Resync NBXplorer      | Resync from a specific block height |

---

## Network Access and Interfaces

| Interface | Port  | Protocol | Purpose                     |
| --------- | ----- | -------- | --------------------------- |
| Web UI    | 23000 | HTTP     | BTCPay Server web interface |

**Access methods (StartOS 0.4.0):**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

### Mapping Custom Domains to Apps

You can map custom domains (e.g., `donate.example.com`, `shop.example.com`) directly to specific BTCPay apps such as crowdfund pages or point-of-sale terminals. This lets customers visit a clean URL without needing to navigate your BTCPay dashboard.

**Steps:**

1. **Add domains to your BTCPay "Web UI" interface:**
   Go to your BTCPay service in the StartOS UI, open the interface settings for the Web UI, and add custom domains. Be sure to use Let's Encrypt and create the require port forwarding rules as instructed by StartOS.

2. **Map each domain to an app in BTCPay:**
   In the BTCPay web UI, go to **Server Settings** and find the **"Map specific domains to specific apps"** option. Enter the domain name, select the app (crowdfund, POS, etc.) from the dropdown, and save.

Once configured, visitors to that domain will be served the selected app directly.

---

## Actions (StartOS UI)

### Choose Lightning Node

| Property     | Value                                        |
| ------------ | -------------------------------------------- |
| ID           | `lightning-node`                             |
| Visibility   | Enabled                                      |
| Availability | Any status                                   |
| Purpose      | Select internal Lightning node for invoicing |

**Options:**

- **LND** — connects via REST at `lnd.startos:8080`
- **Core Lightning** — connects via Unix socket
- **None/External** — disable internal Lightning

**Note:** After selecting a lightning node for the first time, you must also go into BTCPay Server settings, click "Lightning", choose "Internal Node", and save.

### Resync NBXplorer

| Property     | Value                                            |
| ------------ | ------------------------------------------------ |
| ID           | `resync-nbx`                                     |
| Visibility   | Enabled                                          |
| Availability | Any status                                       |
| Purpose      | Resync UTXO tracker from a specific block height |

**Input:** Block height (integer, minimum 0)

### Reset Server Admin Password

| Property     | Value                           |
| ------------ | ------------------------------- |
| ID           | `reset-admin-password`          |
| Visibility   | Enabled                         |
| Availability | Running only                    |
| Purpose      | Reset the admin user's password |

Generates a random temporary password. Only works for servers with a single admin user.

### Enable Altcoins

| Property     | Value                     |
| ------------ | ------------------------- |
| ID           | `enable-altcoins`         |
| Visibility   | Enabled                   |
| Availability | Any status                |
| Purpose      | Enable Monero integration |

Requires `monerod` service to be installed when enabled.

### Enable Plugins

| Property     | Value                            |
| ------------ | -------------------------------- |
| ID           | `enable-plugins`                 |
| Visibility   | Enabled                          |
| Availability | Any status                       |
| Purpose      | Enable Shopify store integration |

---

## Dependencies

Dependencies are dynamically resolved based on which features are enabled via actions.

### Bitcoin Core (required)

| Property | Value |
|----------|-------|
| Version constraint | `>= 28.3` |
| Required state | Running |
| Health checks | `bitcoind` |
| Mounted volume | `main` → `/root/.bitcoin` (read-write, used by NBXplorer) |
| Purpose | Blockchain data via RPC and P2P for NBXplorer UTXO tracking |

### LND (optional)

| Property | Value |
|----------|-------|
| Version constraint | `>= 0.20.1-beta` |
| Required state | Running |
| Health checks | `lnd` |
| Mounted volume | `main` → `/mnt/lnd` (read-only) |
| Purpose | Lightning invoicing (when selected via "Choose Lightning Node" action) |

### Core Lightning (optional)

| Property | Value |
|----------|-------|
| Version constraint | `>= 25.12.1` |
| Required state | Running |
| Health checks | `lightningd` |
| Mounted volume | `main` → `/mnt/cln` (read-only) |
| Purpose | Lightning invoicing (when selected via "Choose Lightning Node" action) |

### Monerod (optional)

| Property | Value |
|----------|-------|
| Version constraint | `>= 0.18.4.6` |
| Required state | Running |
| Health checks | `monerod` |
| Mounted volume | (mounted at `/mnt/monero`, read-write) |
| Purpose | Monero payments (when enabled via "Enable Altcoins" action) |

---

## Backups and Restore

**Included in backup:**

- `db` volume — PostgreSQL `btcpayserver` database via `pg_dump` (users, stores, invoices)
- `btcpayserver` volume — BTCPay app data and plugins
- `main` volume — configuration files (store.json, env files)

**Not backed up (regenerable):**

- `nbxplorer` volume — resyncs from Bitcoin Core on restore
- `nbxplorer` database — recreated and resynced on restore

**Restore behavior:**

- BTCPay data and database fully restored
- NBXplorer will need time to resync from Bitcoin Core

---

## Health Checks

| Check      | Display Name      | Method                             | Messages                                      |
| ---------- | ----------------- | ---------------------------------- | --------------------------------------------- |
| PostgreSQL | (internal)        | `pg_isready` on port 5432          | Ready / Waiting                               |
| NBXplorer  | UTXO Tracker      | Port 24444 listening               | Reachable / Unreachable                       |
| UTXO Sync  | UTXO Tracker Sync | NBXplorer `/v1/cryptos/BTC/status` | Synced / Bitcoin syncing X% / UTXO syncing X% |
| Web UI     | Web Interface     | `/api/v1/health` on port 23000     | Reachable / Unreachable                       |
| Shopify    | Shopify Plugin    | Port 5000 listening (when enabled) | Running / Not running                         |

---

## Limitations and Differences

1. **Mainnet only** — testnet and other networks not available
2. **No Docker Compose** — containers are orchestrated by StartOS, not Docker Compose
3. **Single Lightning node** — cannot use both LND and CLN simultaneously
4. **No Redis** — Redis caching not available
5. **Monero integration** — partially implemented (TODO: automatic credential retrieval from monerod)
6. **Admin password reset** — only works for single-admin servers

---

## What Is Unchanged from Upstream

- Full payment processing functionality
- Store creation and management
- Invoice generation (on-chain and Lightning)
- Payment requests and pull payments
- Point of sale app
- Crowdfunding app
- Pay button generation
- Wallet management
- Shopify integration (when enabled)
- REST API (Greenfield API)
- All web UI features and plugins
- Multi-user support
- Two-factor authentication

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: btcpayserver
images:
  btcpay: btcpayserver/btcpayserver
  nbx: nicolasdorier/nbxplorer
  postgres: btcpayserver/postgres
  shopify: btcpayserver/shopify-app-deployer
architectures: [x86_64, aarch64]
volumes:
  db: /var/lib/postgresql
  btcpayserver: /datadir + /root/.btcpayserver/Plugins
  nbxplorer: /datadir
  main: store.json, btcpay.env, nbxplorer.env
ports:
  ui: 23000
  nbxplorer: 24444 (internal)
  postgres: 5432 (internal)
  shopify: 5000 (internal, optional)
dependencies:
  bitcoind: required
  lnd: optional
  c-lightning: optional
  monerod: optional
actions:
  - lightning-node (enabled, any)
  - resync-nbx (enabled, any)
  - reset-admin-password (enabled, running)
  - enable-altcoins (enabled, any)
  - enable-plugins (enabled, any)
health_checks:
  - postgres: pg_isready 5432
  - nbxplorer: port_listening 24444
  - utxo-sync: /v1/cryptos/BTC/status
  - webui: /api/v1/health 23000
  - shopify: port_listening 5000 (optional)
backup:
  pg_dump: btcpayserver (db volume)
  volumes: [btcpayserver, main]
  not_backed_up: [nbxplorer (regenerable)]
startos_managed_config:
  BTCPAY_NETWORK: mainnet
  BTCPAY_BIND: 0.0.0.0:23000
  BTCPAY_SOCKSENDPOINT: tor.startos:9050
  POSTGRES_HOST_AUTH_METHOD: trust
  NBXPLORER_BTCNODEENDPOINT: bitcoind.startos:8333
  NBXPLORER_BTCRPCURL: http://bitcoind.startos:8332/
not_available:
  - Testnet/Signet networks
  - Redis caching
  - Docker Compose deployment
  - Multiple simultaneous Lightning nodes
```
