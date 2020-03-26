
import * as webpack from 'webpack'
import * as Config from 'webpack-chain'
import { Argv } from '@ssr/utils'
import { baseConfig } from './base'
import { publicPath,isDev, chunkName } from './config'

const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const safePostCssParser = require('postcss-safe-parser')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const shouldUseSourceMap = isDev || process.env.GENERATE_SOURCEMAP
const generateAnalysis = Boolean(process.env.GENERATE_ANALYSIS)

const config = new Config()

config.merge(baseConfig)

const getClientWebpack = (argv: Argv) => {

  config.devtool(isDev ? 'cheap-module-source-map' : (shouldUseSourceMap ? 'source-map' : false))

  config.entry(chunkName)
          .add('../entry.tsx')
          .end()
          .output
            .path('bundle/client')
            .filename('static/js/[name].js')
            .chunkFilename('static/js/[name].chunk.js')
            .publicPath(publicPath)

  config.optimization
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
    .when(!isDev, config => {
      config.minimizer('js')
        .use(TerserPlugin, [{
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
          parallel: true,
          cache: true,
          sourceMap: shouldUseSourceMap
        }])
        .use(OptimizeCSSAssetsPlugin, [{
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                inline: false,
                annotation: true
              } : false
          }
        }])
    })

  config.module
      .rule('less')
        .test(/\.less$/)
        .use(MiniCssExtractPlugin.loader)
          .end()
        .use('css-loader')
          .loader('css-loader')
          .options({
            importLoaders: 2,
            modules: true,
            getLocalIdent: getCSSModuleLocalIdent
          })
          .end()
        .use('postcss-loader')
          .loader('postcss-loader')
          .options({
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009'
                },
                stage: 3
              })
            ]
          })
          .end()
        .use('less-loader')
          .loader('less-loader')
          .end()

  config.plugin('define').use(webpack.DefinePlugin, [{
    '__isBrowser__': true,
    'routes': argv.yml.render
  }])

  config.plugin('moduleNotFound').use(ModuleNotFoundPlugin, [root])

  config.plugin('manifest').use(ManifestPlugin, [{
    fileName: 'asset-manifest.json',
    publicPath: publicPath
  }])

  config.when(generateAnalysis, config => {
    config.plugin('analyze').use(BundleAnalyzerPlugin)
  })
  return config.toConfig()
}

export {
  getClientWebpack
}
