import type { Configuration } from '@rspack/core'
import type { StatsOptions } from '@rspack/core'

import { rspackPromisify } from './utils/promisify'
import { loadConfig } from 'ssr-common-utils'

const startServerBuild = async (rspackConfig: Configuration) => {
	const { webpackStatsOption } = loadConfig()
	const stats = await rspackPromisify(rspackConfig)
	console.log(stats.toString(webpackStatsOption as StatsOptions))
}

export { startServerBuild }
