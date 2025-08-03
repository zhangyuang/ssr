import type { Configuration, Stats } from 'webpack'
import * as webpack4 from 'ssr-webpack4'
import { loadConfig } from 'ssr-common-utils'
import { webpackPromisify } from './utils/promisify'

// fork 后移除 webpack-dev-server 默认的启动 log，只展示服务端 Node.js 的启动监听端口
const WebpackDevServer = require('webpack-dev-server-ssr')
const config = loadConfig()

const startClientServer = async (webpackConfig: Configuration): Promise<void> => {
	const { webpackDevServerConfig, fePort, host } = config
	return await new Promise((resolve) => {
		//@ts-ignore
		const compiler = webpack4(webpackConfig)

		const server = new WebpackDevServer(compiler, webpackDevServerConfig)
		compiler!.hooks.done.tap('DonePlugin', () => {
			resolve()
		})

		server.listen(fePort, host)
	})
}

const startClientBuild = async (webpackConfig: Configuration) => {
	const { webpackStatsOption } = config
	const stats = await webpackPromisify(webpackConfig)
	console.log(stats.toString(webpackStatsOption as Stats.ToStringOptions))
}

export { startClientServer, startClientBuild }
