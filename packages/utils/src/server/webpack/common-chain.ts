import { promises } from 'fs'
import { coerce } from 'semver'
import { resolve } from 'path'
import type { Chain, PluginItem } from 'ssr-types'
import type { Rule, Module } from 'webpack-chain'
import type { Compiler } from 'webpack'
import { getImageOutputPath } from '../parse'
import { loadModuleFromFramework, getPkgJson, judgeFramework, getCwd } from '../cwd'
import { loadConfig } from '../loadConfig'
import { logWarning } from '../log'
import { asyncChunkMap } from '../build-utils'

const antdVersion = getPkgJson().dependencies?.['antd'] ?? getPkgJson().devDependencies?.['antd']
const isAntd4 = coerce(antdVersion)?.major === 4
if (coerce(antdVersion)?.major === 5) {
  logWarning('Check antd@5.x has been installed, antd@4.x is more recommend in ssr environment')
}
const addBabelLoader = (chain: Rule<Module>, envOptions: any, isServer: boolean) => {
  const framework = judgeFramework()
  const { babelOptions, isDev } = loadConfig()
  let plugins: PluginItem[] = []
  let presets: PluginItem[] = []
  if (['ssr-plugin-react18', 'ssr-plugin-react'].includes(framework)) {
    plugins = [
      [loadModuleFromFramework('@babel/plugin-transform-runtime'), {
        regenerator: false,
        corejs: false,
        helpers: true
      }],
      [loadModuleFromFramework('@babel/plugin-proposal-private-methods'), { loose: true }],
      [loadModuleFromFramework('@babel/plugin-proposal-private-property-in-object'), { loose: true }]
    ]
    if (isAntd4) {
      plugins.push([
        loadModuleFromFramework('babel-plugin-import'),
        {
          libraryName: 'antd',
          libraryDirectory: 'lib',
          style: true
        }, 'antd'
      ])
    }
    if (!isServer && isDev) {
      plugins.push(loadModuleFromFramework('react-refresh/babel'))
    }
    presets = [
      [
        loadModuleFromFramework('@babel/preset-env'),
        envOptions
      ],
      [loadModuleFromFramework('babel-preset-react-app'), {
        flow: false,
        typescript: true,
        runtime: 'automatic'
      }]
    ]
  }
  if (['ssr-plugin-vue3', 'ssr-plugin-vue'].includes(framework)) {
    plugins = [
      [
        loadModuleFromFramework('@babel/plugin-transform-runtime'),
        {
          corejs: false
        }
      ],
      [
        loadModuleFromFramework('babel-plugin-import'),
        {
          libraryName: 'vant',
          libraryDirectory: 'lib',
          style: true
        }, 'vant'
      ],
      [
        loadModuleFromFramework('babel-plugin-import'),
        {
          libraryName: 'ant-design-vue',
          libraryDirectory: 'lib',
          style: true
        }, 'ant-design-vue'
      ],
      loadModuleFromFramework('@vue/babel-plugin-jsx')
    ]
    presets = [
      [
        loadModuleFromFramework('@babel/preset-typescript'),
        {
          isTSX: true,
          allExtensions: true
        }
      ],
      [
        loadModuleFromFramework('@babel/preset-env'),
        envOptions
      ]
    ]
  }
  plugins.push([loadModuleFromFramework('@babel/plugin-proposal-optional-chaining')])
  plugins.push(...babelOptions?.plugins ?? [])
  presets.push(...babelOptions?.presets ?? [])
  plugins = plugins.filter(Boolean)
  presets = presets.filter(Boolean)
  chain.use('babel-loader')
    .loader(loadModuleFromFramework('babel-loader'))
    .options({
      cacheDirectory: true,
      cacheCompression: false,
      sourceType: 'unambiguous',
      presets,
      plugins
    })
    .end()
}
const addCommonChain = (chain: Chain, isServer: boolean) => {
  const { babelOptions, corejsOptions, babelExtraModule, assetsDir, optimize } = loadConfig()
  const { publicPath, imagePath } = getImageOutputPath()
  const envOptions = {
    modules: false,
    ...corejsOptions
  }
  if (process.env.NOMINIFY) {
    chain.optimization.minimize(false)
  }

  const babelModule = chain.module
    .rule('compileBabel')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .exclude
    .add(/node_modules|core-js/)
    .add(babelOptions?.exclude as Array<string|RegExp> ?? [])
    .end()

  chain.module
    .rule('mjs')
    .test(/\.mjs/)
    .type('javascript/auto')
    .end()

  const module = chain.module
    .rule('compileBabelForExtraModule')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .include

  const babelForExtraModule = module.add(babelExtraModule ?? []).add(babelOptions?.include as Array<string|RegExp> ?? []).end().exclude.add(/core-js/).end()

  addBabelLoader(babelModule, envOptions, isServer)
  addBabelLoader(babelForExtraModule, envOptions, isServer)
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
  chain.module
    .rule('fonts')
    .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
    .use('file-loader')
    .loader(loadModuleFromFramework('file-loader'))
    .options({
      name: `${assetsDir}/[name].[hash:8].[ext]`,
      esModule: false,
      emitFile: !isServer
    })
  const BundleAnalyzerPlugin = require(loadModuleFromFramework('webpack-bundle-analyzer')).BundleAnalyzerPlugin
  const generateAnalysis = Boolean(process.env.GENERATE_ANALYSIS)
  if (!isServer) {
    chain.when(generateAnalysis, chain => {
      chain.plugin('analyze').use(BundleAnalyzerPlugin)
    })
    chain.plugin('WriteAsyncManifest').use(
      function () {
        return {
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
      }
    )
  }
}

export {
  addCommonChain
}
