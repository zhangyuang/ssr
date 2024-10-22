import { join } from 'path'
import { addCommonChain, getBuildConfig, getCwd, loadConfig, loadModuleFromFramework, setStyle } from 'ssr-common-utils'
import { Mode } from 'ssr-types'
import * as webpack from 'ssr-webpack4'
import WebpackChain from 'webpack-chain'

const MiniCssExtractPlugin = require(loadModuleFromFramework('ssr-mini-css-extract-plugin'))
const WebpackBar = require('webpackbar')

const getBaseConfig = (chain: WebpackChain, isServer: boolean) => {
	const config = loadConfig()
	const { moduleFileExtensions, chainBaseConfig, alias, define } = config
	const mode = process.env.NODE_ENV as Mode

	chain.mode(mode)
	chain.module.strictExportPresence(true)
	chain.resolve.modules.add('node_modules').add(join(getCwd(), './node_modules')).end().extensions.merge(moduleFileExtensions).end().alias.end()

	alias &&
		Object.keys(alias).forEach((item) => {
			chain.resolve.alias.set(item, alias[item])
		})
	addCommonChain(chain, isServer)
	setStyle(chain, /\.css$/, {
		rule: 'css',
		isServer,
		importLoaders: 1
	})

	setStyle(chain, /\.less$/, {
		rule: 'less',
		loader: 'less-loader',
		isServer,
		importLoaders: 2
	})

	chain.plugin('minify-css').use(MiniCssExtractPlugin, getBuildConfig().cssBuildConfig)

	chain.plugin('webpackBar').use(
		new WebpackBar({
			name: isServer ? 'server' : 'client',
			color: isServer ? '#f173ac' : '#45b97c'
		})
	)
	chain.plugin('ssrDefine').use(webpack.DefinePlugin, [
		{
			...process.env,
			__isBrowser__: !isServer,
			...(isServer ? define?.server : define?.client),
			...define?.base
		}
	])
	chainBaseConfig(chain, isServer)
	return config
}

export { getBaseConfig }
