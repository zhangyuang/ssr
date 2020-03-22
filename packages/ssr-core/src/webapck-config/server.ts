
import webpack from 'webpack'
import Config from 'webpack-chain'
import { baseConfig } from './base'
import { appConfig } from './config'

const { root,isDev } = appConfig
const config = new Config()
const nodeExternals = require('webpack-node-externals')

config.merge(baseConfig)

config.devtool(isDev ? 'eval-source-map' : false)

config.target('node')

config.entry('Page')
        .add('src/index')
        .end()
        .output
          .path('dist')
          .filename('[name].server.js')
          .libraryTarget('commonjs2')

config.externals(nodeExternals({
  whitelist: /\.(css|less|sass|scss)$/,
  modulesDir: root // 保证读取的node_modules为当然应用的根目录
}))

config.plugin('define').use(webpack.DefinePlugin, [{
  '__isBrowser__': false
}])

const serverConfig = config.toConfig()

export {
  serverConfig
}
