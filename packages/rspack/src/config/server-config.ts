import { loadConfig, getBuildEntry } from 'ssr-common-utils'
import type * as RspackChain from 'rspack-chain'

import { getBaseConfig } from './base-config'

export const getServerRspack = (chain: RspackChain) => {
	const { isDev, getOutput, chainServerConfig, chunkName } = loadConfig()
	getBaseConfig(chain, true)
	chain.target('node')
	chain
		.entry(chunkName)
		.add(getBuildEntry().server)
		.end()
		.output.path(getOutput().serverOutPut)
		.filename('[name].server.js')
		.libraryTarget('commonjs')
		.end()
	chain.when(isDev, () => {
		chain.watch(true)
	})
	chain.optimization.minimize(false)
	chainServerConfig(chain)
	return chain.toConfig()
}
