import { loadConfig } from 'ssr-common-utils'

const { isVite, optimize } = loadConfig()
const spinner = require('ora')('Building')

export function clientPlugin() {
	return {
		name: 'plugin-vue3',
		start: async () => {
			if (isVite) {
				const { viteStart } = await import('./tools/vite')
				await viteStart()
			} else {
				const { serverConfigChain, clientConfigChain } = await import('./tools/webpack')
				if (optimize) {
					spinner.start()
					const { viteBuildClient } = await import('./tools/vite')
					await viteBuildClient()
					process.env.NODE_ENV = 'development'
					spinner.stop()
				}
				const { webpackStart } = await import('ssr-webpack')
				await webpackStart({
					serverConfigChain: serverConfigChain(),
					clientConfigChain: clientConfigChain()
				})
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
					const { webpackBuild } = await import('ssr-webpack')
					await webpackBuild()
				} else {
					const { webpackBuild } = await import('ssr-webpack')
					await webpackBuild()
				}
			}
		}
	}
}

export * from './tools/vite'
export * from './types'
