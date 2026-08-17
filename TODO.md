# TODO

- [ ] **Move BTCPay Server back to `btcpayserver/btcpayserver` when 2.4.3 is published.** `2.4.3:0` pins the `btcpayserver-internal:2.4.3-rc5` prerelease image under a plain `2.4.3` version string, to carry rc5's security fixes ahead of upstream's release. It is a one-off; unwinding it puts the package back on the standard flow `UPDATING.md` describes:
  - `startos/manifest/index.ts` → `images.btcpay.source.dockerTag` = `btcpayserver/btcpayserver:2.4.3`
  - `startos/versions/current.ts` → `2.4.3:1`
  - `README.md` → the two `btcpayserver/btcpayserver-internal` mentions (Images table, packaging summary)
