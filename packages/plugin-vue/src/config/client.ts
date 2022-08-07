
import { promises } from 'fs'
import { resolve } from 'path'
import { loadConfig, getCwd, cryptoAsyncChunkName, getOutputPublicPath, loadModuleFromFramework } from 'ssr-common-utils'
import * as WebpackChain from 'webpack-chain'
import { Compiler } from 'webpack'
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
  const { isDev, chunkName, getOutput, useHash, chainClientConfig } = loadConfig()
  const shouldUseSourceMap = isDev || Boolean(process.env.GENERATE_SOURCEMAP)
  const publicPath = getOutputPublicPath()
  getBaseConfig(chain, false)
  chain.devtool(isDev ? 'cheap-module-source-map' : (shouldUseSourceMap ? 'source-map' : false))
  chain.entry(chunkName)
    .add(require.resolve('../entry/client-entry'))
    .end()
    .output
    .path(getOutput().clientOutPut)
    .filename(useHash ? '[name].[contenthash:8].js' : 'static/[name].js')
    .chunkFilename(useHash ? '[name].[contenthash:8].chunk.js' : 'static/[name].chunk.js')
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

  chain.plugin('manifest').use(loadModule('webpack-manifest-plugin'), [{
    fileName: 'asset-manifest.json'
  }])

  chain.when(generateAnalysis, chain => {
    chain.plugin('analyze').use(BundleAnalyzerPlugin)
  })
  chain.plugin('WriteAsyncManifest').use(
    class WriteAsyncChunkManifest {
      apply (compiler: Compiler) {
        compiler.hooks.watchRun.tap('ClearLastAsyncChunkMap', async () => {
          asyncChunkMap.val = {}
        })
        compiler.hooks.done.tapAsync(
          'WriteAsyncChunkManifest',
          async (params: any, callback: any) => {
            await promises.writeFile(resolve(getCwd(), './build/asyncChunkMap.json'), JSON.stringify(asyncChunkMap.val))
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
