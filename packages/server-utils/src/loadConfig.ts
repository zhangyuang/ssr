import { IConfig } from 'ssr-types'
import { getCwd, getUserConfig } from './cwd'

const loadConfig = (): IConfig => {
  const userConfig = getUserConfig()
  const cwd = getCwd()
  const mode = 'ssr'
  const stream = false
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
    '.jsx',
    '.vue',
    '.css'
  ]

  const isDev = process.env.NODE_ENV !== 'production'

  const fePort = 8000

  const serverPort = process.env.SERVER_PORT ?? 3000

  const host = '0.0.0.0'

  const chunkName = 'Page'

  const clientLogLevel: ClientLogLevel = 'error'

  const useHash = !isDev // 生产环境默认生成hash

  const whiteList: RegExp[] = []

  const jsOrder = [`runtime~${chunkName}.js`, 'vendor.js', `${chunkName}.js`]

  const cssOrder = [`${chunkName}.css`]

  const webpackStatsOption = {
    assets: true, // 添加资源信息
    cachedAssets: false, // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
    children: false, // 添加 children 信息
    chunks: false, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
    colors: true, // 以不同颜色区分构建信息
    modules: false, // 添加构建模块信息
    warnings: false,
    entrypoints: false
  }

  const dynamic = true

  const corejs = false
  const getOutput = () => ({
    clientOutPut: `${cwd}/build/client`,
    serverOutPut: `${cwd}/build/server`
  })

  const cssModulesWhiteList = [/antd/, /swiper/]
  const webpackDevServerConfig = Object.assign({
    stats: webpackStatsOption,
    disableInfo: true, // 关闭webpack-dev-server 自带的server Info信息
    disableHostCheck: true,
    publicPath: publicPath,
    hotOnly: true,
    host,
    sockPort: fePort,
    hot: true,
    port: fePort,
    clientLogLevel: clientLogLevel,
    progress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  }, userConfig.webpackDevServerConfig)

  const chainBaseConfig = () => {
    // 覆盖默认webpack配置
  }
  const chainClientConfig = () => {
    // 覆盖默认 client webpack配置
  }
  const chainServerConfig = () => {
    // 覆盖默认 server webpack配置
  }
  const config = Object.assign({}, {
    chainBaseConfig,
    chainServerConfig,
    chainClientConfig,
    cwd,
    isDev,
    publicPath,
    useHash,
    host,
    moduleFileExtensions,
    fePort,
    serverPort,
    chunkName,
    jsOrder,
    cssOrder,
    getOutput,
    webpackStatsOption,
    whiteList,
    cssModulesWhiteList,
    dynamic,
    mode,
    stream,
    corejs
  }, userConfig)

  config.webpackDevServerConfig = webpackDevServerConfig // 防止把整个 webpackDevServerConfig 全量覆盖了

  return config
}

export {
  loadConfig
}
