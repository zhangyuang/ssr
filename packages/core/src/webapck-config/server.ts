
import webpack from 'webpack'
import Config from 'webpack-chain'
import { baseConfig } from './base'
import { appConfig } from './config'

const { isDev } = appConfig
const config = new Config()
const nodeExternals = require('webpack-node-externals')

config.merge(baseConfig)

config.devtool(isDev ? 'eval-source-map' : false)

config.target('node')

config.entry('Page')
        .add('src/index')
        .end()
        .output
          .path('bundle/server')
          .filename('[name].server.js')
          .libraryTarget('commonjs2')

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
  whitelist: /\.(css|less|sass|scss)$/
}))

config.plugin('define').use(webpack.DefinePlugin, [{
  '__isBrowser__': false
}])

const serverConfig = config.toConfig()

export {
  serverConfig
}
