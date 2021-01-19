import { join } from 'path'
import * as webpack from 'webpack'
import { buildConfig } from 'ssr-server-utils'
import { getBaseConfig } from './base'
import { nodeExternals } from '../plugins/external'

const { isDev, cwd, getOutput, chainServerConfig, whiteList } = buildConfig
const loadModule = require.resolve
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const getServerWebpack = () => {
  const config = getBaseConfig()

  config.devtool(isDev ? 'eval-source-map' : false)

  config.target('node')

  config.entry('Page')
    .add(loadModule('../entry/server-entry'))
    .end()
    .output
    .path(getOutput().serverOutPut)
    .filename('[name].server.js')
    .libraryTarget('commonjs')

  config.module
    .rule('compile')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .exclude
    .add(/node_modules/)
    .end()
    .use('babel-loader')
    .loader('babel-loader')
    .options({
      cacheDirectory: true,
      cacheCompression: false,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false
          }
        ],
        ['react-app', { flow: false, typescript: true }]
      ],
      plugins: [
        [
          'import',
          {
            libraryName: 'antd',
            libraryDirectory: 'lib',
            style: 'css'
          }
        ]
      ]
    })
    .end()

  config.externals(nodeExternals({
    whitelist: [/\.(css|less|sass|scss)$/, /ssr-temporary-routes/, /^antd.*?css/].concat(whiteList || []),
    // externals Dir contains packages/webpack-config/node_modules spa/node_modules ssr/node_modules
    modulesDir: [join(__dirname, '../node_modules'), join(cwd, './node_modules'), join(__dirname, '../../../node_modules')]
  }))

  config.when(isDev, () => {
    config.watch(true)
  })
  config.when(true, config => {
    config.plugin('analyze').use(BundleAnalyzerPlugin)
  })
  config.plugin('define').use(webpack.DefinePlugin, [{
    __isBrowser__: false
  }])

  chainServerConfig(config) // 合并用户自定义配置
  return config.toConfig()
}

export {
  getServerWebpack
}
