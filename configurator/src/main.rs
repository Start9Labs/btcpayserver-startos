
use std::fs::File;
use std::net::IpAddr;
use std::io::{Write};

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
    bitcoin: BitcoindConfig,
    lightning: LightningConfig,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "kebab-case")]
struct LightningConfig {
    internal: LightningImplementationConfig,
    lnd: LndConfig,
    c_lightning: CLightningConfig
}

#[derive(serde::Deserialize)]
// #[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum LightningImplementationConfig {
    #[serde(rename_all = "kebab-case")]
    CLightning,
    Lnd,
    None,
}
#[derive(serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum LndConfig {
    #[serde(rename_all = "kebab-case")]
    Internal {
        address: String,
    },
}
#[derive(serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum CLightningConfig {
    #[serde(rename_all = "kebab-case")]
    Internal {
        address: String,
    },
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "kebab-case")]
struct BitcoindConfig {
    bitcoind_rpc: BitcoindRPCConfig,
    bitcoind_p2p: BitcoindP2PConfig
}

#[derive(serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum BitcoindRPCConfig {
    #[serde(rename_all = "kebab-case")]
    Internal {
        rpc_host: IpAddr,
        rpc_user: String,
        rpc_password: String,
    },
    #[serde(rename_all = "kebab-case")]
    External {
        #[serde(deserialize_with = "deserialize_parse")]
        rpc_host: Uri,
        rpc_user: String,
        rpc_password: String,
        rpc_port: u16,
    },
    #[serde(rename_all = "kebab-case")]
    QuickConnect {
        #[serde(deserialize_with = "deserialize_parse")]
        quick_connect_url: Uri
    }
}
#[derive(serde::Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "kebab-case")]
enum BitcoindP2PConfig {
    #[serde(rename_all = "kebab-case")]
    Internal {
        p2p_host: IpAddr,
    },
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
    let config: Config = serde_yaml::from_reader(File::open("/datadir/start9/config.yaml").with_context(||"/datadir/start9/config.yaml")?)?;
    let tor_address = std::env::var("TOR_ADDRESS")?;
    let mut nbx_config = File::create("/datadir/nbxplorer/Main/settings.config").with_context(|| "/datadir/nbxplorer/mainnet/settings.config")?;
    let mut btcpay_config = File::create("/datadir/btcpayserver/Main/settings.config").with_context(||"/datadir/btcpayserver/btcpay.config")?;
    let (
        bitcoind_rpc_user,
        bitcoind_rpc_pass,
        bitcoind_rpc_host,
        bitcoind_rpc_port,
    ) = match config.bitcoin.bitcoind_rpc {
        BitcoindRPCConfig::Internal {
            rpc_host,
            rpc_user,
            rpc_password,
        } => (
            rpc_user,
            rpc_password,
            format!("{}", rpc_host),
            8332,
        ),
        BitcoindRPCConfig::External {
            rpc_host,
            rpc_user,
            rpc_password,
            rpc_port,
        } => (
            rpc_user,
            rpc_password,
            format!("{}", rpc_host.host().unwrap()),
            rpc_port,
        ),
        BitcoindRPCConfig::QuickConnect {
            quick_connect_url,
        } => {
            let (bitcoin_rpc_user, bitcoin_rpc_pass, bitcoin_rpc_host, bitcoin_rpc_port) =
                parse_quick_connect_url(quick_connect_url)?;
            (
                bitcoin_rpc_user,
                bitcoin_rpc_pass,
                bitcoin_rpc_host.clone(),
                bitcoin_rpc_port,
            )
        }
    };
    let (bitcoind_p2p_host, bitcoind_p2p_port) = match config.bitcoin.bitcoind_p2p {
        BitcoindP2PConfig::Internal {
            p2p_host,
        } => (
            format!("{}", p2p_host),
            8333
        ),
        BitcoindP2PConfig::External {
            p2p_host,
            p2p_port
        } => (
            format!("{}", p2p_host.host().unwrap()),
            p2p_port
        )
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
        btc_proxy_address = bitcoind_rpc_host
    )?;

    let addr = tor_address.split('.').collect::<Vec<&str>>();
    match addr.first() {
        Some(x) => {
            print!("{}", format!("export BTCPAY_HOST='https://{}.local/'\n", x));
        }
        None => {}
    }
    
    match config.lightning.internal {
        LightningImplementationConfig::CLightning => {
            print!("export BTCPAY_BTCLIGHTNING='type=clightning;server=unix://datadir/start9/shared/c-lightning/lightning-rpc'\n");
        },
        LightningImplementationConfig::Lnd => {
            let lan_address =
                match config.lightning.lnd {
                    LndConfig::Internal {
                        address,
                    } => address,
                };
            print!("{}", format!(
                "export BTCPAY_BTCLIGHTNING='type=lnd-rest;server=https://{}:8080/;macaroonfilepath=/datadir/start9/public/lnd/admin.macaroon;allowinsecure=true'\n
                export BTCPAY_BTCEXTERNALLNDGRPC='server=https://{}:8080/;macaroonfilepath=/datadir/start9/public/lnd/admin.macaroon;macaroondirectorypath=/datadir/start9/public/lnd;allowinsecure=true'\n
                export BTCPAY_BTCEXTERNALLNDREST='server=https://{}:8080/;macaroonfilepath=/datadir/start9/public/lnd/admin.macaroon;macaroondirectorypath=/datadir/start9/public/lnd;allowinsecure=true'"
                
                , lan_address, lan_address, lan_address));
        },
        LightningImplementationConfig::None => {}
    }

    Ok(())
}