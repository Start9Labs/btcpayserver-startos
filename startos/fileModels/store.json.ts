import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, number, boolean } = matches

const shape = object({
  startHeight: number.onMismatch(-1),
  plugins: object({
    shopify: boolean.onMismatch(false),
  }),
})

export const store = FileHelper.json(
  {
    volumeId: 'main',
    subpath: '/store.json',
  },
  shape,
)
