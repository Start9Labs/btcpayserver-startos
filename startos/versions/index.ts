import { VersionGraph } from '@start9labs/start-sdk'
import { v_2_3_7_0 } from './v2.3.7.0'
import { v_2_3_7_1 } from './v2.3.7.1'

export const versionGraph = VersionGraph.of({
  current: v_2_3_7_1,
  other: [v_2_3_7_0],
})
