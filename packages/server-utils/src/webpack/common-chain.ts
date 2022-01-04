import * as WebpackChain from 'webpack-chain'
import { getImageOutputPath } from '../parse'
import { loadModuleFromFramework } from '../cwd'

const addImageChain = (chain: WebpackChain, isServer: boolean) => {
  const { publicPath, imagePath } = getImageOutputPath()
  chain.module
    .rule('images')
    .test(/\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/)
    .use('url-loader')
    .loader(loadModuleFromFramework('url-loader'))
    .options({
      name: '[name].[hash:8].[ext]',
      // require 图片的时候不用加 .default
      esModule: false,
      limit: 4096,
      fallback: {
        loader: loadModuleFromFramework('file-loader'),
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
