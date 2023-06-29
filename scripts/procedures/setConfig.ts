import {
  compat,
  types as T
} from "../deps.ts";
export const setConfig: T.ExpectedExports.setConfig = async (effects, input ) => {
  // deno-lint-ignore no-explicit-any
  const newConfig = input as any;

  const depsLnd: T.DependsOn = newConfig?.lightning?.type === "lnd"  ? {lnd: []} : {}
  const depsCln: T.DependsOn = newConfig?.lightning?.type === "c-lightning"  ? {"c-lightning": []} : {}

  return await compat.setConfig(effects,input, {
    ...depsLnd,
    ...depsCln,
  })
}
