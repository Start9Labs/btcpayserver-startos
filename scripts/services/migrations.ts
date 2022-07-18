import { types as T, rangeOf } from "../deps.ts"
import { migration_up_1_4_7 } from "../migrations/1_4_7_from_migration.ts";
import { migration_down_1_4_7 } from "../migrations/1_4_7_to_migration.ts";

export const migration: T.ExpectedExports.migration = async (effects, version) => {

  // VERSION INFO
  // 1.1.2.4 - version released with eOS 030 - bitcoin config was internal (proxy) or external
  // 1.4.7 - bitcoin config changed (removed external and changed default of internal to point to core) -  added advanced["sync-start-height"] config (not nullable)
  // 1.4.7.2 - no changes
  // 1.4.7.3 - JS conversion 

  // from migrations (upgrades)
  if (rangeOf('<=1.4.7').check(version)) {
    const result = await migration_up_1_4_7(effects, version)
    return result
  }

  // to migrations (downgrades)
  if (rangeOf('>1.4.7').check(version)) {
    const result = await migration_down_1_4_7(effects, version)
    return result
  }

  return { result: { configured: true } }

}