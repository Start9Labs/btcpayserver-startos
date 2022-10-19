import {
  compat,
  types as T
} from "../deps.ts";
export const setConfig: T.ExpectedExports.setConfig = async (effects, input ) => {
  // deno-lint-ignore no-explicit-any
  const newConfig = input as any;

  const depsLnd: T.DependsOn = newConfig?.lightning?.type === "lnd"  ? {lnd: []} : {}
  const depsCln: T.DependsOn = newConfig?.lightning?.type === "c-lightning"  ? {"c-lightning": []} : {}
  const depsBitcoind: T.DependsOn = newConfig?.bitcoin?.['bitcoind-p2p']?.type === "internal"  ? {"bitcoind": []} : {}

  return await compat.setConfig(effects,input, {
    ...depsLnd,
    ...depsBitcoind,
    ...depsCln,
  })
}
