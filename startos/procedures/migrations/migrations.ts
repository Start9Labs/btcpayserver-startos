import { migration_up_1_4_7 } from "../migrations/1_4_7_up_migration";
import { migration_down_1_4_7 } from "../migrations/1_4_7_down_migration";
import { sdk } from '../../sdk'

/**
 * Add each new migration as the next argument to this function
 */
export const migrations = sdk.setupMigrations(v4_0_0_1)


// export const migration: T.ExpectedExports.migration = async (effects, version, ...args) => {
//   await effects.createDir({
//     path: "start9",
//     volumeId: "main"
//   });
//   return compat.migrations
//     .fromMapping(
//       {
//         // 1.1.2.5: initial (updated) version released with eOS 0.3.0 - bitcoin config was internal (proxy) or external
//         "1.4.7.1": {
//           up: compat.migrations.updateConfig(
//             (config) => {
//               return migration_up_1_4_7(config)
//             },
//             false,
//             { version: "1.4.7.1", type: "up" },
//           ),
//           down: compat.migrations.updateConfig(
//             (config) => {
//               return migration_down_1_4_7(config)
//             },
//             true,
//             { version: "1.4.7.1", type: "down" },
//           ),
//         },
//         // 1.4.7.3: no migration needed - note: JS config/properties conversion occurred
//       },
//       "1.9.1",
//     )(effects, version, ...args)
// }