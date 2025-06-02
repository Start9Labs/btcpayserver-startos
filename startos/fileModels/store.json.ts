import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, number } = matches

const shape = object({
  startHeight: number.onMismatch(-1),
})

export const store = FileHelper.json(
  {
    volumeId: 'main',
    subpath: '/store.json',
  },
  shape,
)
