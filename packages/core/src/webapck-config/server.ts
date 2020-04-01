
import * as webpack from 'webpack'
import { Mode } from 'ssr-client-utils'
import { getBaseConfig } from './base'
import { isDev, cwd, serverOutPut, loadModule } from './config'

const nodeExternals = require('webpack-node-externals')

const getServerWebpack = () => {
  const config = getBaseConfig()
  const mode = process.env.NODE_ENV as Mode
  config.mode(mode)

  config.devtool(isDev ? 'eval-source-map' : false)

  config.target('node')

  config.entry('Page')
          .add(loadModule('../entry'))
          .end()
          .output
            .path(`${cwd}/${serverOutPut}`)
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

  config.when(isDev, () => {
    config.watch(true)
  })

  config.plugin('define').use(webpack.DefinePlugin, [{
    '__isBrowser__': false
  }])

  return config.toConfig()
}

export {
  getServerWebpack
}
