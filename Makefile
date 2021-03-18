ASSETS := $(shell yq e '.assets.[].src' manifest.yaml)
ASSET_PATHS := $(addprefix assets/,$(ASSETS))
VERSION_TAG := $(shell ./get_tag.sh)
VERSION := $(shell ./get_tag.sh | cut -c 2-)
MAJOR := $(shell echo $(VERSION) | cut -d. -f1)
MINOR := $(shell echo $(VERSION) | cut -d. -f2)
PATCH := $(shell echo $(VERSION) | cut -d. -f3)
BUILD := $(shell echo $(VERSION) | cut -d. -f4)
S9_VERSION := $(shell echo $(MAJOR).$(MINOR).$(PATCH))
BTCPAYSERVER_SRC := $(shell find ./btcpayserver)
ACTIONS_SRC := $(shell find ./actions)
BTCPAYSERVER_GIT_REF := $(shell cat .git/modules/btcpayserver/HEAD)
BTCPAYSERVER_GIT_FILE := $(addprefix .git/modules/btcpayserver/,$(if $(filter ref:%,$(BTCPAYSERVER_GIT_REF)),$(lastword $(BTCPAYSERVER_GIT_REF)),HEAD))
CONFIGURATOR_SRC := $(shell find ./configurator/src) configurator/Cargo.toml configurator/Cargo.lock

.DELETE_ON_ERROR:

all: btcpayserver.s9pk

install: btcpayserver.s9pk
	appmgr install btcpayserver.s9pk

btcpayserver.s9pk: manifest-version manifest.yaml config_spec.yaml config_rules.yaml instructions.md image.tar instructions.md $(ACTIONS_SRC) $(ASSET_PATHS)
	appmgr -vv pack $(shell pwd) -o btcpayserver.s9pk
	appmgr -vv verify btcpayserver.s9pk

instructions.md: README.md
	cp README.md instructions.md

image.tar: docker_entrypoint.sh configurator/target/armv7-unknown-linux-musleabihf/release/configurator $(BTCPAYSERVER_GIT_FILE) Dockerfile
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/btcpayserver -o type=docker,dest=image.tar -f ./Dockerfile . 

configurator/target/armv7-unknown-linux-musleabihf/release/configurator: $(CONFIGURATOR_SRC)
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:armv7-musleabihf cargo +beta build --release
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:armv7-musleabihf musl-strip target/armv7-unknown-linux-musleabihf/release/configurator

manifest-version: $(BTCPAYSERVER_GIT_FILE)
	$(info TAG VERSION is $(VERSION))
	$(info S9 VERSION is $(S9_VERSION))
	yq eval -i ".version = \"$(S9_VERSION)\"" manifest.yaml
	yq eval -i ".release-notes = \"This release corresponds to BTCPay Server build version $(BUILD) at tag version $(VERSION). See offical release notes here: https://github.com/btcpayserver/btcpayserver/releases/tag/$(VERSION_TAG)\"" manifest.yaml

instructions.md: docs/instructions.md $(DOC_ASSETS)
	cd docs && md-packer < instructions.md > ../instructions.md

clean:
	rm image.tar