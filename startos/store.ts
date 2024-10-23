import { setupExposeStore } from '@start9labs/start-sdk'

export type Store = {
  lightning: 'lnd' | 'cln' | 'none'
  startHeight: number | null
}

export const exposedStore = setupExposeStore<Store>((pathBuilder) => [])
