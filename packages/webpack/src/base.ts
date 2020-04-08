
import { join } from 'path'
import * as Config from 'webpack-chain'
import { Mode } from 'ssr-types'
import { getFeDir, getCwd } from 'ssr-server-utils'
import { moduleFileExtensions, loadModule } from './config'

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const getBaseConfig = () => {

  const config = new Config()
  const mode = process.env.NODE_ENV as Mode
  config.mode(mode)
  config.module.strictExportPresence(true)
  config
    .resolve
    .modules
      .add(join(getCwd(), './node_modules'))
      .add(join(__dirname, '../node_modules'))
      .add(join(__dirname, '../../../node_modules'))
      .end()
    .extensions.merge(moduleFileExtensions)
    .end()
    .alias
      .set('@', getFeDir())
    .end()

  config.module
      .rule('image')
          .test([/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/])
          .use('url-loader')
              .loader(loadModule('url-loader'))
              .options({
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]'
              })
              .end()

  config.module
      .rule('compile')
          .test(/\.(js|mjs|jsx|ts|tsx)$/)
          .exclude
              .add(/node_modules/)
              .end()
          .use('babel-loader')
              .loader(loadModule('babel-loader'))
              .options({
                cacheDirectory: true,
                cacheCompression: false,
                presets: [
                  [
                    loadModule('@babel/preset-env'),
                    {
                      modules: false
                    }
                  ],
                  [loadModule('babel-preset-react-app'), { flow: false, typescript: true }]
                ],
                plugins: [
                  [
                    loadModule('babel-plugin-import'),
                    {
                      libraryName: 'antd',
                      libraryDirectory: 'es',
                      style: 'css'
                    }
                  ]
                ]
              })
              .end()

  config.module
      .rule('media')
        .exclude
          .add([[/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/]])
          .end()
      .use('file-loader')
        .loader('file-loader')
        .options({
          name: 'static/media/[name].[hash:8].[ext]'
        })
        .end()

  config.plugin('minify-css').use(MiniCssExtractPlugin, [{
    filename: 'static/css/[name].css',
    chunkFilename: 'static/css/[name].chunk.css'
  }])
  return config
}

export {
  getBaseConfig
}
