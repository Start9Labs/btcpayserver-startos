import { types as T } from "../deps.ts";

export const main = (effects: T.Effects) => {
  return effects.runDaemon({ command: "tini", args: ["/init"] }).wait()
}