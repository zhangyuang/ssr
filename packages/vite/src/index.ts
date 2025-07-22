import { resolve } from 'path'
import babel from '@rollup/plugin-babel'
import { visualizer } from 'rollup-plugin-visualizer'
import { asyncOptimizeChunkPlugin, chunkNamePlugin, commonConfig, getBabelOptions, getCwd, getDefineEnv, getOutputPublicPath, loadConfig, manifestPlugin, rollupOutputOptions, loadModuleFromFramework } from 'ssr-common-utils'
import { UserConfig, build as viteBuild } from 'vite'

import { AndDesignVueResolve, AntdResolve, ElementPlusResolve, NutuiResolve, VantResolve, createStyleImportPlugin } from 'ssr-vite-plugin-style-import'

const { getOutput, vue3ServerEntry, vue3ClientEntry, viteConfig, supportOptinalChaining, isDev, define, optimize } = loadConfig()
const { clientOutPut, serverOutPut } = getOutput()
const vuePlugin = require(loadModuleFromFramework('@vitejs/plugin-vue'))
const vueJSXPlugin = require(loadModuleFromFramework('@vitejs/plugin-vue-jsx'))

const styleImportConfig = {
	include: ['**/*.vue', '**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx', /chunkName/],
	resolves: [AndDesignVueResolve(), VantResolve(), ElementPlusResolve(), NutuiResolve(), AntdResolve()]
}
const serverPlugins = [
	vuePlugin(viteConfig?.()?.server?.defaultPluginOptions),
	vueJSXPlugin(),
	viteConfig?.()?.common?.extraPlugin,
	viteConfig?.()?.server?.extraPlugin,
	createStyleImportPlugin(styleImportConfig),
	!supportOptinalChaining &&
		babel({
			babelHelpers: 'bundled',
			plugins: ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-proposal-nullish-coalescing-operator'],
			exclude: /node_modules|\.(css|less|sass)/,
			extensions: ['.vue', '.ts', '.tsx', '.js']
		})
].filter(Boolean)

export const serverConfig: UserConfig = {
	...commonConfig(),
	...viteConfig?.().server?.otherConfig,
	plugins: viteConfig?.()?.server?.processPlugin?.(serverPlugins) ?? serverPlugins,
	optimizeDeps: {
		...viteConfig?.().server?.otherConfig?.optimizeDeps,
		esbuildOptions: {
			...viteConfig?.().server?.otherConfig?.optimizeDeps?.esbuildOptions,
			// @ts-expect-error
			bundle: isDev
		}
	},
	build: {
		minify: !process.env.NOMINIFY,
		...viteConfig?.().server?.otherConfig?.build,
		ssr: vue3ServerEntry,
		outDir: serverOutPut,
		rollupOptions: {
			...viteConfig?.().server?.otherConfig?.build?.rollupOptions,
			input: isDev ? vue3ClientEntry : vue3ServerEntry, // setting prebundle list by client-entry in dev
			output: {
				entryFileNames: 'Page.server.js',
				assetFileNames: rollupOutputOptions().assetFileNames
			}
		}
	},
	define: {
		...getDefineEnv(),
		...viteConfig?.().server?.otherConfig?.define,
		__isBrowser__: false,
		...define?.base,
		...define?.server
	}
}
const clientPlugins = [vuePlugin(viteConfig?.()?.client?.defaultPluginOptions), vueJSXPlugin(), viteConfig?.()?.common?.extraPlugin, viteConfig?.()?.client?.extraPlugin, createStyleImportPlugin(styleImportConfig)].filter(Boolean)

const analyzePlugin = process.env.GENERATE_ANALYSIS ? visualizer({ filename: resolve(getCwd(), './build/stat.html'), open: true }) : null
export const clientConfig: UserConfig = {
	...commonConfig(),
	...viteConfig?.().client?.otherConfig,
	base: isDev ? '/' : getOutputPublicPath(),
	plugins: viteConfig?.()?.client?.processPlugin?.(clientPlugins) ?? clientPlugins,
	build: {
		minify: !process.env.NOMINIFY,
		...viteConfig?.().client?.otherConfig?.build,
		...(optimize ? { write: false } : {}),
		ssrManifest: true,
		outDir: clientOutPut,
		rollupOptions: {
			...viteConfig?.().client?.otherConfig?.build?.rollupOptions,
			input: vue3ClientEntry,
			output: rollupOutputOptions(),
			plugins: [
				chunkNamePlugin(),
				asyncOptimizeChunkPlugin(),
				manifestPlugin(),
				...getBabelOptions({
					babel
				}),
				analyzePlugin
			]
		}
	},
	define: {
		...getDefineEnv(),
		...viteConfig?.().client?.otherConfig?.define,
		__isBrowser__: true,
		...define?.base,
		...define?.client
	}
}

export const viteBuildClient = async () => {
	await viteBuild({
		...clientConfig,
		mode: process.env.VITEMODE ?? 'production'
	}).catch((_) => {})
}
export const viteBuildServer = async () => {
	await viteBuild({ ...serverConfig, mode: process.env.VITEMODE ?? 'production' })
}

export const start = async () => {
	//
}

export const build = async () => {
	await viteBuild({ ...clientConfig, mode: 'production' })
	await viteBuild({ ...serverConfig, mode: process.env.VITEMODE ?? 'production' })
}
