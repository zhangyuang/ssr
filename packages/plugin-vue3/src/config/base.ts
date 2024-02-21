
import { join } from 'path'
import { Mode } from 'ssr-types'
import { getCwd, loadConfig, setStyle, loadModuleFromFramework, logErr, getBuildConfig, getDefineEnv, addCommonChain, checkModuleExist } from 'ssr-common-utils'
import * as webpack from 'ssr-webpack4'

import * as WebpackChain from 'webpack-chain'
const MiniCssExtractPlugin = require(loadModuleFromFramework('ssr-mini-css-extract-plugin'))
const WebpackBar = require('webpackbar')

const loadModule = loadModuleFromFramework

const getBaseConfig = (chain: WebpackChain, isServer: boolean) => {
  const config = loadConfig()
  const { moduleFileExtensions, chainBaseConfig, locale, ssrVueLoaderOptions, csrVueLoaderOptions, alias, define } = config

  let vueLoaderOptions = {
    babelParserPlugins: ['jsx', 'classProperties', 'decorators-legacy'],
    compilerOptions: {
      isCustomElement: (tag: string) => tag.includes('micro')
    }
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

  chain.resolve
    .extensions
    .merge(['.mjs', '.js', '.jsx', '.vue', '.json', '.wasm'])
    .end()
  chain.module
    .noParse(/^(vue|vue-router|vuex)$/)

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
  chain.resolve.alias
    .set('pinia', loadModuleFromFramework('pinia'))

  addCommonChain(chain, isServer)
  chain.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader(loadModule('vue-loader')).options(vueLoaderOptions)
    .end()

  chain
    .plugin('vue-loader')
    .use(require(loadModule('vue-loader')).VueLoaderPlugin)
    .end()

  locale?.enable && chain.module
    .rule('i18n-resource')
    .test(/\.(json5?|ya?ml)$/)
    .include.add(join(getCwd(), './web/locales')).end()
    .type('javascript/auto')
    .use('i18n-resource')
    .loader('@intlify/vue-i18n-loader')
    .end()

  // block support
  locale?.enable && chain.module
    .rule('i18n')
    .resourceQuery(/blockType=i18n/)
    .type('javascript/auto')
    .use('i18n')
    .loader('@intlify/vue-i18n-loader')
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

  chain.plugin('minify-css').use(MiniCssExtractPlugin, getBuildConfig().cssBuildConfig)

  chain.plugin('webpackBar').use(new WebpackBar({
    name: isServer ? 'server' : 'client',
    color: isServer ? '#f173ac' : '#45b97c'
  }))

  chain.plugin('ssrDefine').use(webpack.DefinePlugin, [{
    ...getDefineEnv(),
    ...process.env,
    __isBrowser__: !isServer,
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    ...(isServer ? define?.server : define?.client),
    ...define?.base
  }])
  if (checkModuleExist('element-plus')) {
    const { coerce } = require('semver')
    if ((coerce(process.version)?.major ?? 0) < 14) {
      logErr('Use element-plus auto import require Node.js Version >= v14 for optional chaining')
    } else {
      const AutoImport = require('unplugin-auto-import/webpack')
      const Components = require('unplugin-vue-components/webpack')
      const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
      chain.plugin('ele').use(AutoImport({
        resolvers: [ElementPlusResolver({
          ssr: isServer
        })]
      }))

      chain.plugin('ele2').use(Components({
        resolvers: [ElementPlusResolver({
          ssr: isServer
        })]
      }))
    }
  }

  chainBaseConfig(chain, isServer)
  return config
}

export {
  getBaseConfig
}
