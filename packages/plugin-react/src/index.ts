import { resolve } from 'path'
import { loadConfig, getCwd } from 'ssr-common-utils'

const { isVite, optimize } = loadConfig()
const spinner = require('ora')('Building')

export function clientPlugin() {
	const cwd = getCwd()
	const webpackPath = resolve(cwd, './node_modules/ssr-webpack')
	const vitePath = resolve(cwd, './node_modules/ssr-vite')
	return {
		name: 'plugin-react',
		start: async () => {
			if (isVite) {
				const { start } = await import(vitePath)
				await start()
			} else {
				if (optimize) {
					spinner.start()
					const { viteBuildClient } = await import(vitePath)
					await viteBuildClient()
					process.env.NODE_ENV = 'development'
					spinner.stop()
				}
				const { start } = await import(webpackPath)
				await start()
			}
		},
		build: async () => {
			if (isVite) {
				const { build } = await import(vitePath)
				await build()
			} else {
				if (optimize) {
					spinner.start()
					const { build } = await import(vitePath)
					await build()
					spinner.stop()
				}
				const { build } = await import(webpackPath)
				await build()
			}
		}
	}
}
