import { resolve } from 'path'
import { loadConfig, getCwd } from 'ssr-common-utils'
import type { webpackStart as webpackStartType } from 'ssr-webpack'

const { isVite, optimize } = loadConfig()
const spinner = require('ora')('Building')

export function clientPlugin() {
	const cwd = getCwd()
	const webpackPath = resolve(cwd, './node_modules/ssr-webpack')
	return {
		name: 'plugin-vue3',
		start: async () => {
			if (isVite) {
				const { viteStart } = await import('./tools/vite')
				await viteStart()
			} else {
				if (optimize) {
					spinner.start()
					const { viteBuildClient } = await import('./tools/vite')
					await viteBuildClient()
					process.env.NODE_ENV = 'development'
					spinner.stop()
				}
				const { webpackStart }: { webpackStart: typeof webpackStartType } = await import(webpackPath) 
				await webpackStart()
			}
		},
		build: async () => {
			if (isVite) {
				const { viteBuild } = await import('./tools/vite')
				await viteBuild()
			} else {
				if (optimize) {
					spinner.start()
					const { viteBuildClient } = await import('./tools/vite')
					await viteBuildClient()
					spinner.stop()
					const { webpackBuild } = await import(webpackPath)
					await webpackBuild()
				} else {
					const { webpackBuild } = await import(webpackPath)
					await webpackBuild()
				}
			}
		}
	}
}

export * from './tools/vite'
export * from './types'
