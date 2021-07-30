import * as WebpackChain from 'webpack-chain'
import { getImageOutputPath } from '../parse'

const loadModule = require.resolve

const addImageChain = (chain: WebpackChain, isServer: boolean) => {
  const { publicPath, imagePath } = getImageOutputPath()
  chain.module
    .rule('images')
    .test(/\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/)
    .use('url-loader')
    .loader(loadModule('url-loader'))
    .options({
      limit: false, // 关闭 base64
      name: '[name].[hash:8].[ext]',
      // require 图片的时候不用加 .default
      esModule: false,
      fallback: {
        loader: loadModule('file-loader'),
        options: {
          emitFile: !isServer,
          publicPath,
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
