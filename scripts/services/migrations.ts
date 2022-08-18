import { types as T, compat } from "../deps.ts"
import { migration_up_1_4_7 } from "../migrations/1_4_7_up_migration.ts";
import { migration_down_1_4_7 } from "../migrations/1_4_7_down_migration.ts";

export const migration: T.ExpectedExports.migration = async (effects, version, ...args) => {
  await effects.createDir({
    path: "start9",
    volumeId: "main"
  });
  return compat.migrations
    .fromMapping(
      {
        // 1.1.2.4: initial version released with eOS 0.3.0 - bitcoin config was internal (proxy) or external
        "1.4.7": {
          up: compat.migrations.updateConfig(
            (config) => {
              return migration_up_1_4_7(config)
            },
            false,
            { version: "1.4.7", type: "up" },
          ),
          down: compat.migrations.updateConfig(
            (config) => {
              return migration_down_1_4_7(config)
            },
            false,
            { version: "1.4.7", type: "down" },
          ),
        },
        // 1.4.7.2: no migration needed
        // 1.4.7.3: no migration needed - note: JS config/properties conversion occurred
      },
      "1.6.6",
    )(effects, version, ...args)
}