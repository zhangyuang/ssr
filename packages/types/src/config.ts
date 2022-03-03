import { Options, RuleSetCondition } from 'webpack'
import * as Config from 'webpack-chain'
import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import { Argv } from './yargs'
import { ISSRContext } from './ctx'

export {
  Config
}
export type Script = Array<{
  describe?: object | {
    attrs: object
  }
  content?: string
}>
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
  extraJsOrder?: string[]
  extraCssOrder?: string[]
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
  chainBaseConfig: (config: Config) => void
  chainServerConfig: (config: Config) => void
  chainClientConfig: (config: Config) => void
  webpackStatsOption: Options.Stats
  moduleFileExtensions: string[]
  whiteList: RegExp[] | string[]
  cloudIDE?: boolean
  prefix?: string
  mode: 'ssr' | 'csr'
  webpackDevServerConfig?: any
  stream: boolean
  customeHeadScript?: (ctx: ISSRContext) => Script | Script
  customeFooterScript?: (ctx: ISSRContext) => Script | Script
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
  disableClientRender?: boolean
  manifestPath: string
  proxyKey: string[]
  vue3ServerEntry: string
  vue3ClientEntry: string
  vueServerEntry: string
  vueClientEntry: string
  reactServerEntry: string
  reactClientEntry: string
  isVite: boolean
  isCI: boolean
  supportOptinalChaining: boolean
  viteConfig?: () => {
    common?: {
    // 双端通用插件
      extraPlugin?: any[]
    }
    client?: {
      defaultPluginOptions?: any
      define?: Record<string, any>
      extraPlugin?: any[]
    }
    server?: {
      defaultPluginOptions?: any
      define?: Record<string, any>
      extraPlugin?: any[]
    }
  }
  define?: {
    base?: Record<string, string>
    client?: Record<string, string>
    server?: Record<string, string>
  }
  babelOptions?: RollupBabelInputPluginOptions
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
