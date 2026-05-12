# Contributing

This repo packages [BTCPay Server](https://github.com/btcpayserver/btcpayserver) for StartOS, alongside its bundled NBXplorer UTXO tracker, PostgreSQL sidecar, and Shopify plugin deployer.

## Documentation — keep it in sync

- **`README.md`** — what this package is and how it's built (image, volumes, interfaces). For developers and AI assistants.
- **`instructions.md`** — the user-facing instructions packed into the `.s9pk` and shown on the **Instructions** tab in StartOS, for the person running the service.
- **`CONTRIBUTING.md`** — this file.
- **`CLAUDE.md`** — operating rules for AI developers working in this repo.

**Any code change that warrants it must update `README.md` and `instructions.md` in the same change** — a new or renamed action, an added or removed volume / port / interface / dependency, a changed default, a new limitation, any altered user-visible behavior. Don't defer: a package that ships with a stale README or stale instructions is not done, even if the code is perfect. Content rules live in the packaging guide: [Writing READMEs](https://docs.start9.com/packaging/writing-readmes.html) and [Writing Service Instructions](https://docs.start9.com/packaging/writing-instructions.html).

## Building

See the [StartOS Packaging Guide](https://docs.start9.com/packaging/) for environment setup, then:

```bash
npm ci    # install dependencies
make      # build the universal .s9pk
```

## Updating the upstream version

The package pulls **four** upstream images, each pinned as a `dockerTag` under `images` in `startos/manifest/index.ts`. They version independently and can be bumped on their own:

- `btcpay` — `btcpayserver/btcpayserver:<version>` (the main service)
- `nbx` — `nicolasdorier/nbxplorer:<version>` (UTXO tracker)
- `postgres` — `btcpayserver/postgres:<version>` (database)
- `shopify` — `btcpayserver/shopify-app-deployer:<version>` (Shopify plugin runtime)

To bump any of them:

1. Update the matching `dockerTag` in `startos/manifest/index.ts` to the new tag.
2. Update `version` and `releaseNotes` in the file under `startos/versions/`, renaming it to the new version string. A *new* version file is only needed when the bump carries an `up`/`down` migration, or when you want the old release notes preserved in git history — see [Versions](https://docs.start9.com/packaging/versions.html).
3. Rebuild (`make`), sideload the `.s9pk`, and confirm it starts and that the **UTXO Tracker Sync** and **Web Interface** health checks recover.
4. Review `README.md` and `instructions.md` for anything the bump changed.

When bumping BTCPay Server itself, check whether the release notes call for matching NBXplorer or PostgreSQL versions, and bump those tags in the same PR if so.

## How to contribute

1. Fork the repository and create a branch from `master`.
2. Make your changes — including the doc updates above.
3. Open a pull request to `master`.
