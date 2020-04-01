import { getCwd } from 'ssr-server-utils'

type ClientLogLevel = 'error'

const publicPath = '/'
const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx'
]

const isDev = process.env.NODE_ENV !== 'production'
const port = 8000
const cwd = getCwd()
const chunkName = 'Page'
const clientOutPut = 'build/client'
const serverOutPut = 'build/server'
const clientLogLevel: ClientLogLevel = 'error'
const useHash = false
const webpackDevServerConfig = {
  // quiet: true,
  disableHostCheck: true,
  publicPath: publicPath,
  hotOnly: true,
  host: '0.0.0.0',
  sockPort: port,
  contentBase: `${cwd}/${clientOutPut}`,
  hot: true,
  port: port,
  clientLogLevel: clientLogLevel,
  headers: {
    'access-control-allow-origin': '*'
  }
}
const webpackStatsOption = {
  assets: true,  // 添加资源信息
  cachedAssets: false,  // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
  children: false, // 添加 children 信息
  chunks: false, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
  colors: true,
  modules: false  // 添加构建模块信息

}
const loadModule = require.resolve
export {
  cwd,
  isDev,
  publicPath,
  useHash,
  moduleFileExtensions,
  port,
  chunkName,
  clientOutPut,
  serverOutPut,
  loadModule,
  webpackDevServerConfig,
  webpackStatsOption
}
