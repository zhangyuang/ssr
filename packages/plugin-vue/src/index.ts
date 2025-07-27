import { resolve } from 'path'
import { loadConfig, getCwd } from 'ssr-common-utils'

const { isVite } = loadConfig()

export function clientPlugin() {
	if (isVite) {
		console.log('vite ssr is not supported vue2 ref https://github.com/underfin/vite-plugin-vue2/issues/31')
		return
	}
	const cwd = getCwd()
	const webpackPath = resolve(cwd, './node_modules/ssr-webpack')
	return {
		name: 'plugin-vue',
		start: async () => {
			const { start } = await import(webpackPath)
			await start()
		},
		build: async () => {
			const { build } = await import(webpackPath)
			await build()
		}
	}
}

export * from './types'
