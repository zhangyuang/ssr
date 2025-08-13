import { promises } from 'fs'
import { resolve } from 'path'
import { Argv } from 'ssr-types'
import { mkdir } from 'shelljs'
import { cleanOutDir } from './clean'

export const handleEnv = async (argv: Argv) => {
	await cleanOutDir(argv)
	process.env.BUILD_TOOL = argv.tool || 'webpack'
	const { loadConfig, getCwd, accessFile } = await import('ssr-common-utils')
	const cwd = getCwd()
	if (!(await accessFile(resolve(cwd, `./node_modules/ssr-${process.env.BUILD_TOOL}`)))) {
		throw new Error(`ssr-${process.env.BUILD_TOOL} is not installed`)
	}
	if (process.env.BUILD_TOOL === 'vite') {
		mkdir('-p', resolve(cwd, './build'))
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
	const { https, isDev, clientPrefix } = loadConfig()
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
	if (argv.nominify) {
		process.env.NOMINIFY = '1'
	}

	if (argv.viteMode) {
		process.env.VITEMODE = argv.viteMode
	}

	process.env.SERVER_PORT = argv.port ? String(argv.port) : '3000'
	if (!!https && isDev) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
	}
}
