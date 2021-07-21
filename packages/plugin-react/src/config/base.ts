
import { join } from 'path'
import { Mode } from 'ssr-types'
import { getFeDir, getCwd, loadConfig, getLocalNodeModules, setStyle, addImageChain } from 'ssr-server-utils'
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
          loadModule('@babel/preset-env'),
          envOptions
        ],
        [loadModule('babel-preset-react-app'), { flow: false, typescript: true }]
      ],
      plugins: [
        [loadModule('@babel/plugin-transform-runtime'), {
          regenerator: false,
          corejs: false,
          helpers: true
        }],
        [
          loadModule('babel-plugin-import'),
          {
            libraryName: 'antd',
            libraryDirectory: 'lib',
            style: true
          }
        ],
        [loadModule('@babel/plugin-proposal-private-methods'), { loose: true }]
      ]
    })
    .end()
}
const getBaseConfig = (chain: WebpackChain, isServer: boolean) => {
  const config = loadConfig()
  const { moduleFileExtensions, useHash, isDev, cssModulesWhiteList, chainBaseConfig, corejs, babelExtraModule } = config
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
    .alias
    .end()
  chain.resolve.alias
    .set('@', getFeDir())
    .set('react', loadModule('react')) // 用cwd的路径alias，否则可能会出现多个react实例
    .set('react-router', loadModule('react-router'))
    .set('react-router-dom', loadModule('react-router-dom'))

  addImageChain(chain, isServer)

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
    .add([/ssr-plugin-react/, /ssr-client-utils/, /ssr-hoc-react/, /ssr-temporary-routes/])

  let babelForExtraModule
  if (babelExtraModule) {
    babelForExtraModule = module.add(babelExtraModule).end()
  } else {
    babelForExtraModule = module.end()
  }

  addBabelLoader(babelModule, envOptions)
  addBabelLoader(babelForExtraModule, envOptions)

  setStyle(chain, /\.css$/, {
    exclude: cssModulesWhiteList,
    rule: 'css',
    modules: true,
    isServer,
    importLoaders: 1
  }, true) // 设置css

  setStyle(chain, /\.less$/, {
    exclude: cssModulesWhiteList,
    rule: 'less',
    loader: 'less-loader',
    modules: true,
    isServer,
    importLoaders: 2
  }, true)

  setStyle(chain, /\.less$/, {
    include: cssModulesWhiteList,
    rule: 'cssModulesWhiteListLess',
    modules: false,
    loader: 'less-loader',
    importLoaders: 2,
    isServer
  }, true) // 默认 antd swiper 不使用 css-modules，建议第三方 ui 库都不使用

  setStyle(chain, /\.css$/, {
    include: cssModulesWhiteList,
    rule: 'cssModulesWhiteListCss',
    modules: false,
    importLoaders: 1,
    isServer
  }, true)

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
