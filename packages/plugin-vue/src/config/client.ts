
import { loadConfig, cryptoAsyncChunkName, getOutputPublicPath, loadModuleFromFramework, getBuildConfig, terserConfig } from 'ssr-common-utils'
import * as WebpackChain from 'webpack-chain'
import { getBaseConfig } from './base'

const safePostCssParser = require('postcss-safe-parser')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const generateAnalysis = Boolean(process.env.GENERATE_ANALYSIS)
const loadModule = loadModuleFromFramework
const asyncChunkMap: {
  val: Record<string, string[]>
} = {
  val: {}
}

const getClientWebpack = (chain: WebpackChain) => {
  const { isDev, chunkName, getOutput, chainClientConfig } = loadConfig()
  const buildConfig = getBuildConfig()
  const shouldUseSourceMap = isDev || Boolean(process.env.GENERATE_SOURCEMAP)
  const publicPath = getOutputPublicPath()
  getBaseConfig(chain, false)
  chain.devtool(isDev ? 'eval-source-map' : (shouldUseSourceMap ? 'source-map' : false))
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
    .splitChunks({
      chunks: 'all',
      name (module: any, chunks: any, cacheGroupKey: string) {
        return cryptoAsyncChunkName(chunks, asyncChunkMap.val)
      },
      cacheGroups: {
        vendors: {
          test: (module: any) => {
            return module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.match('node_modules')
          },
          name: 'vendor'
        }
      }
    })
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

  chain.when(generateAnalysis, chain => {
    chain.plugin('analyze').use(BundleAnalyzerPlugin)
  })

  chainClientConfig(chain) // 合并用户自定义配置

  return chain.toConfig()
}

export {
  getClientWebpack
}
