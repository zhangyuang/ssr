import { Configuration, Options } from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import * as Config from 'webpack-chain'

export interface Proxy {
  host: string
  match: RegExp
}

export interface IConfig {
  cwd: string
  isDev: boolean
  publicPath: string
  useHash: boolean
  host: string
  port: number
  sockPort: number | string
  faasPort: number
  chunkName: string
  getOutput: () => {
    clientOutPut: string
    serverOutPut: string
  }
  cssOrder: string[]
  jsOrder: string[]
  staticPrefix: string
  chainServerConfig: (config: Config) => Configuration
  chainClientConfig: (config: Config) => Configuration
  webpackStatsOption: Options.Stats
  moduleFileExtensions: string[]
  whiteList: RegExp[]
  cloudIDE?: boolean
  cssModulesWhiteList: RegExp[]
  prefix?: string
  proxy: Proxy
  dynamic: boolean
  feFramework: string
  mode: string
  webpackDevServerConfig: WebpackDevServer.Configuration
  stream: boolean
}

export interface StyleOptions {
  rule: string
  include?: RegExp | RegExp[]
  exclude?: RegExp | RegExp[]
  modules: boolean
  loader?: string
  importLoaders: number
}
