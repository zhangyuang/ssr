import { asyncChunkMap, getBuildConfig, getOutputPublicPath, getSplitChunksOptions, loadConfig, terserConfig } from 'ssr-common-utils'
import WebpackChain from 'webpack-chain'

import { getBaseConfig } from './base-config'
import { getBuildEntry } from '../utils/build-entry'

const safePostCssParser = require('postcss-safe-parser')

const getClientWebpack = (chain: WebpackChain) => {
	const { isDev, chunkName, getOutput, chainClientConfig } = loadConfig()
	const shouldUseSourceMap = isDev || Boolean(process.env.GENERATE_SOURCEMAP)
	const publicPath = getOutputPublicPath()

	getBaseConfig(chain, false)
	const buildConfig = getBuildConfig()
	chain.entry(chunkName).add(getBuildEntry().client).end().output.path(getOutput().clientOutPut).filename(buildConfig.jsBuldConfig.fileName).chunkFilename(buildConfig.jsBuldConfig.chunkFileName).publicPath(publicPath).end()

	chain.optimization
		.runtimeChunk(true)
		.splitChunks(getSplitChunksOptions(asyncChunkMap))
		.when(!isDev, (optimization) => {
			optimization.minimizer('terser').use('terser-webpack-plugin', [terserConfig(false)])
			optimization.minimizer('optimize-css').use('optimize-css-assets-webpack-plugin', [
				{
					cssProcessorOptions: {
						parser: safePostCssParser,
						map: shouldUseSourceMap
							? {
									inline: false,
									annotation: true
								}
							: false
					}
				}
			])
		})

	chain.plugin('manifest').use('webpack-manifest-plugin', [
		{
			fileName: 'asset-manifest.json'
		}
	])

	chainClientConfig(chain) 

	return chain.toConfig()
}

export { getClientWebpack }
