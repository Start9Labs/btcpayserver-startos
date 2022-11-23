import { compat } from "./deps.ts";
export { setConfig } from "./procedures/setConfig.ts";
export { dependencies } from "./procedures/dependencies.ts";
export const properties = compat.properties;
export { getConfig } from "./procedures/getConfig.ts";
export { migration } from "./procedures/migrations.ts";
export { health } from "./procedures/health.ts";
export { main } from "./procedures/main.ts";