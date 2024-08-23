use std::io::Write;
use std::{
    fs::{self, File},
    path::Path,
};

use anyhow::Context;

#[derive(serde::Deserialize)]
#[serde(rename_all = "kebab-case")]
struct Config {
    tor_address: String,
    lightning: LightningConfig,
    bitcoin_rpc_user: String,
    bitcoin_rpc_password: String,
    altcoins: AltcoinConfig,
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
enum Status {
    #[serde(rename_all = "lowercase")]
    Enabled,
    #[serde(rename_all = "lowercase")]
    Disabled,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "kebab-case")]
struct MoneroConfig {
    status: Status,
    username: Option<String>,
    password: Option<String>,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "kebab-case")]
struct AltcoinConfig {
    monero: MoneroConfig
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
    let bitcoin_host = "bitcoind.embassy".to_string();

    write!(
        nbx_config,
        include_str!("templates/settings-nbx.config.template"),
        rpc_host = bitcoin_host,
        rpc_port = 8332,
        rpc_password = config.bitcoin_rpc_password,
        rpc_user = config.bitcoin_rpc_user,
        p2p_host = bitcoin_host,
        p2p_port = 8333
    )?;

    match config.altcoins.monero.status {
        Status::Enabled => {
            write!(
                btcpay_config,
                include_str!("templates/settings-btcpay.config.template"),
                monero_username = &config.altcoins.monero.username.is_some(),
                monero_password = &config.altcoins.monero.password.is_some(),
                chains = "btc,xmr"
            )?;
            println!("{}", format!("export BTCPAYGEN_CRYPTO2='xmr'\n"));
        }
        Status::Disabled => {
            write!(
                btcpay_config,
                include_str!("templates/settings-btcpay.config.template"),
                monero_username = "",
                monero_password = "",
                chains = "btc"
            )?;
        }
    }

    let addr = tor_address.split('.').collect::<Vec<&str>>();
    match addr.first() {
        Some(x) => {
            print!("{}", format!("export BTCPAY_HOST='https://{}.local/'\n", x));
            print!(
                "{}",
                format!("export REVERSEPROXY_DEFAULT_HOST='http://{}.local/'\n", x)
            );
            print!("{}", format!("export BTCPAY_ADDITIONAL_HOSTS='https://{}.local/,http://{}.local/,http://{}.onion/'\n", x, x, x));
            print!("{}", "export BTCPAY_SOCKSENDPOINT='embassy:9050'\n");
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
