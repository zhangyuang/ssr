import { promises } from 'fs'
import { resolve } from 'path'
import type { Argv } from 'ssr-types'

export const ssg = async (argv: Argv) => {
	if (!argv.ssg) {
		return
	}
	const { loadConfig, getCwd, logGreen } = await import('ssr-common-utils')
	const config = loadConfig()
	const { chunkName } = config
	const cwd = getCwd()
	const serverFile = resolve(cwd, `./build/server/${chunkName}.server.js`)
	const { Routes, serverRender } = require(serverFile)
	for (const item of Routes.FeRoutes) {
		const { path, webpackChunkName } = item
		const mockCtx = {
			request: {
				path: path,
				url: path
			},
			desc: "It's a mock context"
		}
		const res = await serverRender(mockCtx, Object.assign(config, { stream: false }))
		const htmlStr: string = res.html || res
		const fileName = `./build/client/${webpackChunkName}.html`
		await promises.writeFile(resolve(cwd, fileName), htmlStr)
		logGreen(`Component ${path} be mapped to ${fileName}`)
	}
}
