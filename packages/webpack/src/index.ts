//@ts-nocheck
import * as WebpackChain from 'webpack-chain'
import { startClientServer, startClientBuild } from './client'
import { startServerBuild } from './server'

export const start = async () => {
	const serverConfigChain = new WebpackChain()
	const clientConfigChain = new WebpackChain()

	const { getServerWebpack } = await import('./config/server-config')
	const { getClientWebpack } = await import('./config/client-config')
	await Promise.all([
		startServerBuild(getServerWebpack(serverConfigChain)),
		startClientServer(getClientWebpack(clientConfigChain))
	])
}

export const build = async () => {
	const { getServerWebpack } = await import('./config/server-config')
	const { getClientWebpack } = await import('./config/client-config')
	const serverConfigChain = new WebpackChain()
	const clientConfigChain = new WebpackChain()
	//@ts-ignore
	await Promise.all([
		startServerBuild(getServerWebpack(serverConfigChain)),
		startClientBuild(getClientWebpack(clientConfigChain))
	])
}
