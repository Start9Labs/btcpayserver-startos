ASSETS := $(shell yq e '.assets.[].src' manifest.yaml)
ASSET_PATHS := $(addprefix assets/,$(ASSETS))
VERSION := $(shell git --git-dir=btcpayserver/.git describe --tags)
VERSION_SIMPLE := $(shell echo $(VERSION) | sed -E 's/([0-9]+\.[0-9]+\.[0-9]+).*/\1/g' | cut -c 2-)
VERSION_TAG := $(shell git --git-dir=btcpayserver/.git describe --abbrev=0)
BTCPAYSERVER_SRC := $(shell find ./btcpayserver)
BTCPAYSERVER_GIT_REF := $(shell cat .git/modules/btcpayserver/HEAD)
BTCPAYSERVER_GIT_FILE := $(addprefix .git/modules/btcpayserver/,$(if $(filter ref:%,$(BTCPAYSERVER_GIT_REF)),$(lastword $(BTCPAYSERVER_GIT_REF)),HEAD))
CONFIGURATOR_SRC := $(shell find ./configurator/src) configurator/Cargo.toml configurator/Cargo.lock

.DELETE_ON_ERROR:

all: btcpayserver.s9pk

install: btcpayserver.s9pk
	appmgr install btcpayserver.s9pk

btcpayserver.s9pk: manifest.yaml config_spec.yaml config_rules.yaml image.tar instructions.md $(ASSET_PATHS)
	appmgr -vv pack $(shell pwd) -o btcpayserver.s9pk
	appmgr -vv verify btcpayserver.s9pk

instructions.md: README.md
	cp README.md instructions.md

image.tar: docker_entrypoint.sh configurator/target/armv7-unknown-linux-musleabihf/release/configurator $(BTCPAYSERVER_GIT_FILE) Dockerfile
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/btcpayserver -o type=docker,dest=image.tar -f ./Dockerfile . 

configurator/target/armv7-unknown-linux-musleabihf/release/configurator: $(CONFIGURATOR_SRC)
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:armv7-musleabihf cargo +beta build --release
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:armv7-musleabihf musl-strip target/armv7-unknown-linux-musleabihf/release/configurator

manifest.yaml: $(BTCPAYSERVER_GIT_FILE)
	$(info VERSION_SIMPLE is $(VERSION_SIMPLE))
	yq eval -i ".version = \"$(VERSION_SIMPLE)\"" manifest.yaml
	yq eval -i ".release-notes = \"https://github.com/btcpayserver/btcpayserver/releases/tag/$(VERSION_TAG)\"" manifest.yaml

clean:
	rm image.tar
