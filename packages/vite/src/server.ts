import * as webpack from 'ssr-webpack4'

import { loadConfig } from 'ssr-common-utils'
import { webpackPromisify } from './utils/promisify'

const startServerBuild = async (webpackConfig: webpack.Configuration) => {
	const { webpackStatsOption } = loadConfig()
	const stats = await webpackPromisify(webpackConfig)
	console.log(stats.toString(webpackStatsOption))
}

export { startServerBuild }
