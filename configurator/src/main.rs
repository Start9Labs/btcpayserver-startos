struct Config {
    bitcoind: BitcoindConfig,
}

#[derive(serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum BitcoindConfig {
    #[serde(rename_all = "kebab-case")]
    Internal {
        rpc_host: IpAddr,
        rpc_user: IpAddr,
        rpc_password: String,
    },
    #[serde(rename_all = "kebab-case")]
    External {
        rpc_host: ,
        rpc_user: String,
        rpc_password: String,
        rpc_port: u16,
    },
    #[serde(rename_all = "kebab-case")]
    QuickConnect {
        #[serde(deserialize_with = "kebab-case")]
        quick_connect_url: Uri
    }
}

fn main() {

}
