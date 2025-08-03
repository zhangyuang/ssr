import { loadConfig, getBuildEntry } from 'ssr-common-utils'
import { SwcJsMinimizerRspackPlugin, LightningCssMinimizerRspackPlugin } from '@rspack/core'
import type * as RspackChain from 'rspack-chain'
import { getBaseConfig } from './base-config'

export const getServerRspack = (chain: RspackChain) => {
	const { isDev, getOutput, chainServerConfig, chunkName, defaultBrowserTarget } = loadConfig()
	getBaseConfig(chain, true)
	chain.target('node')
	chain.entry(chunkName).add(getBuildEntry().server).end().output.path(getOutput().serverOutPut).filename('[name].server.js').libraryTarget('commonjs').end()
	chain.optimization.minimizer('swcMinimizer').use(SwcJsMinimizerRspackPlugin)
	chain.optimization.minimizer('lightningCssMinimizer').use(LightningCssMinimizerRspackPlugin, [defaultBrowserTarget])
	chain.output.libraryTarget('module')
	chain.when(isDev, () => {
		chain.watch(true)
	})
	chainServerConfig(chain)
	return chain.toConfig()
}
