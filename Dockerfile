FROM mcr.microsoft.com/dotnet/core/sdk:3.1.202 AS nbx-builder
COPY NBXplorer/NBXplorer/NBXplorer.csproj NBXplorer/NBXplorer.csproj
COPY NBXplorer/NBXplorer.Client/NBXplorer.Client.csproj NBXplorer.Client/NBXplorer.Client.csproj
# Cache some dependencies
RUN cd NBXplorer && dotnet restore && cd ..
COPY NBXplorer .
RUN cd NBXplorer && \
    dotnet publish --output /app/ --configuration Release

FROM mcr.microsoft.com/dotnet/core/sdk:3.1.202 AS actions-builder
WORKDIR /actions
RUN ls
COPY . .
RUN dotnet restore "actions/actions.csproj"
WORKDIR "/actions"
RUN dotnet build "actions/actions.csproj" -c Release -o /actions/build

FROM btcpayserver/btcpayserver:1.0.6.8-arm32v7

COPY --from=nbx-builder "/app" /nbxplorer
COPY --from=actions-builder "/actions/build" /actions

RUN apt-get update && \
    apt-get install -y sqlite3 libsqlite3-0

ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
ENV BTCPAY_DATADIR=/datadir/btcpayserver
ENV NBXPLORER_DATADIR=/datadir/nbxplorer
# removes default of NBX cookie auth
ENV NBXPLORER_NOAUTH=1 

EXPOSE 23000 80
ADD ./configurator/target/armv7-unknown-linux-musleabihf/release/configurator /usr/local/bin/configurator
COPY ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
COPY actions/btcpay-admin.sh  /usr/local/bin/btcpay-admin.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/btcpay-admin.sh
ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
