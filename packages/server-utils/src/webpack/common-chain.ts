import * as WebpackChain from 'webpack-chain'
import { loadConfig } from '../loadConfig'

const loadModule = require.resolve

const addImageChain = (chain: WebpackChain, isServer: boolean) => {
  const { publicPath, isDev } = loadConfig()
  const imagePath = 'static/images'
  const truePublicPath = isDev ? `/${imagePath}${publicPath}` : `/client/${imagePath}${publicPath}`
  chain.module
    .rule('images')
    .test(/\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/)
    .use('url-loader')
    .loader(loadModule('url-loader'))
    .options({
      limit: 10000,
      name: '[name].[hash:8].[ext]',
      // require 图片的时候不用加 .default
      esModule: false,
      fallback: {
        loader: loadModule('file-loader'),
        options: {
          emitFile: !isServer,
          publicPath: truePublicPath,
          name: '[name].[hash:8].[ext]',
          esModule: false,
          outputPath: imagePath
        }
      }
    })
    .end()
}

export {
  addImageChain
}
