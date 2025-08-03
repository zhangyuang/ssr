import type { RspackOptions } from '@rspack/core'
import { rspack } from '@rspack/core'
import { RspackDevServer } from '@rspack/dev-server'
import { loadConfig } from 'ssr-common-utils'
// import { rspackPromisify } from './utils/promisify'

const config = loadConfig()

const startClientServer = async (rspackConfig: RspackOptions): Promise<void> => {
	const { webpackDevServerConfig, fePort, host } = config
	return await new Promise((resolve) => {
		const compiler = rspack(rspackConfig)

		const server = new RspackDevServer(webpackDevServerConfig, compiler)
		compiler.hooks.done.tap('DonePlugin', () => {
			resolve()
		})

		server.start()
	})
}

const startClientBuild = async (rspackConfig: RspackOptions) => {
	const { webpackStatsOption } = config
	// const stats = await rspackPromisify(rspackConfig)
	// console.log(stats.toString(webpackStatsOption))
}

export { startClientServer, startClientBuild }
