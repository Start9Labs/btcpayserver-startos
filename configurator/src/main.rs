use std::io::Write;
use std::{
    fs::{self, File},
    path::Path,
};

use anyhow::Context;
use http::Uri;
use serde::{
    de::{Deserializer, Error as DeserializeError, Unexpected},
    Deserialize,
};

fn deserialize_parse<'de, D: Deserializer<'de>, T: std::str::FromStr>(
    deserializer: D,
) -> Result<T, D::Error> {
    let s: String = Deserialize::deserialize(deserializer)?;
    s.parse()
        .map_err(|_| DeserializeError::invalid_value(Unexpected::Str(&s), &"a valid URI"))
}

fn parse_quick_connect_url(url: Uri) -> Result<(String, String, String, u16), anyhow::Error> {
    let auth = url
        .authority()
        .ok_or_else(|| anyhow::anyhow!("invalid Quick Connect URL"))?;
    let mut auth_split = auth.as_str().split(|c| c == ':' || c == '@');
    let user = auth_split
        .next()
        .ok_or_else(|| anyhow::anyhow!("missing user"))?;
    let pass = auth_split
        .next()
        .ok_or_else(|| anyhow::anyhow!("missing pass"))?;
    let host = url.host().unwrap();
    let port = url.port_u16().unwrap_or(8332);
    Ok((user.to_owned(), pass.to_owned(), host.to_owned(), port))
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "kebab-case")]
struct Config {
    tor_address: String,
    bitcoin: BitcoindConfig,
    lightning: LightningConfig,
}

#[derive(serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum LightningConfig {
    #[serde(rename_all = "kebab-case")]
    None,
    #[serde(rename_all = "kebab-case")]
    Lnd,
    #[serde(rename_all = "kebab-case")]
    CLightning,
}
#[derive(serde::Deserialize)]
#[serde(rename_all = "kebab-case")]
struct BitcoindConfig {
    bitcoind_rpc: BitcoindRPCConfig,
    bitcoind_p2p: BitcoindP2PConfig,
}

#[derive(serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum BitcoindRPCConfig {
    #[serde(rename_all = "kebab-case")]
    Internal {
        rpc_user: String,
        rpc_password: String,
    },
    #[serde(rename_all = "kebab-case")]
    InternalProxy {
        rpc_user: String,
        rpc_password: String,
    },
}
#[derive(serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum BitcoindP2PConfig {
    #[serde(rename_all = "kebab-case")]
    Internal {},
    #[serde(rename_all = "kebab-case")]
    External {
        #[serde(deserialize_with = "deserialize_parse")]
        p2p_host: Uri,
        p2p_port: u16,
    },
}
#[derive(serde::Serialize)]
pub struct Property<T> {
    #[serde(rename = "type")]
    value_type: &'static str,
    value: T,
    description: Option<String>,
    copyable: bool,
    qr: bool,
    masked: bool,
}

fn main() -> Result<(), anyhow::Error> {
    fs::create_dir_all("/datadir/nbxplorer/Main/")?;
    fs::create_dir_all("/datadir/btcpayserver/Main/")?;
    let config: Config = serde_yaml::from_reader(
        File::open("/datadir/start9/config.yaml").with_context(|| "/datadir/start9/config.yaml")?,
    )?;
    let tor_address = config.tor_address;
    let mut nbx_config = File::create("/datadir/nbxplorer/Main/settings.config")
        .with_context(|| "/datadir/nbxplorer/mainnet/settings.config")?;
    let mut btcpay_config = File::create("/datadir/btcpayserver/Main/settings.config")
        .with_context(|| "/datadir/btcpayserver/btcpay.config")?;
    let (bitcoind_rpc_user, bitcoind_rpc_pass, bitcoind_rpc_host, bitcoind_rpc_port) =
        match config.bitcoin.bitcoind_rpc {
            BitcoindRPCConfig::Internal {
                rpc_user,
                rpc_password,
            } => (rpc_user, rpc_password, "bitcoind.embassy".to_string(), 8332),
            BitcoindRPCConfig::InternalProxy {
                rpc_user,
                rpc_password,
            } => (
                rpc_user,
                rpc_password,
                "btc-rpc-proxy.embassy".to_string(),
                8332,
            ),
        };
    let (bitcoind_p2p_host, bitcoind_p2p_port) = match config.bitcoin.bitcoind_p2p {
        BitcoindP2PConfig::Internal {} => ("bitcoind.embassy".to_string(), 8333),
        BitcoindP2PConfig::External { p2p_host, p2p_port } => {
            (format!("{}", p2p_host.host().unwrap()), p2p_port)
        }
    };

    write!(
        nbx_config,
        include_str!("templates/settings-nbx.config.template"),
        btc_rpc_proxy_rpc_host = bitcoind_rpc_host,
        btc_rpc_proxy_port = bitcoind_rpc_port,
        btc_rpc_proxy_rpc_password = bitcoind_rpc_pass,
        btc_rpc_proxy_rpc_user = bitcoind_rpc_user,
        btc_p2p_host = bitcoind_p2p_host,
        btc_p2p_port = bitcoind_p2p_port,
    )?;
    write!(
        btcpay_config,
        include_str!("templates/settings-btcpay.config.template"),
    )?;

    let addr = tor_address.split('.').collect::<Vec<&str>>();
    match addr.first() {
        Some(x) => {
            print!("{}", format!("export BTCPAY_HOST='https://{}.local/'\n", x));
            print!("{}", format!("export REVERSEPROXY_DEFAULT_HOST='http://{}.local/'\n", x));
            print!("{}", format!("export BTCPAY_ADDITIONAL_HOSTS='https://{}.local/,http://{}.local/'\n", x, x));
        }
        None => {}
    }

    match config.lightning {
        LightningConfig::CLightning => {
            print!(
                "export BTCPAY_BTCLIGHTNING='type=clightning;server=unix://mnt/c-lightning/lightning-rpc'\n"
            );
        }
        LightningConfig::Lnd => {
            println!("{}", format!(
                "export BTCPAY_BTCLIGHTNING='type=lnd-rest;server=https://lnd.embassy:8080/;macaroonfilepath=/mnt/lnd/admin.macaroon;allowinsecure=true'\n"
                ));
        }
        LightningConfig::None => {}
    }

    // write backup ignore to the root of the mounted volume
    std::fs::write(
        Path::new("/datadir/.backupignore.tmp"),
        include_str!("./templates/.backupignore.template"),
    )?;
    std::fs::rename("/datadir/.backupignore.tmp", "/datadir/.backupignore")?;

    Ok(())
}
