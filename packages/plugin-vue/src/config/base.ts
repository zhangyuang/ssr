
import { join } from 'path'
import { Mode } from 'ssr-types'
import { getCwd, loadConfig, setStyle, loadModuleFromFramework, getBuildConfig, addCommonChain } from 'ssr-common-utils'
import * as webpack from 'ssr-webpack4'

import * as WebpackChain from 'webpack-chain'

const MiniCssExtractPlugin = require(loadModuleFromFramework('ssr-mini-css-extract-plugin'))
const WebpackBar = require('webpackbar')
const loadModule = loadModuleFromFramework

const getBaseConfig = (chain: WebpackChain, isServer: boolean) => {
  const config = loadConfig()
  const { moduleFileExtensions, chainBaseConfig, ssrVueLoaderOptions, csrVueLoaderOptions, alias, define } = config

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

  addCommonChain(chain, isServer)

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
  addCommonChain(chain, isServer)

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
