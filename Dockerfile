FROM nicolasdorier/nbxplorer:2.3.33-arm64v8 as nbx-builder

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS actions-builder
WORKDIR /actions
COPY . .
RUN dotnet restore "actions/actions.csproj"
WORKDIR "/actions"
RUN dotnet build "actions/actions.csproj" -c Release -o /actions/build

FROM btcpayserver/btcpayserver:1.6.6-arm64v8

COPY --from=nbx-builder "/app" /nbxplorer
COPY --from=actions-builder "/actions/build" /actions

# install package dependencies
RUN apt-get update && \
  apt-get install -y sqlite3 libsqlite3-0 curl locales jq bc wget procps postgresql-common postgresql-13 sudo xz-utils 
RUN wget https://github.com/mikefarah/yq/releases/download/v4.6.3/yq_linux_arm.tar.gz -O - |\
  tar xz && mv yq_linux_arm /usr/bin/yq

# install S6 overlay for proces mgmt
# https://github.com/just-containers/s6-overlay
ARG S6_OVERLAY_VERSION=3.1.1.2
#  needed to run s6-overlay
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz
# extract the necessary binaries from the s6 ecosystem
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-aarch64.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-aarch64.tar.xz
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-symlinks-arch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-symlinks-arch.tar.xz

# Adding services to the S6 overlay expected locations
COPY assets/s6-overlay/services /etc/s6-overlay/s6-rc.d
COPY assets/s6-overlay/contents.d/ /etc/s6-overlay/s6-rc.d/user/contents.d/

# various env setup
RUN locale-gen en_US.UTF-8
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
ENV BTCPAY_DATADIR=/datadir/btcpayserver
ENV NBXPLORER_DATADIR=/datadir/nbxplorer
RUN touch btcpay.log
ENV BTCPAY_DEBUGLOG=btcpay.log
ENV BTCPAY_ENABLE_SSH=false
ENV LC_ALL=C

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

EXPOSE 23000 80

# start9 specific steps
ADD ./configurator/target/aarch64-unknown-linux-musl/release/configurator /usr/local/bin/configurator
COPY ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
COPY assets/utils/btcpay-admin.sh  /usr/local/bin/btcpay-admin.sh
COPY assets/utils/health_check.sh /usr/local/bin/health_check.sh
COPY assets/utils/postgres-init.sh /etc/s6-overlay/script/postgres-init
COPY assets/utils/postgres-ready.sh /etc/s6-overlay/script/postgres-ready
COPY assets/utils/postgres-shutdown.sh /etc/cont-finish.d/postgres-shutdown
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/btcpay-admin.sh
RUN chmod a+x /usr/local/bin/health_check.sh
RUN chmod a+x /etc/s6-overlay/script/*
RUN chmod a+x /etc/cont-finish.d/*

ENTRYPOINT ["/init"]