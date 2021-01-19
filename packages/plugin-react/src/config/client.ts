
import * as webpack from 'webpack'
import { getBaseConfig } from './base'

const getClientWebpack = (config) => {
  const { publicPath, isDev, chunkName, getOutput, cwd, useHash, chainClientConfig } = config
  const { api } = config
  const shouldUseSourceMap = isDev || process.env.GENERATE_SOURCEMAP
  const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
  const safePostCssParser = require('postcss-safe-parser')
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  const generateAnalysis = Boolean(process.env.GENERATE_ANALYSIS)
  const loadModule = require.resolve
  const truePublicPath = isDev ? publicPath : `/client${publicPath}`
  getBaseConfig(config)
  api.devtool(isDev ? 'cheap-module-source-map' : (shouldUseSourceMap ? 'source-map' : false))

  api.entry(chunkName)
    .add(loadModule('../entry/client-entry'))
    .end()
    .output
    .path(getOutput().clientOutPut)
    .filename(useHash ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js')
    .chunkFilename(useHash ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js')
    .publicPath(truePublicPath)
    .end()

  api.optimization
    .runtimeChunk(true)
    .splitChunks({
      chunks: 'all',
      name: false,
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
        .use(loadModule('terser-webpack-plugin'), [{
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          },
          extractComments: false,
          parallel: true,
          cache: true,
          sourceMap: shouldUseSourceMap
        }])
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

  api.plugin('define').use(webpack.DefinePlugin, [{
    __isBrowser__: true
  }])

  api.when(!isDev, config => api.plugin('progress').use(loadModule('webpack/lib/ProgressPlugin')))

  api.plugin('moduleNotFound').use(ModuleNotFoundPlugin, [cwd])

  api.plugin('manifest').use(loadModule('webpack-manifest-plugin'), [{
    fileName: 'asset-manifest.json',
    publicPath: truePublicPath
  }])

  api.when(generateAnalysis, config => {
    api.plugin('analyze').use(BundleAnalyzerPlugin)
  })

  chainClientConfig(config) // 合并用户自定义配置

  return api.toConfig()
}

export {
  getClientWebpack
}
