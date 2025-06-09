import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, number, boolean, literals } = matches

const shape = object({
  startHeight: number.onMismatch(-1),
  plugins: object({
    shopify: boolean.onMismatch(false),
  }),
  lightning: literals('lnd', 'cln', 'none').onMismatch('none'),
})

export const storeJson = FileHelper.json(
  {
    volumeId: 'main',
    subpath: '/store.json',
  },
  shape,
)
