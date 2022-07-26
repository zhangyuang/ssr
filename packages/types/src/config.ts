import { Options, RuleSetCondition, compilation } from 'webpack'
import * as WebpackChainConfig from 'webpack-chain'
import type { PluginOption, ServerOptions, UserConfig as ViteConfig } from 'vite'
import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import { Argv } from './yargs'
import { ISSRContext } from './ctx'

export interface SSRModule extends compilation.Module {
  resource?: string
  dependencies?: Array<{request: string}>
  nameForCondition?: () => string
}

export type Chain = WebpackChainConfig

export type Script = Array<{
  describe?: object | {
    attrs: object
  }
  content?: string
}>
export type Json = string | number | boolean | { [key: string]: Json }

export interface IConfig {
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
  proxy?: any
  cssOrder: string[]
  jsOrder: string[]
  extraJsOrder?: ((ctx: ISSRContext) => string[]) | string[] | undefined
  extraCssOrder?: ((ctx: ISSRContext) => string[]) | string[] | undefined
  css?: () => {
    loaderOptions?: {
      cssOptions?: any
      less?: any // both vite and webpack
      sass?: any // only webpack
      scss?: any // only vite
      postcss?: { // both vite and webpack
        options: any
        plugins: any[]
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
  babelExtraModule?: RuleSetCondition
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
  isVite: boolean
  optimize: boolean
  supportOptinalChaining: boolean
  viteConfig?: () => {
    common?: {
      // 双端通用配置
      extraPlugin?: PluginOption | PluginOption[]
      server?: ServerOptions
    }
    client?: {
      defaultPluginOptions?: any // 为默认装载的插件定义 options, vue3 场景是 @vitejs/plugin-vue, react 场景是 @vitejs/plugin-react
      extraPlugin?: PluginOption | PluginOption[]
      otherConfig?: ViteConfig
    }
    server?: {
      externals?: string[]
      defaultPluginOptions?: any
      extraPlugin?: PluginOption | PluginOption[]
      otherConfig?: ViteConfig
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
  babelOptions?: RollupBabelInputPluginOptions
  hashRouter?: boolean
  htmlTemplate?: string
  writeDebounceTime: number
  dynamicFile: {
    serverBundle: string
    asyncChunkMap: string
    assetManifest: string
    configFile?: string
  }
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
