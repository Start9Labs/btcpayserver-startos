ASSETS := $(shell yq r manifest.yaml assets.*.src)
ASSET_PATHS := $(addprefix assets/,$(ASSETS))
VERSION := $(shell git --git-dir=btcpayserver/.git describe --tags)
VERSION_SIMPLE := $(shell echo $(VERSION) | sed -E 's/([0-9]+\.[0-9]+\.[0-9]+).*/\1/g' | cut -c 2-)
VERSION_TAG := $(shell git --git-dir=btcpayserver/.git describe --abbrev=0)
BTCPAYSERVER_SRC := $(shell find ./btcpayserver)
BTCPAYSERVER_GIT_REF := $(shell cat .git/modules/btcpayserver/HEAD)
BTCPAYSERVER_GIT_FILE := $(addprefix .git/modules/btcpayserver/,$(if $(filter ref:%,$(BTCPAYSERVER_GIT_REF)),$(lastword $(BTCPAYSERVER_GIT_REF)),HEAD))

.DELETE_ON_ERROR:

all: btcpayserver.s9pk

install: btcpayserver.s9pk
	appmgr install btcpayserver.s9pk

btcpayserver.s9pk: manifest.yaml config_spec.yaml config_rules.yaml image.tar instructions.md $(ASSET_PATHS)
	appmgr -vv pack $(shell pwd) -o btcpayserver.s9pk
	appmgr -vv verify btcpayserver.s9pk

instructions.md: README.md
	cp README.md instructions.md

image.tar: docker_entrypoint.sh
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build $(BTCPAYSERVER_SRC) --tag start9/btcpayserver --platform=linux/arm/v7 -o type=docker,dest=image.tar -f $(BTCPAYSERVER_SRC)/arm32v7.Dockerfile

manifest.yaml: $(BTCPAYSERVER_GIT_FILE)
	$(info VERSION_SIMPLE is $(VERSION_SIMPLE))
	yq eval -i ".version = \"$(VERSION_SIMPLE)\"" manifest.yaml
	yq eval -i ".release-notes = \"https://github.com/btcpayserver/btcpayserver/releases/tag/$(VERSION_TAG)\"" manifest.yaml

clean:
	rm image.tar