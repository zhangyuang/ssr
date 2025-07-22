import { resolve } from 'path'
import babel from '@rollup/plugin-babel'
import { visualizer } from 'rollup-plugin-visualizer'
import { asyncOptimizeChunkPlugin, chunkNamePlugin, commonConfig, getBabelOptions, getCwd, getDefineEnv, getOutputPublicPath, loadConfig, manifestPlugin, rollupOutputOptions, loadModuleFromFramework, judgeFramework, getPkgMajorVersion } from 'ssr-common-utils'
import { UserConfig, build as viteBuild, Plugin, PluginOption } from 'vite'
import type * as VuePlugin from '@vitejs/plugin-vue'
import type * as VueJSXPlugin from '@vitejs/plugin-vue-jsx'
import type * as ReactPlugin from '@vitejs/plugin-react'

import { AndDesignVueResolve, AntdResolve, ElementPlusResolve, NutuiResolve, VantResolve, createStyleImportPlugin } from 'ssr-vite-plugin-style-import'

const framework = judgeFramework()
const isReact = framework === 'react'
const isVue3 = framework === 'vue3'
const isAntd5 = getPkgMajorVersion('antd') === 5
const extraInclude = ([] as string[]).concat(isAntd5 ? ['react-is'] : [])

const { getOutput, vue3ServerEntry, vue3ClientEntry, reactServerEntry, reactClientEntry, viteConfig, supportOptinalChaining, isDev, define, optimize, babelOptions, chunkName } = loadConfig()
const { clientOutPut, serverOutPut } = getOutput()

let vuePlugin: typeof VuePlugin.default | undefined
let vueJSXPlugin: typeof VueJSXPlugin.default | undefined
let reactPlugin: typeof ReactPlugin.default | undefined

if (isVue3) {
	vuePlugin = require(loadModuleFromFramework('@vitejs/plugin-vue'))
	vueJSXPlugin = require(loadModuleFromFramework('@vitejs/plugin-vue-jsx'))
}
if (isReact) {
	reactPlugin = require(loadModuleFromFramework('@vitejs/plugin-react'))
}

const styleImportConfig = {
	include: ['**/*.vue', '**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx', /chunkName/],
	resolves: [AndDesignVueResolve(), VantResolve(), ElementPlusResolve(), NutuiResolve(), AntdResolve()]
}

// Framework-specific server plugins
let frameworkServerPlugins: PluginOption[] = []

const commonServerPlugins = [createStyleImportPlugin(styleImportConfig), viteConfig?.()?.common?.extraPlugin, viteConfig?.()?.server?.extraPlugin]

