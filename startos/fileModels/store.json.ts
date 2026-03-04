import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  pgPassword: z.string().catch(''),
  plugins: z
    .object({
      shopify: z.boolean().catch(false),
    })
    .catch({ shopify: false }),
})

export const storeJson = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: 'store.json',
  },
  shape,
)
