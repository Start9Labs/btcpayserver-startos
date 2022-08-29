EMVER := $(shell yq e ".version" manifest.yaml)
VERSION_TAG := $(shell git --git-dir=btcpayserver/.git describe --abbrev=0)
VERSION := $(VERSION_TAG:v%=%)
UTILS_ASSET_PATHS := $(shell find ./assets/utils/*)
DOC_ASSETS := $(shell find ./docs/assets)
BTCPAYSERVER_SRC := $(shell find ./btcpayserver/BTCPayServer/**/*.cs)
NBXPLORER_SRC := $(shell find ./NBXplorer)
ACTIONS_SRC := $(shell find ./actions)
BTCPAYSERVER_GIT_REF := $(shell cat .git/modules/btcpayserver/HEAD)
BTCPAYSERVER_GIT_FILE := $(addprefix .git/modules/btcpayserver/,$(if $(filter ref:%,$(BTCPAYSERVER_GIT_REF)),$(lastword $(BTCPAYSERVER_GIT_REF)),HEAD))
CONFIGURATOR_SRC := $(shell find ./configurator/src) configurator/Cargo.toml configurator/Cargo.lock
S9PK_PATH=$(shell find . -name btcpayserver.s9pk -print)
SCRIPTS_SRC := $(shell find ./scripts -name '*.ts')
S6_SRC := $(shell find ./assets/s6-overlay)

.DELETE_ON_ERROR:

all: verify

clean:
	rm image.tar
	rm btcpayserver.s9pk

verify: btcpayserver.s9pk $(S9PK_PATH)
	embassy-sdk verify s9pk $(S9PK_PATH)

btcpayserver.s9pk: manifest.yaml image.tar instructions.md LICENSE icon.png scripts/embassy.js
	embassy-sdk pack

image.tar: configurator/target/aarch64-unknown-linux-musl/release/configurator $(BTCPAYSERVER_GIT_FILE) $(NBXPLORER_SRC) $(BTCPAYSERVER_SRC) $(ACTIONS_SRC) $(UTILS_ASSET_PATHS) $(S6_SRC) Dockerfile
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --platform=linux/arm64/v8 --tag start9/btcpayserver/main:${EMVER} -o type=docker,dest=image.tar -f ./Dockerfile .

configurator/target/aarch64-unknown-linux-musl/release/configurator: $(CONFIGURATOR_SRC)
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:aarch64-musl cargo +beta build --release

instructions.md: docs/instructions.md $(DOC_ASSETS)
	cd docs && md-packer < instructions.md > ../instructions.md

scripts/embassy.js: $(SCRIPTS_SRC)
	deno bundle scripts/embassy.ts scripts/embassy.js
