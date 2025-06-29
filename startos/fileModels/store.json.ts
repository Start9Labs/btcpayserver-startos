import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, boolean, literals } = matches

const shape = object({
  plugins: object({
    shopify: boolean.onMismatch(false),
  }),
  lightning: literals('lnd', 'cln', 'none').onMismatch('none'),
})

export const storeJson = FileHelper.json(
  {
    volumeId: 'main',
    subpath: 'store.json',
  },
  shape,
)
