# when using 4 digit semver (build and tag version) eg. 1.0.7.2
# git --git-dir=btcpayserver/.git name-rev --tags --name-only $(git --git-dir=btcpayserver/.git rev-parse HEAD) | sed 's|\([^\^]*\)\(\^0\)$|\1|g'

# when using standard semver eg. 1.1.0
cd btcpayserver && git describe --tags `git rev-list --tags --max-count=1` && cd ..