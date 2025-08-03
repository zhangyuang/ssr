// import { startClientServer, startClientBuild } from './client'
import { startServerBuild } from './server'
import { getServerRspack } from './config/server-config'
//@ts-ignore
import { default as RspackChain } from 'rspack-chain'

export const start = async () => {
	const serverConfigChain = new RspackChain()
	await startServerBuild(getServerRspack(serverConfigChain))
	// const { getServerRspack } = await import('./config/server-config')
	// const { getClientRspack } = await import('./config/client-config')
	// await Promise.all([startServerBuild(getServerRspack()), startClientServer(getClientRspack())])
}

export const build = async () => {
	// const { getServerRspack } = await import('./config/server-config')
	// const { getClientRspack } = await import('./config/client-config')
	// await Promise.all([startServerBuild(getServerRspack()), startClientBuild(getClientRspack())])
}
