import type { Options, compilation } from 'webpack'
import type WebpackChainConfig from 'webpack-chain'
import type { PluginOption, ServerOptions, UserConfig as ViteConfig, CSSOptions } from 'vite'
import type { Plugin as PostCssPlugin } from 'postcss'
import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import type { PluginItem as BabelPluginItem } from '@babel/core'
import { Argv } from './yargs'
import { ISSRContext } from './ctx'

export type PluginItem = BabelPluginItem
export interface SSRModule extends compilation.Module {
  resource?: string
  dependencies?: Array<{request: string}>
  nameForCondition?: () => string
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
  describe?: object | {
    attrs: object
  }
  content?: string
}>

export type Json = string | number | boolean | { [key: string]: Json } | undefined

export interface IConfig {
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
  assetsDir?: string
  proxy?: any
  cssOrder: string[]
  jsOrder: string[]
  extraJsOrder?: ((ctx: ISSRContext) => string[]) | string[] | undefined
  extraCssOrder?: ((ctx: ISSRContext) => string[]) | string[] | undefined
  jsOrderPriority?: Record<string, number> | ((params: {chunkName: string}) => Record<string, number>)
  cssOrderPriority?: Record<string, number> | ((params: {chunkName: string}) => Record<string, number>)
  css?: () => {
    loaderOptions?: {
      cssOptions?: any
      less?: {
        lessOptions?: any /*! transfer options to less */
        /*! The following options  options only take effect in webpack */
        additionalData?: string| Function
        sourceMap?: boolean
        webpackImporter?: Boolean
        implementation?: Object
      }
      sass?: any /*! only webpack */
      scss?: any /*! only vite */
      postcss?: {
        options?: Exclude<CSSOptions['postcss'], string>
        plugins?: PostCssPlugin[]
      }
    }
  }
  chainBaseConfig: (config: Chain, isServer: boolean) => void
  chainServerConfig: (config: Chain) => void
  chainClientConfig: (config: Chain) => void
  webpackStatsOption: Options.Stats
  moduleFileExtensions: string[]
  whiteList: Array<RegExp|string>
  cloudIDE?: boolean
  prefix: string
  clientPrefix?: string
  mode: 'ssr' | 'csr'
  webpackDevServerConfig?: any
  stream: boolean
  bigpipe?: boolean
  customeHeadScript?: ((ctx: ISSRContext) => Script) | Script
  customeFooterScript?: ((ctx: ISSRContext) => Script) | Script
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
  vue3ServerEntry: string
  vue3ClientEntry: string
  vueServerEntry: string
  vueClientEntry: string
  reactServerEntry: string
  reactClientEntry: string
  react18ServerEntry: string
  react18ClientEntry: string
  isVite: boolean
  optimize: boolean
  supportOptinalChaining: boolean
  onError?: (e: any) => (null|string)
  onReady?: () => any
  viteConfig?: () => {
    common?: {
      // 双端通用配置
      extraPlugin?: PluginOption | PluginOption[]
      server?: ServerOptions
    }
    client?: {
      defaultPluginOptions?: any /*! 为默认装载的插件定义 options, vue3 场景是 @vitejs/plugin-vue, react 场景是 @vitejs/plugin-react */
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
  writeDebounceTime: number
  dynamicFile: {
    serverBundle: string
    asyncChunkMap: string
    assetManifest: string
    configFile?: string
  }
  staticConfigPath: string
  framework?: string
}

export interface proxyOptions {
  express?: boolean
}
export type UserConfig = Partial<IConfig>

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
