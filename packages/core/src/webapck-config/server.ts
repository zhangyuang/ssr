import { join } from 'path'
import * as webpack from 'webpack'
import { getBaseConfig } from './base'
import { isDev, cwd, getOutput, loadModule } from './config'
import { nodeExternals } from './plugins/external'

const getServerWebpack = (argv) => {
  const { funcName } = argv.faasRoutes[0]
  const config = getBaseConfig()

  config.devtool(isDev ? 'eval-source-map' : false)

  config.target('node')

  config.entry('Page')
          .add(loadModule('../entry'))
          .end()
          .output
            .path(getOutput(funcName).serverOutPut)
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
    whitelist: /\.(css|less|sass|scss)$|ssr\-cache/,
    // externals Dir contains packages/core/node_modules ssr-with-ts/node_modules ssr/node_modules
    modulesDir: [join(__dirname,'../../node_modules'), join(cwd, './node_modules'), join(__dirname, '../../../../node_modules') ]
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
