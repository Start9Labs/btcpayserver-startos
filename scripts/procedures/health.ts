import { types as T } from '../deps.ts';

export const health: T.ExpectedExports.health = {
  async "explorer-synced"(effects: T.Effects) {
    const res = await effects.runCommand({ command: "health_check.sh", args: ["nbx"] })
    if ('result' in res){
      return { result: null }
    } else {
      return res
    }
  },
  async "web-ui"(effects: T.Effects) {
    const res = await effects.runCommand({ command: "health_check.sh", args: ["web"] })
    if ('result' in res){
      return { result: null }
    } else {
      return res
    }
  },
  async "api"(effects: T.Effects) {
    const res = await effects.runCommand({ command: "health_check.sh", args: ["api"] })
    if ('result' in res){
      return { result: null }
    } else {
      return res
    }
  }
}