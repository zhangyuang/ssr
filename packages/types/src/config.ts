import { Configuration, Options } from 'webpack'
import * as Config from 'webpack-chain'

export interface BuildConfig {
  cwd: string
  isDev: boolean
  publicPath: string
  useHash: boolean,
  host: string
  port: number
  faasPort: number
  chunkName: string
  getOutput: (funcName: string) => {
    clientOutPut: string
    serverOutPut: string
  }
  loadModule: RequireResolve,
  injectCss: JSX.Element[]
  injectScript: JSX.Element[]
  chainServerConfig: (config: Config) => Configuration
  chainClientConfig: (config: Config) => Configuration
  webpackStatsOption: Options.Stats
  moduleFileExtensions: string[]
  postCssPlugin: any
}
