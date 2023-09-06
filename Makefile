PKG_ID := $(shell yq e ".id" manifest.yaml)
PKG_VERSION := $(shell yq e ".version" manifest.yaml)
UPSTREAM_VERSION :=$(shell ./utils/scripts/get_upstream_version.sh ${PKG_VERSION})
TS_FILES := $(shell find ./scripts -name '*.ts')
DOC_ASSETS := $(shell find ./docs/assets)
CONFIGURATOR_SRC := $(shell find ./configurator/src) configurator/Cargo.toml configurator/Cargo.lock
UTILS_SRC := $(shell find ./utils/**/*)

.DELETE_ON_ERROR:

all: verify

clean:
	rm -rf docker-images
	rm -f image.tar
	rm -f $(PKG_ID).s9pk
	rm -f js/*.js
	rm -f LICENSE
	rm -rf configurator/target

verify: $(PKG_ID).s9pk
	start-sdk verify s9pk $(PKG_ID).s9pk

# assumes /etc/embassy/config.yaml exists on local system with `host: "http://embassy-server-name.local"` configured
install: $(PKG_ID).s9pk
	start-cli package install $(PKG_ID).s9pk

$(PKG_ID).s9pk: manifest.yaml instructions.md LICENSE icon.png scripts/embassy.js docker-images/aarch64.tar docker-images/x86_64.tar
	start-sdk pack

docker-images/x86_64.tar: configurator/target/x86_64-unknown-linux-musl/release/configurator $(UTILS_SRC) Dockerfile
ifeq ($(ARCH),aarch64)
else
	mkdir -p docker-images
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --platform=linux/amd64 --tag start9/btcpayserver/main:$(PKG_VERSION) --build-arg ARCH=x86_64 --build-arg PLATFORM=amd64 -o type=docker,dest=docker-images/x86_64.tar -f ./Dockerfile .
endif

docker-images/aarch64.tar: configurator/target/aarch64-unknown-linux-musl/release/configurator $(UTILS_SRC) Dockerfile
ifeq ($(ARCH),x86_64)
else
	mkdir -p docker-images
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --platform=linux/arm64/v8 --tag start9/btcpayserver/main:$(PKG_VERSION) --build-arg ARCH=aarch64 --build-arg PLATFORM=arm64 -o type=docker,dest=docker-images/aarch64.tar -f ./Dockerfile .
endif

configurator/target/aarch64-unknown-linux-musl/release/configurator: $(CONFIGURATOR_SRC)
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:aarch64-musl cargo build --release --config net.git-fetch-with-cli=true

configurator/target/x86_64-unknown-linux-musl/release/configurator: $(CONFIGURATOR_SRC)
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:x86_64-musl cargo build --release --config net.git-fetch-with-cli=true

instructions.md: docs/instructions.md $(DOC_ASSETS)
	cd docs && md-packer < instructions.md > ../instructions.md

scripts/embassy.js: $(TS_FILES)
	deno bundle scripts/embassy.ts scripts/embassy.js

LICENSE:
	wget https://raw.githubusercontent.com/btcpayserver/btcpayserver/v$(UPSTREAM_VERSION)/LICENSE -O - > LICENSE