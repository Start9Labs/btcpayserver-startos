DOC_ASSETS := $(shell find ./docs/assets)
BTCPAYSERVER_SRC := $(shell find ./btcpayserver)
NBXPLORER_SRC := $(shell find ./NBXplorer)
ACTIONS_SRC := $(shell find ./actions)
BTCPAYSERVER_GIT_REF := $(shell cat .git/modules/btcpayserver/HEAD)
BTCPAYSERVER_GIT_FILE := $(addprefix .git/modules/btcpayserver/,$(if $(filter ref:%,$(BTCPAYSERVER_GIT_REF)),$(lastword $(BTCPAYSERVER_GIT_REF)),HEAD))
CONFIGURATOR_SRC := $(shell find ./configurator/src) configurator/Cargo.toml configurator/Cargo.lock

.DELETE_ON_ERROR:

all: btcpayserver.s9pk

install: btcpayserver.s9pk
	appmgr install btcpayserver.s9pk

btcpayserver.s9pk: manifest.yaml config_spec.yaml config_rules.yaml image.tar instructions.md $(ACTIONS_SRC)
	appmgr -vv pack $(shell pwd) -o btcpayserver.s9pk
	appmgr -vv verify btcpayserver.s9pk

image.tar: docker_entrypoint.sh configurator/target/armv7-unknown-linux-musleabihf/release/configurator $(BTCPAYSERVER_GIT_FILE) $(NBXPLORER_SRC) Dockerfile
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/btcpayserver -o type=docker,dest=image.tar -f ./Dockerfile . 

configurator/target/armv7-unknown-linux-musleabihf/release/configurator: $(CONFIGURATOR_SRC)
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:armv7-musleabihf cargo +beta build --release
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:armv7-musleabihf musl-strip target/armv7-unknown-linux-musleabihf/release/configurator

instructions.md: docs/instructions.md $(DOC_ASSETS)
	cd docs && md-packer < instructions.md > ../instructions.md

clean:
	rm image.tar
