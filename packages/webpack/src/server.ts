import type { Configuration } from 'webpack'

import { loadConfig } from 'ssr-common-utils'
import { webpackPromisify } from './utils/promisify'

const startServerBuild = async (webpackConfig: Configuration) => {
	const { webpackStatsOption } = loadConfig()
	const stats = await webpackPromisify(webpackConfig)
	console.log(stats.toString(webpackStatsOption))
}

export { startServerBuild }
