import { promises } from 'fs'
import { resolve } from 'path'
import { loadConfig, getCwd } from 'ssr-server-utils'
import * as webpack from 'webpack'
import * as WebpackChain from 'webpack-chain'
import { getBaseConfig } from './base'

const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
const safePostCssParser = require('postcss-safe-parser')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const generateAnalysis = Boolean(process.env.GENERATE_ANALYSIS)
const loadModule = require.resolve
let asyncChunkMap: Record<string, string> = {}

const getClientWebpack = (chain: WebpackChain) => {
  const { publicPath, isDev, chunkName, getOutput, cwd, useHash, chainClientConfig } = loadConfig()
  const shouldUseSourceMap = isDev || process.env.GENERATE_SOURCEMAP
  const truePublicPath = isDev ? publicPath : `${publicPath}client/`
  getBaseConfig(chain, false)
  chain.devtool(isDev ? 'cheap-module-source-map' : (shouldUseSourceMap ? 'source-map' : false))
  chain.entry(chunkName)
    .add(loadModule('../entry/client-entry'))
    .end()
    .output
    .path(getOutput().clientOutPut)
    .filename(useHash ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js')
    .chunkFilename(useHash ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js')
    .publicPath(truePublicPath)
    .end()
  chain.optimization
    .runtimeChunk(true)
    .splitChunks({
      chunks: 'all',
      name (module: any, chunks: any, cacheGroupKey: string) {
        const allChunksNames = chunks.map((item: any) => item.name).join('~')
        const allChunksNamesArr = allChunksNames.split('~')
        if (allChunksNamesArr.length >= 2 && !asyncChunkMap[allChunksNames]) {
          asyncChunkMap[allChunksNames] = allChunksNamesArr
        }
        return allChunksNames
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

  chain.plugin('define').use(webpack.DefinePlugin, [{
    __isBrowser__: true
  }])

  chain.plugin('moduleNotFound').use(ModuleNotFoundPlugin, [cwd])

  chain.plugin('manifest').use(loadModule('webpack-manifest-plugin'), [{
    fileName: 'asset-manifest.json',
    publicPath: truePublicPath
  }])

  chain.when(generateAnalysis, chain => {
    chain.plugin('analyze').use(BundleAnalyzerPlugin)
  })
  chain.plugin('WriteAsyncManifest').use(
    class WriteAsyncCssManifest {
      apply (compiler: any) {
        compiler.hooks.watchRun.tap('beforeRun', async () => {
          // 每次构建前清空上一次的 chunk 信息
          asyncChunkMap = {}
        })
        compiler.hooks.done.tapAsync(
          'WriteAsyncCssManifest',
          async (params: any, callback: any) => {
            await promises.writeFile(resolve(getCwd(), './build/asyncChunkMap.json'), JSON.stringify(asyncChunkMap))
            callback()
          }
        )
      }
    }
  )
  chainClientConfig(chain) // 合并用户自定义配置

  return chain.toConfig()
}

export {
  getClientWebpack
}
