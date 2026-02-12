<p align="center">
  <img src="icon.png" alt="BTCPay Server Logo" width="21%">
</p>

# BTCPay Server on StartOS

> **Upstream docs:** <https://docs.btcpayserver.org/>
>
> Everything not listed in this document should behave the same as upstream
> BTCPay Server v2.3.3. If a feature, setting, or behavior is not mentioned
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

| Property | Value |
|----------|-------|
| BTCPay Server | `btcpayserver/btcpayserver:2.3.3` |
| NBXplorer | `nicolasdorier/nbxplorer:2.6.0` |
| PostgreSQL | `btcpayserver/postgres:13.23` |
| Shopify Plugin | `btcpayserver/shopify-app-deployer:1.5` |
| Architectures | x86_64, aarch64 |

All images are upstream unmodified. The service runs four containers: BTCPay Server, NBXplorer (UTXO tracker), PostgreSQL, and optionally the Shopify plugin deployer.

---

## Volume and Data Layout

| Volume | Subpath | Mount Point | Purpose |
|--------|---------|-------------|---------|
| `main` | `btcpayserver` | `/datadir` | BTCPay Server data |
| `main` | `plugins` | `/root/.btcpayserver/Plugins` | BTCPay plugins |
| `main` | `nbxplorer` | `/root/.nbxplorer` | NBXplorer data |
| `main` | `postgresql` | `/var/lib/postgresql` | PostgreSQL database |

**StartOS-specific files on `main` volume:**

- `store.json` — persists lightning node selection and plugin state
- `btcpay.env` — BTCPay Server environment variables
- `nbxplorer.env` — NBXplorer environment variables

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Installation | Docker Compose with multiple config files | Install from marketplace |
| Database | Manual PostgreSQL setup | Automatic |
| Bitcoin Core | Manual RPC configuration | Auto-configured via dependency |
| NBXplorer | Separate manual setup | Bundled and auto-configured |
| Lightning | Manual configuration | Select via action |

**First-run steps:**

1. Ensure Bitcoin Core is installed (will be auto-configured)
2. Install BTCPay Server from the StartOS marketplace
3. Wait for UTXO Tracker to sync (check health status)
4. Optionally run "Choose Lightning Node" to enable Lightning invoicing
5. Create your admin account through the web UI

---

## Configuration Management

### Auto-Configured by StartOS

| Setting | Value | Purpose |
|---------|-------|---------|
| `BTCPAY_NETWORK` | `mainnet` | Bitcoin network |
| `BTCPAY_BIND` | `0.0.0.0:23000` | Web UI binding |
| `BTCPAY_SOCKSENDPOINT` | `startos:9050` | Tor proxy |
| `BTCPAY_BTCEXPLORERCOOKIEFILE` | `/root/.nbxplorer/Main/.cookie` | NBXplorer auth |
| `NBXPLORER_BTCNODEENDPOINT` | `bitcoind.startos:8333` | Bitcoin P2P |
| `NBXPLORER_BTCRPCURL` | `http://bitcoind.startos:8332/` | Bitcoin RPC |
| `POSTGRES_HOST_AUTH_METHOD` | `trust` | Database auth |

### Configurable via Actions

| Setting | Action | Purpose |
|---------|--------|---------|
| Lightning node | Choose Lightning Node | LND, CLN, or none |
| Altcoins (Monero) | Enable Altcoins | Enable XMR support |
| Shopify plugin | Enable Plugins | Shopify store integration |
| NBXplorer resync | Resync NBXplorer | Resync from a specific block height |

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose |
|-----------|------|----------|---------|
| Web UI | 23000 | HTTP | BTCPay Server web interface |

**Access methods (StartOS 0.4.0):**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

---

## Actions (StartOS UI)

### Choose Lightning Node

| Property | Value |
|----------|-------|
| ID | `lightning-node` |
| Visibility | Enabled |
| Availability | Any status |
| Purpose | Select internal Lightning node for invoicing |

**Options:**

- **LND** — connects via REST at `lnd.startos:8080`
- **Core Lightning** — connects via Unix socket
- **None/External** — disable internal Lightning

