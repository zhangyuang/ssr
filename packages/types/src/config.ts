import type { PluginItem as BabelPluginItem } from '@babel/core'
import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import type { Plugin as PostCssPlugin } from 'postcss'
import type { CSSOptions, PluginOption, ServerOptions, UserConfig as ViteConfig } from 'vite'
import type { Options } from 'webpack'
import type { StatsOptions, DevServer } from '@rspack/core'
import type WebpackChainConfig from 'webpack-chain'
import type * as RspackChain from 'rspack-chain'
import { ISSRContext } from './ctx'
import { Argv } from './yargs'

// Instantiate the configuration with a new API
export type PluginItem = BabelPluginItem
type ToolType = 'webpack' | 'vite' | 'rspack'
type ChainType<T extends ToolType> = T extends 'rspack' ? RspackChain : WebpackChainConfig
type SSRViteConfig = () => {
	common?: {
		extraPlugin?: PluginOption | PluginOption[]
		server?: ServerOptions
		otherConfig?: ViteConfig
	}
	client?: {
		defaultPluginOptions?: any
		extraPlugin?: PluginOption | PluginOption[]
		otherConfig?: ViteConfig
		processPlugin?: (plugins: PluginOption[]) => PluginOption[]
	}
	server?: {
		externals?: string[]
		defaultPluginOptions?: any
		extraPlugin?: PluginOption | PluginOption[]
		otherConfig?: ViteConfig
		processPlugin?: (plugins: PluginOption[]) => PluginOption[]
	}
}

export interface PkgJson {
	name: string
	version: string
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
}

export type Chain = WebpackChainConfig
export type Script = Array<{
	tagName?: string
	describe?:
		| object
		| {
				attrs: object
		  }
	content?: string
}>

export type Json = string | number | boolean | { [key: string]: Json } | undefined

export type IConfig<T extends ToolType = ToolType> = {
	rootId: string
	cwd: string
	alias?: Record<string, string>
	isDev: boolean
	dynamic: boolean
	publicPath: string
	useHash: boolean
	host: string
	fePort: number
	serverPort: number
	chunkName: string
	getOutput: () => {
		clientOutPut: string
		serverOutPut: string
	}
	cssInline?: 'all' | string[]
	jsInline?: 'all' | string[]
	assetsDir?: string
	proxy?: any
	cssOrder: string[]
	jsOrder: string[]
	extraJsOrder?: ((ctx: ISSRContext) => string[]) | string[] | undefined
	extraCssOrder?: ((ctx: ISSRContext) => string[]) | string[] | undefined
	jsOrderPriority?: Record<string, number> | ((params: { chunkName: string }) => Record<string, number>)
	cssOrderPriority?: Record<string, number> | ((params: { chunkName: string }) => Record<string, number>)
	css?: () => {
		loaderOptions?: {
			cssOptions?: any
			less?: {
				/**
				 * transfer options to less
				 */
				lessOptions?: any
				/**
				 * The following options  options only take effect in webpack
				 */
				additionalData?: string | Function
				sourceMap?: boolean
				webpackImporter?: Boolean
				implementation?: Object
			}
			/**
			 * only take effect in webpack
			 */
			sass?: any
			/**
			 * only take effect in vite
			 */
			scss?: any
			postcss?: {
				options?: Exclude<CSSOptions['postcss'], string>
				plugins?: PostCssPlugin[]
			}
		}
	}
	chainBaseConfig: (config: ChainType<T>, isServer: boolean) => void
	chainServerConfig: (config: ChainType<T>) => void
	chainClientConfig: (config: ChainType<T>) => void
	webpackStatsOption: Options.Stats | StatsOptions
	moduleFileExtensions: string[]
	whiteList: Array<RegExp | string>
	cloudIDE?: boolean
	prefix: string
	clientPrefix?: string
	mode: 'ssr' | 'csr'
	stream: boolean
	bigpipe?: boolean
	customeHeadScript?: ((ctx: ISSRContext) => Script) | Script
	customeFooterScript?: ((ctx: ISSRContext) => Script) | Script
	defaultScriptProps?: Record<string, string> | ((src: string) => Record<string, string>)
	locale?: {
		enable: boolean
	}
	ssrVueLoaderOptions?: any
	csrVueLoaderOptions?: any
	corejs?: boolean
	corejsOptions?: Object
	https: boolean | object
	babelExtraModule?: RegExp[]
	routerPriority?: Record<string, number>
	routerOptimize?: {
		include?: string[]
		exclude?: string[]
	}
	parallelFetch?: boolean
	nestStartTips?: string
	manifestPath: string
	proxyKey: string[]
	tool?: 'webpack' | 'vite' | 'rspack'
	isVite: boolean
	supportOptinalChaining: boolean
	onError?: (e: any) => null | string
	onReady?: () => any
	hmr?: {
		host?: string
		port?: number
	}
	define?: {
		base?: Record<string, string>
		client?: Record<string, string>
		server?: Record<string, string>
	}
	babelOptions?: RollupBabelInputPluginOptions & {
		include?: RegExp[]
	}
	hashRouter?: boolean
	htmlTemplate?: string
	dynamicFile: {
		serverBundle: string
		asyncChunkMap: string
		assetManifest: string
		configFile?: string
	}
	staticConfigPath: string
	framework?: string
	/**
	 * react场景设置默认的stream缓冲区大小默认为 16kb，当页面体积过大超过限制时会渲染失败，单位byte,(1024*1024 = 1mb)
	 */
	streamHighWaterMark?: number
	asyncGlobalData?: Record<string, any>
	clientHistoryRouterMode?: 'webHistory' | 'memoryHistory'
	defaultBrowserTarget?: Record<string, string>
} & (T extends ToolType
	? {
			viteConfig?: SSRViteConfig
			webpackDevServerConfig?: any
			rspackDevServerConfig?: DevServer
		}
	: T extends 'vite'
		? {
				viteConfig?: ViteConfig
			}
		: T extends 'webpack'
			? {
					webpackDevServerConfig?: any
				}
			: T extends 'rspack'
				? {
						rspackDevServerConfig?: DevServer
					}
				: {})

export interface proxyOptions {
	express?: boolean
}
export type UserConfig<T extends ToolType = ToolType> = Partial<IConfig<T>>

export interface StyleOptions {
	rule: string
	include?: RegExp | RegExp[]
	exclude?: RegExp | RegExp[]
	loader?: string
	importLoaders: number
	isServer: boolean
}

export interface IPlugin {
	clientPlugin?: {
		name: string
		start?: (argv?: Argv) => void
		build?: (argv?: Argv) => void
		deploy?: (argv?: Argv) => void
	}
	serverPlugin?: {
		name: string
		start?: (argv?: Argv) => void
		build?: (argv?: Argv) => void
		deploy?: (argv?: Argv) => void
	}
}

export interface Vue3RenderRes {
	html: string
	teleportsContext: {
		teleports?: Record<string, string> | undefined
	}
}
