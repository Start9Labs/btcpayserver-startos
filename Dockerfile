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

FROM btcpayserver/btcpayserver:1.4.7-arm64v8

COPY --from=nbx-builder "/app" /nbxplorer
COPY --from=actions-builder "/actions/build" /actions

RUN apt-get update && \
    apt-get install -y sqlite3 libsqlite3-0 curl locales jq bc wget procps
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

EXPOSE 23000 80
ADD ./configurator/target/aarch64-unknown-linux-musl/release/configurator /usr/local/bin/configurator
COPY ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
COPY assets/utils/btcpay-admin.sh  /usr/local/bin/btcpay-admin.sh
COPY assets/utils/health_check.sh /usr/local/bin/health_check.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/btcpay-admin.sh
RUN chmod a+x /usr/local/bin/health_check.sh
ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
