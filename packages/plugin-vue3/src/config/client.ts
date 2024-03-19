import { loadConfig, getOutputPublicPath, loadModuleFromFramework, getSplitChunksOptions, getBuildConfig, terserConfig, asyncChunkMap } from 'ssr-common-utils'
import * as WebpackChain from 'webpack-chain'
import { getBaseConfig } from './base'

const safePostCssParser = require('postcss-safe-parser')

const loadModule = loadModuleFromFramework

const getClientWebpack = (chain: WebpackChain) => {
  const { isDev, chunkName, getOutput, chainClientConfig } = loadConfig()
  const shouldUseSourceMap = isDev || Boolean(process.env.GENERATE_SOURCEMAP)
  const publicPath = getOutputPublicPath()

  getBaseConfig(chain, false)
  const buildConfig = getBuildConfig()
  chain.entry(chunkName)
    .add(require.resolve('../entry/client-entry'))
    .end()
    .output
    .path(getOutput().clientOutPut)
    .filename(buildConfig.jsBuldConfig.fileName)
    .chunkFilename(buildConfig.jsBuldConfig.chunkFileName)
    .publicPath(publicPath)
    .end()

  chain.optimization
    .runtimeChunk(true)
    .splitChunks(getSplitChunksOptions(asyncChunkMap))
    .when(!isDev, optimization => {
      optimization.minimizer('terser')
        .use(loadModule('terser-webpack-plugin'), [terserConfig()])
      optimization.minimizer('optimize-css').use(loadModule('optimize-css-assets-webpack-plugin'), [{
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: shouldUseSourceMap ? {
            inline: false,
            annotation: true
          } : false
        }
      }])
    })

  chain.plugin('manifest').use(loadModule('webpack-manifest-plugin'), [{
    fileName: 'asset-manifest.json'
  }])

  chainClientConfig(chain) // 合并用户自定义配置

  return chain.toConfig()
}

export {
  getClientWebpack
}
