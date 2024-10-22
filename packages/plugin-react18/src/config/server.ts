import { loadConfig, loadModuleFromFramework } from 'ssr-common-utils'
import * as webpack from 'ssr-webpack4'
import WebpackChain from 'webpack-chain'

import { getBaseConfig } from './base'

const getServerWebpack = (chain: WebpackChain) => {
	const config = loadConfig()
	const { isDev, getOutput, chainServerConfig, chunkName } = config
	const shouldUseSourceMap = isDev || Boolean(process.env.GENERATE_SOURCEMAP)
	getBaseConfig(chain, true)
	chain.target('node')
	chain.entry(chunkName).add(require.resolve('../entry/server-entry')).end().output.path(getOutput().serverOutPut).filename('[name].server.js').libraryTarget('commonjs')

	if (!isDev) {
		chain.optimization.minimizer('terser').use(loadModuleFromFramework('terser-webpack-plugin'), [
			{
				terserOptions: {
					keep_fnames: true
				},
				extractComments: false,
				parallel: true,
				cache: true,
				sourceMap: shouldUseSourceMap
			}
		])
	}
	chain.when(isDev, () => {
		chain.watch(true)
	})

	chain.plugin('serverLimit').use(webpack.optimize.LimitChunkCountPlugin, [
		{
			maxChunks: 1
		}
	])

	chainServerConfig(chain) // 合并用户自定义配置

	return chain.toConfig()
}

export { getServerWebpack }
