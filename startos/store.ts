import { setupExposeStore } from '@start9labs/start-sdk'

export type Store = {
  startHeight: number | null
}

export const exposedStore = setupExposeStore<Store>((pathBuilder) => [])
