import { resolve } from 'path'
import { loadConfig, getCwd } from 'ssr-common-utils'

const { isVite, optimize, isRspack } = loadConfig()
const spinner = require('ora')('Building')

export function clientPlugin() {
	const cwd = getCwd()
	const webpackPath = resolve(cwd, './node_modules/ssr-webpack')
	const vitePath = resolve(cwd, './node_modules/ssr-vite')
	const rspackPath = resolve(cwd, './node_modules/ssr-rspack')
	return {
		name: 'plugin-vue3',
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
				if (isRspack) {
					const { start } = await import(rspackPath)
					await start()
					return
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
				if (isRspack) {
					const { start } = await import(rspackPath)
					await start()
					return
				}
				const { build } = await import(webpackPath)
				await build()
			}
		}
	}
}

export * from './types'
