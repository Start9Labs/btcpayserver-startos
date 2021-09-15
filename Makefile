EMVER := $(shell yq e ".version" manifest.yaml)
VERSION_TAG := $(shell git --git-dir=btcpayserver/.git describe --abbrev=0)
VERSION := $(VERSION_TAG:v%=%)
ASSET_PATHS := $(shell find ./assets/*)
DOC_ASSETS := $(shell find ./docs/assets)
BTCPAYSERVER_SRC := $(shell find ./btcpayserver)
NBXPLORER_SRC := $(shell find ./NBXplorer)
ACTIONS_SRC := $(shell find ./actions)
BTCPAYSERVER_GIT_REF := $(shell cat .git/modules/btcpayserver/HEAD)
BTCPAYSERVER_GIT_FILE := $(addprefix .git/modules/btcpayserver/,$(if $(filter ref:%,$(BTCPAYSERVER_GIT_REF)),$(lastword $(BTCPAYSERVER_GIT_REF)),HEAD))
CONFIGURATOR_SRC := $(shell find ./configurator/src) configurator/Cargo.toml configurator/Cargo.lock
S9PK_PATH=$(shell find . -name btcpayserver.s9pk -print)

.DELETE_ON_ERROR:

all: verify

verify: btcpayserver.s9pk $(S9PK_PATH)
	embassy-sdk verify $(S9PK_PATH)

btcpayserver.s9pk: manifest.yaml image.tar instructions.md $(ACTIONS_SRC) $(ASSET_PATHS)
	embassy-sdk pack

image.tar: docker_entrypoint.sh configurator/target/aarch64-unknown-linux-musl/release/configurator $(BTCPAYSERVER_GIT_FILE) $(NBXPLORER_SRC) Dockerfile
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --platform=linux/arm64/v8  --tag start9/btcpayserver/main:${EMVER} -o type=docker,dest=image.tar -f ./Dockerfile . 

configurator/target/aarch64-unknown-linux-musl/release/configurator: $(CONFIGURATOR_SRC)
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:aarch64-musl cargo +beta build --release
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:aarch64-musl musl-strip target/aarch64-unknown-linux-musl/release/configurator

instructions.md: docs/instructions.md $(DOC_ASSETS)
	cd docs && md-packer < instructions.md > ../instructions.md

clean:
	rm image.tar