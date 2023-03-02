
import { join } from 'path'
import { Mode } from 'ssr-types'
import { getCwd, loadConfig, setStyle, addImageChain, loadModuleFromFramework, getBuildConfig } from 'ssr-common-utils'
import * as webpack from 'webpack'
import * as WebpackChain from 'webpack-chain'

const MiniCssExtractPlugin = require(loadModuleFromFramework('ssr-mini-css-extract-plugin'))
const WebpackBar = require('webpackbar')
const loadModule = loadModuleFromFramework

const addBabelLoader = (chain: WebpackChain.Rule<WebpackChain.Module>, envOptions: any) => {
  const { babelOptions } = loadConfig()
  chain.use('babel-loader')
    .loader(loadModule('babel-loader'))
    .options({
      cacheDirectory: true,
      cacheCompression: false,
      sourceType: 'unambiguous',
      presets: [
        [
          loadModule('@babel/preset-typescript'),
          {
            isTSX: true,
            allExtensions: true
          }
        ],
        [
          loadModule('@babel/preset-env'),
          envOptions
        ],
        ...babelOptions?.presets ?? []
      ],
      plugins: [
        [
          loadModule('@babel/plugin-transform-runtime'), {
            corejs: false
          }
        ],
        [
          loadModule('babel-plugin-import'),
          {
            libraryName: 'vant',
            libraryDirectory: 'lib',
            style: true
          }, 'vant'
        ],
        [
          loadModule('babel-plugin-import'),
          {
            libraryName: 'ant-design-vue',
            libraryDirectory: 'lib',
            style: true
          }, 'ant-design-vue'
        ],
        ...babelOptions?.plugins ?? []
      ]
    })
    .end()
}

const getBaseConfig = (chain: WebpackChain, isServer: boolean) => {
  const config = loadConfig()
  const { moduleFileExtensions, chainBaseConfig, corejsOptions, ssrVueLoaderOptions, csrVueLoaderOptions, babelExtraModule, alias, assetsDir, define, babelOptions } = config

  let vueLoaderOptions = {
    babelParserPlugins: ['jsx', 'classProperties', 'decorators-legacy']
  }
  if (isServer && ssrVueLoaderOptions) {
    vueLoaderOptions = {
      vueLoaderOptions,
      ...ssrVueLoaderOptions
    }
  }
  if (!isServer && csrVueLoaderOptions) {
    vueLoaderOptions = {
      vueLoaderOptions,
      ...csrVueLoaderOptions
    }
  }
  const mode = process.env.NODE_ENV as Mode

  const envOptions = {
    modules: false,
    ...corejsOptions
  }

  chain.mode(mode)
  chain.module.strictExportPresence(true)
  chain
    .resolve
    .modules
    .add('node_modules')
    .add(join(getCwd(), './node_modules'))
    .end()
    .extensions.merge(moduleFileExtensions)
    .end()

  alias && Object.keys(alias).forEach(item => {
    chain.resolve.alias
      .set(item, alias[item])
  })

  addImageChain(chain, isServer)

  chain.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader(loadModule('vue-loader'))
    .options(vueLoaderOptions)
    .end()

  chain
    .plugin('vue-loader')
    .use(require('vue-loader/lib/plugin'))
    .end()
  chain.module
    .rule('mjs')
    .test(/\.mjs/)
    .type('javascript/auto')
    .end()

  const babelModule = chain.module
    .rule('compileBabel')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .exclude
    .add(/node_modules|core-js/)
    .add(babelOptions?.exclude as Array<string|RegExp> ?? [])
    .end()

  const module = chain.module
    .rule('compileBabelForExtraModule')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .include

  const babelForExtraModule = module.add(babelExtraModule ?? []).add(babelOptions?.include as Array<string|RegExp> ?? []).end().exclude.add(/core-js/).end()

  addBabelLoader(babelModule, envOptions)
  addBabelLoader(babelForExtraModule, envOptions)

  setStyle(chain, /\.css$/, {
    rule: 'css',
    importLoaders: 1,
    isServer
  }) // 设置css
  setStyle(chain, /\.less$/, {
    rule: 'less',
    loader: 'less-loader',
    importLoaders: 2,
    isServer
  })

  chain.module
    .rule('fonts')
    .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
    .use('file-loader')
    .loader(loadModule('file-loader'))
    .options({
      name: `${assetsDir}/[name].[hash:8].[ext]`,
      esModule: false,
      emitFile: !isServer
    })

  chain.plugin('minify-css').use(MiniCssExtractPlugin, getBuildConfig().cssBuildConfig)

  chain.plugin('webpackBar').use(new WebpackBar({
    name: isServer ? 'server' : 'client',
    color: isServer ? '#f173ac' : '#45b97c'
  }))

  chain.plugin('ssrDefine').use(webpack.DefinePlugin, [{
    ...process.env,
    __isBrowser__: !isServer,
    ...(isServer ? define?.server : define?.client),
    ...define?.base
  }])

  chainBaseConfig(chain, isServer)
  return config
}

export {
  getBaseConfig
}
