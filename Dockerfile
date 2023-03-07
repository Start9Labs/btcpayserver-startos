FROM nicolasdorier/nbxplorer:2.3.62 as nbx-builder

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS actions-builder
WORKDIR /actions
COPY . .
RUN dotnet restore "utils/actions/actions.csproj"
WORKDIR "/actions"
RUN dotnet build "utils/actions/actions.csproj" -c Release -o /actions/build

FROM btcpayserver/btcpayserver:1.8.2

COPY --from=nbx-builder "/app" /nbxplorer
COPY --from=actions-builder "/actions/build" /actions

# arm64 or amd64
ARG PLATFORM
# aarch64 or x86_64
ARG ARCH

# install package dependencies
RUN apt-get update && \
  apt-get install -y sqlite3 libsqlite3-0 curl locales jq bc wget procps postgresql-common postgresql-13 xz-utils nginx vim
RUN wget https://github.com/mikefarah/yq/releases/download/v4.6.3/yq_linux_${PLATFORM}.tar.gz -O - |\
  tar xz && mv yq_linux_${PLATFORM} /usr/bin/yq

# install S6 overlay for proces mgmt
# https://github.com/just-containers/s6-overlay
ARG S6_OVERLAY_VERSION=3.1.2.1
#  needed to run s6-overlay
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz
# extract the necessary binaries from the s6 ecosystem
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-${ARCH}.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-${ARCH}.tar.xz
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-symlinks-arch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-symlinks-arch.tar.xz

# Adding services to the S6 overlay expected locations
COPY utils/s6-overlay/services /etc/s6-overlay/s6-rc.d
COPY utils/s6-overlay/contents.d/ /etc/s6-overlay/s6-rc.d/user/contents.d/

# various env setup
ENV S6_BEHAVIOUR_IF_STAGE2_FAILS 2
ENV S6_CMD_WAIT_FOR_SERVICES_MAXTIME 0
RUN locale-gen en_US.UTF-8
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
ENV BTCPAY_DATADIR=/datadir/btcpayserver
ENV NBXPLORER_DATADIR=/datadir/nbxplorer
RUN touch btcpay.log
ENV BTCPAY_DEBUGLOG=btcpay.log
ENV BTCPAY_ENABLE_SSH=false
ENV LC_ALL=C
ENV BTCPAY_PROTOCOL=https
ENV REVERSEPROXY_HTTP_PORT=80
ENV REVERSEPROXY_HTTPS_PORT=443
ENV REVERSEPROXY_DEFAULT_HOST=none

# postgres setup
RUN groupadd -r postgres --gid=999; \
  useradd -r -g postgres --gid=999 --home-dir=/var/lib/postgresql --shell=/bin/bash postgres; \
  mkdir -p /var/lib/postgresql; \
  chown -R postgres:postgres /var/lib/postgresql
RUN mkdir -p /var/run/postgresql && chown -R postgres:postgres /var/run/postgresql && chmod 2777 /var/run/postgresql

# project specific postgres env vars
ENV POSTGRES_HOST_AUTH_METHOD=trust
ENV NBXPLORER_AUTOMIGRATE=1
ENV NBXPLORER_POSTGRES="User ID=postgres;Host=localhost;Port=5432;Application Name=nbxplorer;Database=nbxplorer"
ENV BTCPAY_EXPLORERPOSTGRES="User ID=postgres;Host=localhost;Port=5432;Application Name=nbxplorer;Database=nbxplorer"
ENV BTCPAY_POSTGRES="User ID=postgres;Host=localhost;Port=5432;Application Name=btcpayserver;Database=btcpayserver"

EXPOSE 23000 80

# start9 specific steps
ADD ./configurator/target/${ARCH}-unknown-linux-musl/release/configurator /usr/local/bin/configurator
COPY utils/scripts/btcpay-admin.sh  /usr/local/bin/btcpay-admin.sh
COPY utils/scripts/health_check.sh /usr/local/bin/health_check.sh
COPY utils/nginx.conf /etc/nginx/sites-available/default
COPY utils/scripts/postgres-init.sh /etc/s6-overlay/script/postgres-init
COPY utils/scripts/postgres-ready.sh /etc/s6-overlay/script/postgres-ready
COPY utils/scripts/postgres-shutdown.sh /etc/cont-finish.d/postgres-shutdown
RUN chmod a+x /usr/local/bin/btcpay-admin.sh /usr/local/bin/health_check.sh /etc/s6-overlay/script/* /etc/cont-finish.d/*

# s6-overlay initialization
ENTRYPOINT ["/init"]