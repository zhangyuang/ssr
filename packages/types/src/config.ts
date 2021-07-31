import { Configuration, Options, RuleSetCondition } from 'webpack'
import { Argv } from './yargs'
import { Config } from './third-party/webpack-chain'
export interface IConfig {
  cwd: string
  isDev: boolean
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
      less?: any
      sass?: any
      postcss?: {
        options: any
        plugins: any[]
      }
    }
  }
  chainBaseConfig: (config: Config) => Configuration
  chainServerConfig: (config: Config) => Configuration
  chainClientConfig: (config: Config) => Configuration
  webpackStatsOption: Options.Stats
  moduleFileExtensions: string[]
  whiteList: RegExp[]
  cloudIDE?: boolean
  cssModulesWhiteList: RegExp[]
  prefix?: string
  dynamic: boolean
  mode: string
  webpackDevServerConfig?: any
  stream: boolean
  customeHeadScript?: Array<{
    describe: object
    content: string
  }>
  locale?: {
    enable: false
  }
  ssrVueLoaderOptions?: any
  csrVueLoaderOptions?: any
  corejs: boolean
  https: boolean
  babelExtraModule?: RuleSetCondition
  routerPriority?: Record<string, number>
}

type Optional <T>= { [key in keyof T]?: T[key] }

export interface proxyOptions {
  express?: boolean
}
export type UserConfig = Optional<IConfig>

export interface StyleOptions {
  rule: string
  include?: RegExp | RegExp[]
  exclude?: RegExp | RegExp[]
  modules: boolean
  loader?: string
  importLoaders: number
  isServer: boolean
}

export interface IPlugin {
  clientPlugin?: {
    start?: (argv?: Argv) => void
    build?: (argv?: Argv) => void
    deploy?: (argv?: Argv) => void
  }
  serverPlugin?: {
    start?: (argv?: Argv) => void
    build?: (argv?: Argv) => void
    deploy?: (argv?: Argv) => void
  }
}
