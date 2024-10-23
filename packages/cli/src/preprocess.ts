import { promises } from 'fs'
import { resolve } from 'path'
import { Argv } from 'ssr-types'

export const handleEnv = async (argv: Argv) => {
	const { loadConfig, getCwd } = await import('ssr-common-utils')
	const { https, isDev, clientPrefix } = loadConfig()
	const cwd = getCwd()
	process.env.BUILD_TOOL = argv.vite ? 'vite' : 'webpack'
	process.env.OPTIMIZE = process.env.BUILD_TOOL === 'webpack' && argv.optimize ? '1' : '0'
	if (argv.ssg) {
		process.env.SSG = '1'
	}
	if (isDev) {
		process.env.GENERATE_SOURCEMAP = clientPrefix ? 'inline-cheap-module-source-map' : 'cheap-module-source-map'
	}
	if (argv.sourcemap) {
		process.env.GENERATE_SOURCEMAP = argv.sourcemap
	}
	process.env.CLIENT_SOURCEMAP = argv['client-sourcemap'] ?? process.env.GENERATE_SOURCEMAP
	process.env.SERVER_SOURCEMAP = argv['server-sourcemap'] ?? process.env.GENERATE_SOURCEMAP
	if (argv.analyze) {
		process.env.GENERATE_ANALYSIS = '1'
	}
	if (argv.html) {
		process.env.SPA = '1'
	}
	if (argv.legacy) {
		process.env.LEGACY_VITE = '1'
	}
	if (argv.nominify) {
		process.env.NOMINIFY = '1'
	}
	if (argv.viteMode) {
		process.env.VITEMODE = argv.viteMode
	}

	process.env.SERVER_PORT = argv.port ? String(argv.port) : '3000'
	if (argv.vite) {
		await promises.writeFile(
			resolve(cwd, './build/tag.json'),
			JSON.stringify(
				{
					BUILD_TOOL: process.env.BUILD_TOOL
				},
				null,
				2
			)
		)
	}
	if (!!https && isDev) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
	}
}
