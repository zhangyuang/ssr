import { asyncChunkMap, getBuildConfig, getOutputPublicPath, loadConfig, getBuildEntry, judgeFramework } from 'ssr-common-utils'
import type * as RspackChain from 'rspack-chain'
import { SwcJsMinimizerRspackPlugin, LightningCssMinimizerRspackPlugin } from '@rspack/core'
import { RspackManifestPlugin } from 'rspack-manifest-plugin'
//@ts-ignore
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh'
import { getSplitChunksOptions } from '../utils/split-chunk'
import { getBaseConfig } from './base-config'

export const getClientRspack = (chain: RspackChain) => {
	const { isDev, chunkName, getOutput, chainClientConfig, defaultBrowserTarget } = loadConfig()
	const publicPath = getOutputPublicPath()

	getBaseConfig(chain, false)
	const buildConfig = getBuildConfig()
	chain.entry(chunkName).add(getBuildEntry().client).end().output.path(getOutput().clientOutPut).filename(buildConfig.jsBuldConfig.fileName).chunkFilename(buildConfig.jsBuldConfig.chunkFileName).publicPath(publicPath).end()
	chain.optimization
		.runtimeChunk(true)
		.splitChunks(getSplitChunksOptions(asyncChunkMap))
		.when(!isDev, (optimization) => {
			optimization.minimizer('swcMinimizer').use(SwcJsMinimizerRspackPlugin, [
				{
					minimizerOptions: {
						compress: {
							keep_fnames: judgeFramework() === 'ssr-plugin-react'
						},
						mangle: {
							keep_fnames: judgeFramework() === 'ssr-plugin-react'
						}
					}
				}
			])
			optimization.minimizer('lightningCssMinimizer').use(LightningCssMinimizerRspackPlugin, [defaultBrowserTarget])
		})
		.end()
	if (judgeFramework() === 'ssr-plugin-react') {
		chain.when(isDev, (chain) => {
			chain.plugin('fast-refresh').use(ReactRefreshRspackPlugin)
		})
	}
	chain.plugin('manifest').use(RspackManifestPlugin, [
		{
			fileName: 'asset-manifest.json'
		}
	])

	chainClientConfig(chain)

	return chain.toConfig()
}
