import { types as T } from "../deps.ts";

export const main = (effects: T.Effects) => {
  // args defaulted to [] - not necessary to include if empty
  return effects.runDaemon({ command: "/init", args: [] }).wait()
}