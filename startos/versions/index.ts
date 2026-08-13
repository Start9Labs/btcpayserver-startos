import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_2_4_0_2 } from './v2.4.0_2'
import { v_2_4_2_1 } from './v2.4.2_1'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_2_4_0_2, v_2_4_2_1],
})
