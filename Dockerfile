FROM mcr.microsoft.com/dotnet/sdk:6.0.101-bullseye-slim AS nbx-builder
COPY NBXplorer/NBXplorer/NBXplorer.csproj NBXplorer/NBXplorer.csproj
COPY NBXplorer/NBXplorer.Client/NBXplorer.Client.csproj NBXplorer.Client/NBXplorer.Client.csproj
# Cache some dependencies
RUN cd NBXplorer && dotnet restore && cd ..
COPY NBXplorer .
RUN cd NBXplorer && \
  dotnet publish --output /app/ --configuration Release

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS actions-builder
WORKDIR /actions
COPY . .
RUN dotnet restore "actions/actions.csproj"
WORKDIR "/actions"
RUN dotnet build "actions/actions.csproj" -c Release -o /actions/build

FROM btcpayserver/btcpayserver:1.6.0-arm64v8

COPY --from=nbx-builder "/app" /nbxplorer
COPY --from=actions-builder "/actions/build" /actions

RUN apt-get update && \
  apt-get install -y sqlite3 libsqlite3-0 curl locales jq bc wget procps postgresql
RUN wget https://github.com/mikefarah/yq/releases/download/v4.6.3/yq_linux_arm.tar.gz -O - |\
  tar xz && mv yq_linux_arm /usr/bin/yq

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
ENV POSTGRES_HOST_AUTH_METHOD=trust
ENV POSTGRES_PASSWORD=postgres_password
ENV POSTGRES_USER=postgres_user
ENV NBXPLORER_AUTOMIGRATE=1
ENV NBXPLORER_POSTGRES="postgresql://postgres_user:postgres_password@localhost:5432"
ENV BTCPAY_EXPLORERPOSTGRES="postgresql://postgres_user:postgres_password@localhost:5432"

EXPOSE 23000 80
ADD ./configurator/target/aarch64-unknown-linux-musl/release/configurator /usr/local/bin/configurator
COPY ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
COPY assets/utils/btcpay-admin.sh  /usr/local/bin/btcpay-admin.sh
COPY assets/utils/health_check.sh /usr/local/bin/health_check.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/btcpay-admin.sh
RUN chmod a+x /usr/local/bin/health_check.sh
ADD ./migrations /usr/local/bin/migrations
RUN chmod a+x /usr/local/bin/migrations/*

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
