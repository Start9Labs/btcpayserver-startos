FROM mcr.microsoft.com/dotnet/core/sdk:3.1.202 AS nbx-builder
WORKDIR /source
COPY NBXplorer/NBXplorer/NBXplorer.csproj NBXplorer/NBXplorer.csproj
COPY NBXplorer/NBXplorer.Client/NBXplorer.Client.csproj NBXplorer.Client/NBXplorer.Client.csproj
# Cache some dependencies
RUN cd NBXplorer && dotnet restore && cd ..
COPY NBXplorer .
RUN cd NBXplorer && \
    dotnet publish --output /app/ --configuration Release

# Force the builder machine to take make an arm runtime image. This is fine as long as the builder does not run any program
# FROM mcr.microsoft.com/dotnet/core/aspnet:3.1.4-buster-slim-arm32v7
FROM btcpayserver/btcpayserver:1.0.6.8-arm32v7

WORKDIR /app
COPY --from=nbx-builder "/app" /nbxplorer

ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
ENV BTCPAY_DATADIR=/datadir/btcpayserver
ENV NBXPLORER_DATADIR=/datadir/nbxplorer
# removes default of NBX cookie auth
ENV NBXPLORER_NOAUTH=1 

EXPOSE 23000 80
ADD ./configurator/target/armv7-unknown-linux-musleabihf/release/configurator /usr/local/bin/configurator
COPY ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
