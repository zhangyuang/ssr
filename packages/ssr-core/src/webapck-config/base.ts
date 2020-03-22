
import Config from 'webpack-chain'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { Mode } from '../interface/webpack-config'
import { appConfig } from './config'

const { moduleFileExtensions } = appConfig
const config = new Config()
const baseConfig = config
const mode = process.env.NODE_ENV as Mode

config.stats({ children: false,entrypoints: false })
config.mode(mode)
config.module.strictExportPresence(true)
moduleFileExtensions.map(item => {
  config.resolve.extensions.add(`.${item}`)
})

config.module
    .rule('url')
        .test([/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/])
        .use('url-loader')
            .loader('url-loader')
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
                '@babel/preset-react'
              ],
              plugins: []
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

export {
  baseConfig
}
