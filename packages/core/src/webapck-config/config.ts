import { getCwd } from 'ssr-server-utils'

type ClientLogLevel = 'error'

const publicPath = '/'
const moduleFileExtensions = [
  '.web.mjs',
  '.mjs',
  '.web.js',
  '.js',
  '.web.ts',
  '.ts',
  '.web.tsx',
  '.tsx',
  '.json',
  '.web.jsx',
  '.jsx'
]

const isDev = process.env.NODE_ENV !== 'production'
const port = 8000
const cwd = getCwd()
const chunkName = 'Page'

const clientLogLevel: ClientLogLevel = 'error'
const useHash = false

const webpackStatsOption = {
  assets: true,  // 添加资源信息
  cachedAssets: false,  // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
  children: false, // 添加 children 信息
  chunks: false, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
  colors: true, // 以不同颜色区分构建信息
  modules: false,  // 添加构建模块信息
  warnings: false
}

const getOutput = (funcName: string) => ({
  clientOutPut: `${cwd}/build/${funcName}/client`,
  serverOutPut: `${cwd}/build/${funcName}/server`
})

const webpackDevServerConfig = {
  stats: webpackStatsOption,
  disableHostCheck: true,
  publicPath: publicPath,
  hotOnly: true,
  host: '0.0.0.0',
  sockPort: port,
  hot: true,
  port: port,
  clientLogLevel: clientLogLevel,
  headers: {
    'access-control-allow-origin': '*'
  }
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
  getOutput,
  loadModule,
  webpackDevServerConfig,
  webpackStatsOption
}
