import {
  compat,
  types as T
} from "../deps.ts";
export const setConfig: T.ExpectedExports.setConfig = async (effects, input ) => {
  // deno-lint-ignore no-explicit-any
  const newConfig = input as any;

  const depsLnd: T.DependsOn = newConfig?.lightning?.type === "lnd"  ? {lnd: []} : {}
  const depsCln: T.DependsOn = newConfig?.lightning?.type === "c-lightning"  ? {"c-lightning": []} : {}
  const depsMonero: T.DependsOn = newConfig?.altcoins?.monero.enabled  ? {"monerod": []} : {}

  if (newConfig?.altcoins?.monero.enabled) {
    await effects.createDir({ volumeId: "main", path: "~/.bitmonero/wallets" })
  }

  return await compat.setConfig(effects,input, {
    ...depsLnd,
    ...depsCln,
    ...depsMonero
  })
}
