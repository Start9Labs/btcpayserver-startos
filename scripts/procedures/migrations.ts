import { types as T, compat } from "../deps.ts"
import { migration_up_1_4_7 } from "../migrations/1_4_7_up_migration.ts";
import { migration_down_1_4_7 } from "../migrations/1_4_7_down_migration.ts";
import { migration_up_1_10_3 } from "../migrations/1_10_3_up_migration.ts";
import { migration_up_1_13_5_1 } from "../migrations/1_13_5_1_up_migration.ts";
import { migration_down_1_13_5_1 } from "../migrations/1_13_5_1_down_migration.ts";

export const migration: T.ExpectedExports.migration = async (effects, version, ...args) => {
  await effects.createDir({
    path: "start9",
    volumeId: "main"
  });
  return compat.migrations
    .fromMapping(
      {
        // 1.1.2.5: initial (updated) version released with eOS 0.3.0 - bitcoin config was internal (proxy) or external
        "1.4.7.1": {
          up: compat.migrations.updateConfig(
            (config) => {
              return migration_up_1_4_7(config)
            },
            false,
            { version: "1.4.7.1", type: "up" },
          ),
          down: compat.migrations.updateConfig(
            (config) => {
              return migration_down_1_4_7(config)
            },
            true,
            { version: "1.4.7.1", type: "down" },
          ),
        },
        // 1.4.7.3: JS config/properties conversion occurred
        "1.10.2": {
          up: compat.migrations.updateConfig(
            (config) => {
              return migration_up_1_10_3(config)
            },
            true,
            { version: "1.10.2", type: "up"}
          ),
          down: compat.migrations.updateConfig(
            (_config) => {
              throw new Error(
                "Cannot downgrade this version"
              )
            },
            true,
            { version: "1.10.2", type: "down" },
          ),
        },
        "1.13.5.1": {
          up: compat.migrations.updateConfig(
            (config) => {
              return migration_up_1_13_5_1(config)
            },
            true,
            { version: "1.13.5.1", type: "up"}
          ),
          down: compat.migrations.updateConfig(
            (config) => {
              return migration_down_1_13_5_1(config)
            },
            true,
            { version: "1.13.5.1", type: "down" },
          ),
        },
      },
      "1.13.5.1",
    )(effects, version, ...args)
}