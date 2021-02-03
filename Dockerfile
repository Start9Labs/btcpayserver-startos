# This is a manifest image, will pull the image with the same arch as the builder machine
FROM mcr.microsoft.com/dotnet/core/sdk:3.1.202 AS btcpay-builder
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
RUN apt-get update \
	&& apt-get install -qq --no-install-recommends qemu qemu-user-static qemu-user binfmt-support

WORKDIR /source
COPY btcpayserver/nuget.config nuget.config
COPY btcpayserver/Build/Common.csproj Build/Common.csproj
COPY btcpayserver/BTCPayServer.Abstractions/BTCPayServer.Abstractions.csproj BTCPayServer.Abstractions/BTCPayServer.Abstractions.csproj
COPY btcpayserver/BTCPayServer/BTCPayServer.csproj BTCPayServer/BTCPayServer.csproj
COPY btcpayserver/BTCPayServer.Common/BTCPayServer.Common.csproj BTCPayServer.Common/BTCPayServer.Common.csproj
COPY btcpayserver/BTCPayServer.Rating/BTCPayServer.Rating.csproj BTCPayServer.Rating/BTCPayServer.Rating.csproj
COPY btcpayserver/BTCPayServer.Data/BTCPayServer.Data.csproj BTCPayServer.Data/BTCPayServer.Data.csproj
COPY btcpayserver/BTCPayServer.Client/BTCPayServer.Client.csproj BTCPayServer.Client/BTCPayServer.Client.csproj
RUN cd BTCPayServer && dotnet restore
COPY btcpayserver/BTCPayServer.Common/. BTCPayServer.Common/.
COPY btcpayserver/BTCPayServer.Rating/. BTCPayServer.Rating/.
COPY btcpayserver/BTCPayServer.Data/. BTCPayServer.Data/.
COPY btcpayserver/BTCPayServer.Client/. BTCPayServer.Client/.
COPY btcpayserver/BTCPayServer.Abstractions/. BTCPayServer.Abstractions/.
COPY btcpayserver/BTCPayServer/. BTCPayServer/.
COPY btcpayserver/Build/Version.csproj Build/Version.csproj
ARG CONFIGURATION_NAME=Release
RUN cd BTCPayServer && dotnet publish --output /app/ --configuration ${CONFIGURATION_NAME}

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
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1.4-buster-slim-arm32v7
COPY --from=btcpay-builder /usr/bin/qemu-arm-static /usr/bin/qemu-arm-static
RUN apt-get update && apt-get install -y --no-install-recommends iproute2 openssh-client \
    && rm -rf /var/lib/apt/lists/*

ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8

WORKDIR /datadir
WORKDIR /app
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
ENV BTCPAY_DATADIR=/datadir/btcpayserver
ENV NBXPLORER_DATADIR=/datadir/nbxplorer

VOLUME /datadir

COPY --from=nbx-builder "/app" ./nbxplorer
COPY --from=btcpay-builder "/app" ./btcpayserver

COPY ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
