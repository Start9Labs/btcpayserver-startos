# Updating the upstream version

The wrapped application is **BTCPay Server**. Its complete release version supplies the upstream part of the StartOS version. The package pulls four images, each pinned as a `dockerTag` under `images` in `startos/manifest/index.ts`; NBXplorer, Postgres and the Shopify deployer are supporting components, not independent upstream-release triggers.

## Determining the upstream version

- **BTCPay Server** ([btcpayserver/btcpayserver](https://github.com/btcpayserver/btcpayserver)) — uses GitHub Releases. Strip the leading `v` for the `dockerTag`.

  ```sh
  gh api repos/btcpayserver/btcpayserver/tags --paginate --jq '.[].name'
  gh api repos/btcpayserver/btcpayserver/releases --paginate --jq '.[] | select(.draft == false and .prerelease == false) | .tag_name'
  ```

  Compare the complete stable application version against `images.btcpay.source.dockerTag` (`btcpayserver/btcpayserver:<version>`), not the wrapper revision. Confirm the exact Docker Hub tag is published for amd64 and arm64 before targeting it:

  ```sh
  curl -fsSL "https://hub.docker.com/v2/repositories/btcpayserver/btcpayserver/tags/<version>" \
    | jq '{name, tag_status, images: [.images[] | {architecture, os, status}]}'
  ```

  Read the release's impact before assigning the scrutiny tier: even a final-component bump can introduce breaking changes.

- **NBXplorer** ([btcpayserver/NBXplorer](https://github.com/btcpayserver/NBXplorer)) — tagged on GitHub but no Releases are published. Strip the leading `v` for the `dockerTag`. The Docker image is published as `nicolasdorier/nbxplorer`. (The older `dgarage/NBXplorer` URL still works but 301-redirects to `btcpayserver/NBXplorer`, which is the canonical home today.)

  ```sh
  gh api repos/btcpayserver/NBXplorer/tags --jq '.[0].name'
  ```

  Pin lives in `startos/manifest/index.ts` → `images.nbx.source.dockerTag` (`nicolasdorier/nbxplorer:<version>`).

- **Postgres** ([btcpayserver/dockerfile-deps](https://github.com/btcpayserver/dockerfile-deps)) — the `Postgres/<version>/` directory tree holds the Dockerfiles, but the GitHub repo isn't tagged or released per build; the published Docker Hub tags (including the build suffix, e.g. `18.1-1`) are the source of truth.

  ```sh
  curl -fsSL "https://hub.docker.com/v2/repositories/btcpayserver/postgres/tags?page_size=20&ordering=last_updated" \
    | jq -r '.results[].name' | grep -vE -- '-(amd64|arm32v7|arm64v8)$'
  ```

  (The `grep` strips per-arch tag variants; the multi-arch manifest tags like `18.1-1` are what we pin.) Pin lives in `startos/manifest/index.ts` → `images.postgres.source.dockerTag` (`btcpayserver/postgres:<version>`).

- **Shopify app deployer** ([btcpayserver/shopify-app](https://github.com/btcpayserver/shopify-app)) — tagged on GitHub but no Releases are published. The Docker image is published as `btcpayserver/shopify-app-deployer` and its tags track the GitHub tags.

  ```sh
  gh api repos/btcpayserver/shopify-app/tags --jq '.[0].name'
  ```

  Pin lives in `startos/manifest/index.ts` → `images.shopify.source.dockerTag` (`btcpayserver/shopify-app-deployer:<version>`).

## Applying the bump

Edit `images.btcpay.source.dockerTag` in `startos/manifest/index.ts` to the eligible BTCPay Server tag. Use the full version in `startos/versions/current.ts` with downstream revision `:0`.

Supporting image pins, when a BTCPay release or approved wrapper change requires them:

- BTCPay Server → `images.btcpay.source.dockerTag`
- NBXplorer → `images.nbx.source.dockerTag`
- Postgres → `images.postgres.source.dockerTag`
- Shopify app deployer → `images.shopify.source.dockerTag`

When bumping BTCPay Server itself, check whether the release notes call for matching NBXplorer or PostgreSQL versions, and bump those tags in the same PR if so.
