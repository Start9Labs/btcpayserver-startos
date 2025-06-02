import { Effects } from '@start9labs/start-sdk/base/lib/Effects'
import { BTCPSEnv } from './fileModels/btcpay.env'
import { sdk } from './sdk'
import { utils } from '@start9labs/start-sdk'
import { mainMounts } from './main'

export const uiPort = 23000
export const webInterfaceId = 'webui'
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'

export function getRandomPassword() {
  return utils.getDefaultString({
    charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
    len: 22,
  })
}

export function jsonToDotenv<T extends Record<string, string | undefined>>(
  jsonObj: T,
): string {
  return Object.entries(jsonObj)
    .map(([key, value]) => `${key.toUpperCase()}=${value}`)
    .join('\n')
}

export function dotenvToJson<T extends Record<string, string | undefined>>(
  dotenvStr: string,
): T {
  return (
    dotenvStr
      .split('\n')
      // ignore empty lines and comments
      .filter((line) => line.trim() && !line.startsWith('#'))
      .reduce((acc, line) => {
        const [key, value] = line.split('=')
        if (key && value !== undefined) {
          ;(acc as Record<string, string>)[key.trim()] = value.trim()
        }
        return acc
      }, {} as T)
  )
}

export function getCurrentLightning(env: BTCPSEnv) {
  const ln = env?.BTCPAY_BTCLIGHTNING
  let currentLightning: 'lnd' | 'cln' | 'none' = 'none'
  if (ln) {
    if (ln.includes('lnd')) currentLightning = 'lnd'
    if (ln.includes('clightning')) currentLightning = 'cln'
  }
  return currentLightning
}

export async function getWebHostnames(effects: Effects): Promise<string[]> {
  const webInterface = await sdk.serviceInterface
    .getOwn(effects, webInterfaceId)
    .const()

  return (
    webInterface?.addressInfo?.hostnames.map((h) => {
      if (h.kind === 'onion') {
        return h.hostname.value
      } else if (h.hostname.kind === 'domain') {
        return h.hostname.domain
      } else {
        return `${h.hostname.value}:${h.hostname.sslPort}`
      }
    }) || []
  )
}

export async function query(effects: Effects, statement: string) {
  return sdk.SubContainer.withTemp(
    effects,
    { imageId: 'postgres' },
    mainMounts,
    'queryPostgres',
    async (sub) => {
      const res = await sub.exec([
        'psql',
        '-U',
        'postgres',
        '-h',
        'localhost',
        '-d',
        'btcpayserver',
        '-t',
        '-c',
        `"${statement}"`,
      ])
      if (res.stderr) throw new Error(res.stderr.toString())
      return res.stdout.toString()
    },
  )
}
