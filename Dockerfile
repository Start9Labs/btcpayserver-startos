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
# RUN dotnet add package Microsoft.AspNetCore.Cryptography.KeyDerivation
RUN dotnet restore "actions/actions.csproj"
WORKDIR "/actions"
RUN dotnet build "actions/actions.csproj" -c Release -o /actions/build
# RUN cd actions && \
#     dotnet build -c Release actions.csproj
    # dotnet publish --output /actions/ --configuration Release

# FROM mcr.microsoft.com/dotnet/core/sdk:3.1.202 AS actions-builder
# RUN apt-get update
# RUN apt-get install -y mono-complete
# COPY actions/HashPassword.cs /actions/
# WORKDIR /actions
# RUN mcs -out:hashpw.exe HashPassword.cs 
# # COPY hashpw.exe .

FROM btcpayserver/btcpayserver:1.0.6.8-arm32v7

COPY --from=nbx-builder "/app" /nbxplorer
COPY --from=actions-builder "/actions/build" /actions

RUN apt-get update
# RUN apt-get install -y mono-complete
# COPY actions/HashPassword.cs /actions/
# WORKDIR /actions
# RUN mcs -out:hashpw.exe HashPassword.cs

# # install .NET Core SDKs for arm32v7
# RUN apt-get update \
#     && apt install unzip \
#     && curl -SL --output dotnet.zip https://download.visualstudio.microsoft.com/download/pr/1da22475-2333-4c5e-9a2f-4c6d70655aa3/d97a4b99465e69b1738c17895197a455/dotnet-sdk-3.1.406-win-arm.zip \
#     && unzip dotnet.zip

# RUN apt-get install -y snapd
# RUN curl -SL --output sdk.tar.gz https://download.visualstudio.microsoft.com/download/pr/9863a55b-2577-49d3-9888-ab853a4201cb/3110704f3265713f8d82aab157a23ed2/dotnet-sdk-3.1.406-linux-arm.tar.gz
# RUN mkdir /sdk
# ENV DOTNET_FILE=sdk.tar.gz
# ENV DOTNET_ROOT=$HOME/dotnet
# RUN mkdir -p "$DOTNET_ROOT" && tar zxf "$DOTNET_FILE" -C "$DOTNET_ROOT"
# ENV PATH=$PATH:$DOTNET_ROOT


# # COPY /dotnet/sdk /usr/share/dotnet/sdk
# RUN dotnet --info
# # curl -SL --output framework.tar.gz https://aka.ms/dotnet-core-applaunch?framework=Microsoft.NETCore.App&framework_version=3.1.12&arch=arm&rid=debian.10-arm && tar -ozxf framework.tar.gz -C /framework

# RUN apt-get update
RUN apt-get install -y sqlite3 libsqlite3-0

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
# COPY actions/actions.exe  /usr/local/bin/actions.exe
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/btcpay-admin.sh
# RUN chmod a+x /usr/local/bin/actions.exe
ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
