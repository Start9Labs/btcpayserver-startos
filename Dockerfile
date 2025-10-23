FROM btcpayserver/monero:0.18.3.4 AS monero-wallet-rpc
FROM nicolasdorier/nbxplorer:2.5.26 AS nbx-builder
FROM btcpayserver/shopify-app-deployer:1.3 AS shopify-app

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim AS actions-builder
ARG TARGETARCH
WORKDIR /actions
COPY . .
RUN dotnet restore "utils/actions/actions.csproj" -a $TARGETARCH
WORKDIR "/actions"
RUN dotnet build "utils/actions/actions.csproj" -c Release -a $TARGETARCH -o /actions/build

FROM btcpayserver/btcpayserver:2.2.1

COPY --from=nbx-builder "/app" /nbxplorer
COPY --from=actions-builder "/actions/build" /actions
COPY --from=monero-wallet-rpc "/usr/local/bin/monero-wallet-rpc" /usr/local/bin/
COPY --from=shopify-app "/app" /shopify-app

# arm64 or amd64
ARG PLATFORM
# aarch64 or x86_64
ARG ARCH

# install package dependencies
RUN sed -i "s|http://|https://|g" /etc/apt/sources.list.d/debian.sources
RUN apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y sqlite3 libsqlite3-0 curl locales jq bc wget procps xz-utils nginx vim git \
  && mkdir -p /usr/share/postgresql-common/pgdg \
  && curl -so /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc \
  && sh -c 'echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" > /etc/apt/sources.list.d/pgdg.list' \
  && apt-get update && apt-get install -y postgresql-13 \
  && wget https://github.com/mikefarah/yq/releases/download/v4.6.3/yq_linux_${PLATFORM}.tar.gz -O - |\
  tar xz && mv yq_linux_${PLATFORM} /usr/bin/yq \
  && apt-get -y autoremove \
  && apt-get clean autoclean \
  && rm -rf /var/lib/apt/lists/*

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Download and install NVM & Node.js
ENV NODE_VERSION=18.20.7
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash \
  && source $HOME/.nvm/nvm.sh \
  && nvm install $NODE_VERSION \
  && nvm use --delete-prefix $NODE_VERSION \
  && ln -s "$HOME/.nvm/versions/node/v$NODE_VERSION/bin/node" "/usr/local/bin/node" \
  && ln -s "$HOME/.nvm/versions/node/v$NODE_VERSION/bin/node" "/usr/bin/node" \
  && ln -s "$HOME/.nvm/versions/node/v$NODE_VERSION/bin/npm" "/usr/bin/npm" \
  && npm install -g npm \
  && npm install -g @shopify/cli@3.75.3 \
  && ln -s "$HOME/.nvm/versions/node/v$NODE_VERSION/bin/shopify" "/usr/local/bin/shopify"

# install S6 overlay for proces mgmt
# https://github.com/just-containers/s6-overlay
ARG S6_OVERLAY_VERSION=3.1.2.1
#  needed to run s6-overlay
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
# extract the necessary binaries from the s6 ecosystem
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-${ARCH}.tar.xz /tmp
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-symlinks-arch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz && \
  tar -C / -Jxpf /tmp/s6-overlay-${ARCH}.tar.xz && \
  tar -C / -Jxpf /tmp/s6-overlay-symlinks-arch.tar.xz

# Adding services to the S6 overlay expected locations
COPY utils/s6-overlay/services /etc/s6-overlay/s6-rc.d
COPY utils/s6-overlay/contents.d/ /etc/s6-overlay/s6-rc.d/user/contents.d/

# various env setup
RUN locale-gen en_US.UTF-8 && touch btcpay.log
ENV S6_BEHAVIOUR_IF_STAGE2_FAILS=2 \ 
  S6_CMD_WAIT_FOR_SERVICES_MAXTIME=0 \
  DOTNET_CLI_TELEMETRY_OPTOUT=1 \
  BTCPAY_DATADIR=/datadir/btcpayserver \
  NBXPLORER_DATADIR=/datadir/nbxplorer \
  BTCPAY_DEBUGLOG=btcpay.log \
  BTCPAY_ENABLE_SSH=false \
  LC_ALL=C \
  BTCPAY_PROTOCOL=https \
  REVERSEPROXY_HTTP_PORT=80 \
  REVERSEPROXY_HTTPS_PORT=443 \
  REVERSEPROXY_DEFAULT_HOST=none \
  BTCPAY_DOCKERDEPLOYMENT=false \
  BTCPAY_PLUGINDIR=/datadir/plugins

# postgres setup
#RUN useradd -r -g postgres --home-dir=/var/lib/postgresql --shell=/bin/bash postgres; \
RUN  mkdir -p /var/lib/postgresql; \
  chown -R postgres:postgres /var/lib/postgresql; \
  mkdir -p /var/run/postgresql; \
  chown -R postgres:postgres /var/run/postgresql; \
  chmod 2770 /var/run/postgresql;

# monero setup
RUN groupadd -r monero --gid=302340; \
  useradd -r -g monero --uid=30236 --gid=302340 -M --home-dir=/dev/null --shell=/sbin/nologin monero

# project specific postgres env vars
ENV POSTGRES_HOST_AUTH_METHOD=trust \
  NBXPLORER_POSTGRES="User ID=postgres;Host=localhost;Port=5432;Application Name=nbxplorer;Database=nbxplorer" \
  BTCPAY_EXPLORERPOSTGRES="User ID=postgres;Host=localhost;Port=5432;Application Name=nbxplorer;Database=nbxplorer" \
  BTCPAY_POSTGRES="User ID=postgres;Host=localhost;Port=5432;Application Name=btcpayserver;Database=btcpayserver" \
  BTCPAY_SHOPIFY_PLUGIN_DEPLOYER="http://localhost:5000/"

# start9 specific steps
ADD ./configurator/target/${ARCH}-unknown-linux-musl/release/configurator /usr/local/bin/configurator
COPY utils/scripts/btcpay-admin.sh  /usr/local/bin/btcpay-admin.sh
COPY utils/scripts/health_check.sh /usr/local/bin/health_check.sh
COPY utils/config/nginx.conf /etc/nginx/sites-available/default
COPY utils/config/monero-wallet-rpc.btcpayserver.conf.template /etc/
COPY utils/scripts/postgres-init.sh /etc/s6-overlay/script/postgres-init
COPY utils/scripts/postgres-ready.sh /etc/s6-overlay/script/postgres-ready
COPY utils/scripts/postgres-shutdown.sh /etc/cont-finish.d/postgres-shutdown
COPY utils/scripts/notifier.sh /usr/local/bin/notifier.sh
RUN chmod a+x /usr/local/bin/btcpay-admin.sh /usr/local/bin/health_check.sh /etc/s6-overlay/script/* /etc/cont-finish.d/* /usr/local/bin/notifier.sh

# s6-overlay initialization
ENTRYPOINT ["/init"]