if (isVue3) {
	frameworkServerPlugins = frameworkServerPlugins.concat(vuePlugin!(viteConfig?.()?.server?.defaultPluginOptions), vueJSXPlugin!())
	frameworkServerPlugins = frameworkServerPlugins.concat(
		createStyleImportPlugin(styleImportConfig),
		!supportOptinalChaining &&
			babel({
				babelHelpers: 'bundled',
				plugins: ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-proposal-nullish-coalescing-operator'],
				exclude: /node_modules|\.(css|less|sass)/,
				extensions: ['.vue', '.ts', '.tsx', '.js']
			})
	)
} else if (isReact) {
	frameworkServerPlugins = frameworkServerPlugins.concat(
		reactPlugin!({
			...viteConfig?.()?.server?.defaultPluginOptions,
			jsxRuntime: 'automatic',
			babel: {
				...babelOptions,
				plugins: [...(babelOptions?.plugins ?? []), ...(!supportOptinalChaining ? ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-proposal-nullish-coalescing-operator'] : [])]
			}
		})
	)
}

const serverPlugins: PluginOption[] = [...frameworkServerPlugins, ...commonServerPlugins]

// Get framework-specific entries
const serverEntry = isReact ? reactServerEntry : vue3ServerEntry
const clientEntry = isReact ? reactClientEntry : vue3ClientEntry

export const serverConfig: UserConfig = {
	...commonConfig(),
	...viteConfig?.().server?.otherConfig,
	plugins: viteConfig?.()?.server?.processPlugin?.(serverPlugins) ?? serverPlugins,
	...(isReact
		? {
				esbuild: {
					...viteConfig?.().server?.otherConfig?.esbuild,
					keepNames: true,
					logOverride: { 'this-is-undefined-in-esm': 'silent' }
				}
			}
		: {}),
	optimizeDeps: {
		...viteConfig?.().server?.otherConfig?.optimizeDeps,
		include: extraInclude.concat(...(viteConfig?.().server?.otherConfig?.optimizeDeps?.include ?? [])),
		esbuildOptions: {
			...viteConfig?.().server?.otherConfig?.optimizeDeps?.esbuildOptions,
			// @ts-expect-error
			bundle: isDev
		}
	},
	build: {
		minify: !process.env.NOMINIFY,
		...viteConfig?.().server?.otherConfig?.build,
		ssr: serverEntry,
		outDir: serverOutPut,
		rollupOptions: {
			...viteConfig?.().server?.otherConfig?.build?.rollupOptions,
			input: isDev ? clientEntry : serverEntry, // setting prebundle list by client-entry in dev
			output: {
				entryFileNames: `${chunkName}.server.js`,
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
// Framework-specific client plugins
let frameworkClientPlugins: PluginOption[] = []
const commonClientPlugins = [createStyleImportPlugin(styleImportConfig), viteConfig?.()?.common?.extraPlugin, viteConfig?.()?.client?.extraPlugin]
if (isVue3) {
	frameworkClientPlugins = [vuePlugin!(viteConfig?.()?.client?.defaultPluginOptions), vueJSXPlugin!()]
} else if (isReact) {
	frameworkClientPlugins = [
		reactPlugin!({
			...viteConfig?.()?.client?.defaultPluginOptions,
			jsxRuntime: 'automatic',
			...babelOptions
		})
	]
}

const clientPlugins: PluginOption[] = [...frameworkClientPlugins, ...commonClientPlugins]
const analyzePlugin = process.env.GENERATE_ANALYSIS ? visualizer({ filename: resolve(getCwd(), './build/stat.html'), open: true }) : null
export const clientConfig: UserConfig = {
	...commonConfig(),
	...viteConfig?.().client?.otherConfig,
	base: isDev ? '/' : getOutputPublicPath(),
	...(isReact
		? {
				esbuild: {
					...viteConfig?.().client?.otherConfig?.esbuild,
					keepNames: true,
					logOverride: { 'this-is-undefined-in-esm': 'silent' }
				},
				optimizeDeps: {
					...viteConfig?.().client?.otherConfig?.optimizeDeps,
					include: ['react-router', ...(getPkgMajorVersion('antd') === 5 ? ['react-is'] : [])].concat(...(viteConfig?.().client?.otherConfig?.optimizeDeps?.include ?? [])),
					exclude: ['ssr-hoc-react'].concat(...(viteConfig?.().client?.otherConfig?.optimizeDeps?.exclude ?? []))
				}
			}
		: {}),
	plugins: viteConfig?.()?.client?.processPlugin?.(clientPlugins) ?? clientPlugins,
	build: {
		minify: !process.env.NOMINIFY,
		...viteConfig?.().client?.otherConfig?.build,
		...(optimize ? { write: false } : {}),
		ssrManifest: true,
		outDir: clientOutPut,
		rollupOptions: {
			...viteConfig?.().client?.otherConfig?.build?.rollupOptions,
			input: clientEntry,
			output: rollupOutputOptions(),
			plugins: [
				chunkNamePlugin(),
				asyncOptimizeChunkPlugin(),
				manifestPlugin(),
				...(isVue3
					? getBabelOptions({
							babel
						})
					: []),
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
