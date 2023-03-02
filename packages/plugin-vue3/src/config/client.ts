
import { promises } from 'fs'
import { resolve } from 'path'
import { loadConfig, getCwd, getOutputPublicPath, loadModuleFromFramework, getSplitChunksOptions } from 'ssr-common-utils'
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
  const { isDev, chunkName, getOutput, chainClientConfig, optimize, outputName } = loadConfig()
  const shouldUseSourceMap = isDev || Boolean(process.env.GENERATE_SOURCEMAP)
  const publicPath = getOutputPublicPath()

  getBaseConfig(chain, false)
  chain.devtool(isDev ? 'eval-source-map' : (shouldUseSourceMap ? 'source-map' : false))
  chain.entry(chunkName)
    .add(require.resolve('../entry/client-entry'))
    .end()
    .output
    .path(getOutput().clientOutPut)
    .filename(outputName.fileName)
    .chunkFilename(outputName.chunkFileName)
    .publicPath(publicPath)
    .end()
  chain.optimization
    .runtimeChunk(true)
    .splitChunks(getSplitChunksOptions(asyncChunkMap))
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
            if (!optimize) {
              await promises.writeFile(resolve(getCwd(), './build/asyncChunkMap.json'), JSON.stringify(asyncChunkMap.val))
            }
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
