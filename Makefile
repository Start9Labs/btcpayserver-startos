PACKAGE_ID := $(shell grep -o "id: '[^']*'" startos/manifest.ts | sed "s/id: '\([^']*\)'/\1/")
DOC_ASSETS := $(shell find ./docs)

# Phony targets
.PHONY: all clean install

# Default target
all: ${PACKAGE_ID}.s9pk
	@echo " Done!"
	@echo "   Filesize: $(shell du -h $(PACKAGE_ID).s9pk) is ready"

# Build targets
${PACKAGE_ID}.s9pk: $(shell start-cli s9pk list-ingredients)
	start-cli s9pk pack

javascript/index.js: $(shell find startos -name "*.ts") tsconfig.json node_modules package.json
	npm run build

node_modules: package.json package-lock.json
	npm ci

package-lock.json: package.json
	npm i

instructions.md: $(DOC_ASSETS)
	cd docs && md-packer < instructions.md > ../instructions.md

# Clean target
clean:
	rm -rf ${PACKAGE_ID}.s9pk
	rm -rf javascript
	rm -rf node_modules

# Install target
install:
	@if [ ! -f ~/.startos/config.yaml ]; then echo "You must define \"host: http://server-name.local\" in ~/.startos/config.yaml config file first."; exit 1; fi
	@echo "\nInstalling to $$(grep -v '^#' ~/.startos/config.yaml | cut -d'/' -f3) ...\n"
	@[ -f $(PACKAGE_ID).s9pk ] || ( $(MAKE) && echo "\nInstalling to $$(grep -v '^#' ~/.startos/config.yaml | cut -d'/' -f3) ...\n" )
	@start-cli package install -s $(PACKAGE_ID).s9pk