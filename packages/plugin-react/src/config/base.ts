
import { join } from 'path'
import { Mode } from 'ssr-types'
import { getCwd, loadConfig, getLocalNodeModules, setStyle, addImageChain } from 'ssr-server-utils'
import * as WebpackChain from 'webpack-chain'
import * as webpack from 'webpack'

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
          }, 'antd'
        ],
        [loadModule('@babel/plugin-proposal-private-methods'), { loose: true }],
        [loadModule('@babel/plugin-proposal-private-property-in-object'), { loose: true }]
      ]
    })
    .end()
}
const getBaseConfig = (chain: WebpackChain, isServer: boolean) => {
  const config = loadConfig()
  const { moduleFileExtensions, useHash, isDev, chainBaseConfig, corejsOptions, babelExtraModule, alias } = config
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
    .when(isDev, chain => {
      chain.add(getLocalNodeModules())
    })
    .end()
    .extensions.merge(moduleFileExtensions)
    .end()
    .alias
    .end()

  alias && Object.keys(alias).forEach(item => {
    chain.resolve.alias
      .set(item, alias[item])
  })

  addImageChain(chain, isServer)

  const babelModule = chain.module
    .rule('compileBabel')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .exclude
    .add(/node_modules|core-js/)
    .end()

  const module = chain.module
    .rule('compileBabelForExtraModule')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .include
    .add([/ssr-plugin-react/, /ssr-client-utils/, /ssr-hoc-react/])

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
    isServer,
    importLoaders: 1
  })

  setStyle(chain, /\.less$/, {
    rule: 'less',
    loader: 'less-loader',
    isServer,
    importLoaders: 2
  })

  chain.module
    .rule('fonts')
    .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
    .use('file-loader')
    .loader(loadModule('file-loader'))
    .options({
      name: 'static/[name].[hash:8].[ext]',
      esModule: false,
      emitFile: !isServer
    })

  chain.plugin('minify-css').use(MiniCssExtractPlugin, [{
    filename: useHash ? 'static/css/[name].[contenthash:8].css' : 'static/css/[name].css',
    chunkFilename: useHash ? 'static/css/[name].[contenthash:8].chunk.css' : 'static/css/[name].chunk.css'
  }])

  chain.plugin('webpackBar').use(new WebpackBar({
    name: isServer ? 'server' : 'client',
    color: isServer ? '#f173ac' : '#45b97c'
  }))
  chain.plugin('ssrDefine').use(webpack.DefinePlugin, [{
    __isBrowser__: !isServer
  }])
  chainBaseConfig(chain)
  return config
}

export {
  getBaseConfig
}
