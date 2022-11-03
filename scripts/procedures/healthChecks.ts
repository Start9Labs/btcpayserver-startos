import { types as T } from '../deps.ts';

export const health: T.ExpectedExports.health = {
  async "explorer-synced"(effects: T.Effects) {
    const res = await effects.runCommand({ command: "health_check.sh", args: ["nbx"] })
    if ('result' in res){
      return { result: null }
    } else {
      return res
    }
  }
}