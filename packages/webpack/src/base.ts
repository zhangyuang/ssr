
import { join } from 'path'
import * as Config from 'webpack-chain'
import { Mode } from 'ssr-types'
import { getPagesDir, getCwd } from 'ssr-server-utils'
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
      .set('@', getPagesDir())
    .end()

  config.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
        .use('url-loader')
          .loader(loadModule('url-loader'))
          .options({
            limit: 10000,
            name: 'static/[name].[hash:8].[ext]',
            // require 图片的时候不用加 .default
            esModule: false,
            fallback: {
              loader: loadModule('file-loader'),
              options: {
                name: 'static/[name].[hash:8].[ext]',
                esModule: false
              }
            }
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
                      modules: false,
                      corejs: 3,
                      useBuiltIns: 'usage'
                    }
                  ],
                  // [loadModule('babel-preset-react-app'), { flow: false, typescript: true }]
                  [loadModule('@babel/preset-react')],
                  [loadModule('@babel/typescript')]
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
        .rule('svg')
        .test(/\.(svg)(\?.*)?$/)
        .use('file-loader')
          .loader(loadModule('file-loader'))
          .options({
            name: 'static/[name].[hash:8].[ext]',
            esModule: false
          })
        .end()

  config.module
        .rule('fonts')
        .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
        .use('file-loader')
          .loader(loadModule('file-loader'))
          .options({
            name: 'static/[name].[hash:8].[ext]',
            esModule: false
          })

  config.plugin('minify-css').use(MiniCssExtractPlugin, [{
    filename: 'static/css/[name].css',
    chunkFilename: 'static/css/[name].chunk.css'
  }])
  return config
}

export {
  getBaseConfig
}
