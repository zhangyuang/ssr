import { join } from 'path'
import { checkModuleExist, getCwd, loadConfig, logErr, loadModuleFromFramework, judgeFramework } from 'ssr-common-utils'
import { Mode } from 'ssr-types'
import WebpackChain from 'webpack-chain'
import { addCommonChain } from '../utils/common-chain'

const framework = judgeFramework()
const isVue2 = framework === 'ssr-plugin-vue'
const isVue3 = framework === 'ssr-plugin-vue3'
const getBaseConfig = (chain: WebpackChain, isServer: boolean) => {
	const config = loadConfig()
	const { moduleFileExtensions, chainBaseConfig, locale, ssrVueLoaderOptions, csrVueLoaderOptions, alias } = config

	let vueLoaderOptions = {
		babelParserPlugins: ['jsx', 'classProperties', 'decorators-legacy'],
		compilerOptions: {
			isCustomElement: (tag: string) => tag.includes('micro')
		}
	}

	if (isServer && ssrVueLoaderOptions) {
		vueLoaderOptions = {
			vueLoaderOptions,
			...ssrVueLoaderOptions
		}
	}
	if (!isServer && csrVueLoaderOptions) {
		vueLoaderOptions = {
			vueLoaderOptions,
			...csrVueLoaderOptions
		}
	}

	const mode = process.env.NODE_ENV as Mode

	chain.resolve.extensions.merge(['.mjs', '.js', '.jsx', '.vue', '.json', '.wasm']).end()
	chain.module.noParse(/^(vue|vue-router|vuex)$/)

	chain.mode(mode)

	chain.module.strictExportPresence(true)
	chain.resolve.modules.add('node_modules').add(join(getCwd(), './node_modules')).end().extensions.merge(moduleFileExtensions).end()

	alias &&
		Object.keys(alias).forEach((item) => {
			chain.resolve.alias.set(item, alias[item])
		})

	addCommonChain(chain, isServer)
	if (isVue3) {
		chain.module
			.rule('vue')
			.test(/\.vue$/)
			.use('vue-loader')
			.loader(loadModuleFromFramework('vue-loader'))
			.options(vueLoaderOptions)
			.end()

		chain
			.plugin('vue-loader')
			.use(require(loadModuleFromFramework('vue-loader')).VueLoaderPlugin)
			.end()
	}
	if (isVue2) {
		chain.module
			.rule('vue')
			.test(/\.vue$/)
			.use('vue-loader')
			.loader(loadModuleFromFramework('vue-loader'))
			.options(vueLoaderOptions)
			.end()

		chain.plugin('vue-loader').use(require('vue-loader/lib/plugin')).end()
	}

	locale?.enable &&
		chain.module
			.rule('i18n-resource')
			.test(/\.(json5?|ya?ml)$/)
			.include.add(join(getCwd(), './web/locales'))
			.end()
			.type('javascript/auto')
			.use('i18n-resource')
			.loader('@intlify/vue-i18n-loader')
			.end()

	// block support
	locale?.enable &&
		chain.module
			.rule('i18n')
			.resourceQuery(/blockType=i18n/)
			.type('javascript/auto')
			.use('i18n')
			.loader('@intlify/vue-i18n-loader')
			.end()

	if (checkModuleExist('element-plus')) {
		const { coerce } = require('semver')
		if ((coerce(process.version)?.major ?? 0) < 14) {
			logErr('Use element-plus auto import require Node.js Version >= v14 for optional chaining')
		} else {
			const AutoImport = require('unplugin-auto-import/webpack')
			const Components = require('unplugin-vue-components/webpack')
			const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
			chain.plugin('ele').use(
				AutoImport({
					resolvers: [
						ElementPlusResolver({
							ssr: isServer
						})
					]
				})
			)

			chain.plugin('ele2').use(
				Components({
					resolvers: [
						ElementPlusResolver({
							ssr: isServer
						})
					]
				})
			)
		}
	}

	chainBaseConfig(chain, isServer)
	return config
}

export { getBaseConfig }
