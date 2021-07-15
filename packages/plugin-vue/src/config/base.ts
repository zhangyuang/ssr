
import { join } from 'path'
import { Mode } from 'ssr-types'
import { getFeDir, getCwd, loadConfig, getLocalNodeModules, setStyle } from 'ssr-server-utils'
import * as WebpackChain from 'webpack-chain'

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackBar = require('webpackbar')
const loadModule = require.resolve

const addBabelLoader = (chain: WebpackChain.Rule<WebpackChain.Module>, envOptions: any) => {
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
        ]
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
        ]
      ]
    })
    .end()
}

const getBaseConfig = (chain: WebpackChain, isServer: boolean) => {
  const config = loadConfig()
  const { moduleFileExtensions, useHash, isDev, chainBaseConfig, corejs, ssrVueLoaderOptions, csrVueLoaderOptions, babelExtraModule } = config

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
    modules: false
  }

  if (corejs) {
    Object.assign(envOptions, {
      corejs: {
        version: 3,
        proposals: true
      },
      useBuiltIns: 'usage'
    })
  }

  chain.mode(mode)
  chain.module.strictExportPresence(true)
  chain
    .resolve
    .modules
    .add('node_modules')
    .add(join(getCwd(), './node_modules'))
    .when(isDev, chain => {
      chain.add(getLocalNodeModules())
    })
    .end()
    .extensions.merge(moduleFileExtensions)
    .end()
  chain.resolve.alias
    .set('@', getFeDir())
    .set('vue$', 'vue/dist/vue.runtime.esm.js')
    .end()
  chain.module
    .rule('images')
    .test(/\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/)
    .use('url-loader')
    .loader(loadModule('url-loader'))
    .options({
      limit: 10000,
      name: '[name].[hash:8].[ext]',
      // require 图片的时候不用加 .default
      esModule: false,
      fallback: {
        loader: loadModule('file-loader'),
        options: {
          publicPath: '/client/images',
          name: '[name].[hash:8].[ext]',
          esModule: false,
          outputPath: 'images'
        }
      }
    })
    .end()

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

  const babelModule = chain.module
    .rule('compileBabel')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .exclude
    .add(/node_modules/)
    .end()

  const module = chain.module
    .rule('compileBabelForExtraModule')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .include
    .add([/ssr-plugin-vue/, /ssr-client-utils/, /ssr-temporary-routes/])

  let babelForExtraModule
  if (babelExtraModule) {
    babelForExtraModule = module.add(babelExtraModule).end()
  } else {
    babelForExtraModule = module.end()
  }

  addBabelLoader(babelModule, envOptions)
  addBabelLoader(babelForExtraModule, envOptions)

  setStyle(chain, /\.css$/, {
    rule: 'css',
    modules: false,
    importLoaders: 1
  }) // 设置css
  setStyle(chain, /\.less$/, {
    rule: 'less',
    loader: 'less-loader',
    modules: false,
    importLoaders: 2
  })

  chain.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader(loadModule('file-loader'))
    .options({
      name: 'static/[name].[hash:8].[ext]',
      esModule: false
    })
    .end()

  chain.module
    .rule('fonts')
    .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
    .use('file-loader')
    .loader(loadModule('file-loader'))
    .options({
      name: 'static/[name].[hash:8].[ext]',
      esModule: false
    })

  chain.plugin('minify-css').use(MiniCssExtractPlugin, [{
    filename: useHash ? 'static/css/[name].[contenthash:8].css' : 'static/css/[name].css',
    chunkFilename: useHash ? 'static/css/[name].[contenthash:8].chunk.css' : 'static/css/[name].chunk.css'
  }])

  chain.plugin('webpackBar').use(new WebpackBar({
    name: isServer ? 'server' : 'client',
    color: isServer ? '#f173ac' : '#45b97c'
  }))

  chainBaseConfig(chain)
  return config
}

export {
  getBaseConfig
}
