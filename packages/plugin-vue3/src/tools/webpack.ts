import * as WebpackChain from 'webpack-chain'

export const webpackStart = async () => {
	const { startServerBuild } = await import('ssr-webpack')
	const { getServerWebpack } = await import('../config/server')
	const serverConfigChain = new WebpackChain()

	const { startClientServer } = await import('ssr-webpack')
	const { getClientWebpack } = await import('../config')
	const clientConfigChain = new WebpackChain()
	await Promise.all([startServerBuild(getServerWebpack(serverConfigChain)), startClientServer(getClientWebpack(clientConfigChain))])
}

export const webpackBuild = async () => {
	const { startServerBuild, startClientBuild } = await import('ssr-webpack')
	const { getClientWebpack, getServerWebpack } = await import('../config')
	const serverConfigChain = new WebpackChain()
	const clientConfigChain = new WebpackChain()
	await Promise.all([startServerBuild(getServerWebpack(serverConfigChain)), startClientBuild(getClientWebpack(clientConfigChain))])
}
