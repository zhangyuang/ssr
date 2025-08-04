import type { Compiler } from '@rspack/core'
import type * as RspackChain from 'rspack-chain'
import { promises } from 'fs'
import { resolve } from 'path'
import { rspack } from '@rspack/core'
import { asyncChunkMap, getCwd, getPkgMajorVersion, loadConfig, logWarning, getBuildConfig, getDefineEnv } from 'ssr-common-utils'
import { nodeExternals } from './externals'
import { setStyle } from './setStyle'

const WebpackBar = require('webpackbar')

const [antdVersion] = [getPkgMajorVersion('antd'), getPkgMajorVersion('vant')]
if (antdVersion === 5) {
	logWarning('Check antd@5.x has been installed, antd@4.x is more recommend in ssr environment')
}

const addCommonChain = (chain: RspackChain, isServer: boolean) => {
	const { optimize, cwd, whiteList, define, defaultBrowserTarget, isDev } = loadConfig()

	if (process.env.NOMINIFY) {
		chain.optimization.minimize(false)
	}
	chain.devtool(((isServer ? process.env.SERVER_SOURCEMAP : process.env.CLIENT_SOURCEMAP) as any) ?? false)
	if (!isServer) {
		chain.externals(
			nodeExternals({
				isServer
			})
		)
	} else {
		const modulesDir = [resolve(cwd, './node_modules')]
		chain.externals(
			nodeExternals({
				isServer,
				whitelist: whiteList,
				// externals Dir contains example/xxx/node_modules ssr/node_modules
				modulesDir
			})
		)
	}

	chain.module.rule('mjs').test(/\.mjs/).type('javascript/auto').end()
	chain.module
		.rule('js')
		.test(/\.(jsx?|tsx?)$/)
		.use('swc-loader')
		.loader('builtin:swc-loader')
		.options({
			jsc: {
				parser: {
					syntax: 'typescript',
					tsx: true
				},
				transform: {
					react: {
						runtime: 'automatic',
						development: isDev,
						refresh: isDev && !isServer
					}
				}
			},
			env: { targets: defaultBrowserTarget }
		})
		.end()
	chain.module
		.rule('images')
		.test(/\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/)
		.type('asset/resource')
		.end()
	chain.module
		.rule('fonts')
		.test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
		.type('asset/resource')
		.end()

	if (isServer) {
		chain.module.generator.set('asset/resource', {
			emit: false
		})
		chain.module.generator.set('asset', {
			emit: false
		})
	}

	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
	const generateAnalysis = Boolean(process.env.GENERATE_ANALYSIS)

	setStyle(chain, /\.css$/, {
		rule: 'css',
		importLoaders: 1,
		isServer
	}) // 设置css

	setStyle(chain, /\.less$/, {
		rule: 'less',
		loader: 'less-loader',
		importLoaders: 2,
		isServer
	})

	chain.plugin('minify-css').use(rspack.CssExtractRspackPlugin, [getBuildConfig().cssBuildConfig[0]])

	chain.plugin('webpackBar').use(
		new WebpackBar({
			name: isServer ? 'server' : 'client',
			color: isServer ? '#f173ac' : '#45b97c'
		})
	)
	chain.plugin('ssrDefine').use(rspack.DefinePlugin, [
		{
			...getDefineEnv(),
			...process.env,
			__isBrowser__: !isServer,
			__VUE_OPTIONS_API__: true,
			__VUE_PROD_DEVTOOLS__: false,
			...(isServer ? define?.server : define?.client),
			...define?.base
		}
	])

	if (!isServer) {
		chain.when(generateAnalysis, (chain) => {
			chain.plugin('analyze').use(BundleAnalyzerPlugin)
		})
		chain.plugin('WriteAsyncManifest').use(function () {
			return {
				apply(compiler: Compiler) {
					compiler.hooks.watchRun.tap('ClearLastAsyncChunkMap', async () => {
						asyncChunkMap.val = {}
					})
					compiler.hooks.done.tapAsync('WriteAsyncChunkManifest', async (_params: any, callback: any) => {
						if (!optimize) {
							await promises.writeFile(resolve(getCwd(), './build/asyncChunkMap.json'), JSON.stringify(asyncChunkMap.val))
						}
						callback()
					})
				}
			}
		})
	}
}

export { addCommonChain }