**Note:** After selecting a lightning node for the first time, you must also go into BTCPay Server settings, click "Lightning", choose "Internal Node", and save.

### Resync NBXplorer

| Property | Value |
|----------|-------|
| ID | `resync-nbx` |
| Visibility | Enabled |
| Availability | Any status |
| Purpose | Resync UTXO tracker from a specific block height |

**Input:** Block height (integer, minimum 0)

### Reset Server Admin Password

| Property | Value |
|----------|-------|
| ID | `reset-admin-password` |
| Visibility | Enabled |
| Availability | Running only |
| Purpose | Reset the admin user's password |

Generates a random temporary password. Only works for servers with a single admin user.

### Enable Altcoins

| Property | Value |
|----------|-------|
| ID | `enable-altcoins` |
| Visibility | Enabled |
| Availability | Any status |
| Purpose | Enable Monero integration |

Requires `monerod` service to be installed when enabled.

### Enable Plugins

| Property | Value |
|----------|-------|
| ID | `enable-plugins` |
| Visibility | Enabled |
| Availability | Any status |
| Purpose | Enable Shopify store integration |

---

## Dependencies

| Dependency | Required | Version | Purpose | Auto-Config |
|------------|----------|---------|---------|-------------|
| Bitcoin Core | Yes | >=29.1 | Blockchain data | Via NBXplorer |
| LND | Optional | >=0.19.3-beta | Lightning invoicing | Via action |
| Core Lightning | Optional | >=25.9.0 | Lightning invoicing | Via action |
| Monerod | Optional | >=0.18.4 | Monero payments | Via action |

Dependencies are dynamically resolved based on which features are enabled.

---

## Backups and Restore

**Included in backup:**

- `main` volume — all BTCPay data, database, NBXplorer state, plugins, configuration

**Restore behavior:**

- All data fully restored
- May need time for NBXplorer to catch up on recent blocks

---

## Health Checks

| Check | Display Name | Method | Messages |
|-------|--------------|--------|----------|
| PostgreSQL | (internal) | `pg_isready` on port 5432 | Ready / Waiting |
| NBXplorer | UTXO Tracker | Port 24444 listening | Reachable / Unreachable |
| UTXO Sync | UTXO Tracker Sync | NBXplorer `/v1/cryptos/BTC/status` | Synced / Bitcoin syncing X% / UTXO syncing X% |
| Web UI | Web Interface | `/api/v1/health` on port 23000 | Reachable / Unreachable |
| Shopify | Shopify Plugin | Port 5000 listening (when enabled) | Running / Not running |

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
upstream_version: 2.3.3
images:
  btcpay: btcpayserver/btcpayserver:2.3.3
  nbx: nicolasdorier/nbxplorer:2.6.0
  postgres: btcpayserver/postgres:13.23
  shopify: btcpayserver/shopify-app-deployer:1.5
architectures: [x86_64, aarch64]
volumes:
  main:
    btcpayserver: /datadir
    plugins: /root/.btcpayserver/Plugins
    nbxplorer: /root/.nbxplorer
    postgresql: /var/lib/postgresql
ports:
  ui: 23000
  nbxplorer: 24444 (internal)
  postgres: 5432 (internal)
  shopify: 5000 (internal, optional)
dependencies:
  bitcoind:
    required: true
    min_version: ">=29.1"
  lnd:
    required: false
    min_version: ">=0.19.3-beta"
  c-lightning:
    required: false
    min_version: ">=25.9.0"
  monerod:
    required: false
    min_version: ">=0.18.4"
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
backup_volumes:
  - main
startos_managed_config:
  BTCPAY_NETWORK: mainnet
  BTCPAY_BIND: 0.0.0.0:23000
  BTCPAY_SOCKSENDPOINT: startos:9050
  NBXPLORER_BTCNODEENDPOINT: bitcoind.startos:8333
  NBXPLORER_BTCRPCURL: http://bitcoind.startos:8332/
not_available:
  - Testnet/Signet networks
  - Redis caching
  - Docker Compose deployment
  - Multiple simultaneous Lightning nodes
```
