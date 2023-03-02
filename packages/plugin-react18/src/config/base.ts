
import { join } from 'path'
import { Mode } from 'ssr-types'
import { getCwd, loadConfig, setStyle, addImageChain, loadModuleFromFramework, getPkgJson } from 'ssr-common-utils'
import * as WebpackChain from 'webpack-chain'
import * as webpack from 'webpack'
import { coerce } from 'semver'

const MiniCssExtractPlugin = require(loadModuleFromFramework('ssr-mini-css-extract-plugin'))
const WebpackBar = require('webpackbar')
const loadModule = loadModuleFromFramework

const antdVersion = getPkgJson().dependencies?.['antd'] ?? getPkgJson().devDependencies?.['antd']
const isAntd4 = coerce(antdVersion)?.major === 4
const addBabelLoader = (chain: WebpackChain.Rule<WebpackChain.Module>, envOptions: any, isServer: boolean) => {
  const { babelOptions, isDev } = loadConfig()
  const plugins = [
    [loadModule('@babel/plugin-transform-runtime'), {
      regenerator: false,
      corejs: false,
      helpers: true
    }],
    [loadModule('@babel/plugin-proposal-private-methods'), { loose: true }],
    [loadModule('@babel/plugin-proposal-private-property-in-object'), { loose: true }],
    ...babelOptions?.plugins ?? []
  ]
  if (isAntd4) {
    plugins.push([
      loadModule('babel-plugin-import'),
      {
        libraryName: 'antd',
        libraryDirectory: 'lib',
        style: true
      }, 'antd'
    ])
  }
  if (!isServer && isDev) {
    plugins.push(loadModule('react-refresh/babel'))
  }
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
        [loadModule('babel-preset-react-app'), {
          flow: false,
          typescript: true,
          runtime: 'automatic'
        }],
        ...babelOptions?.presets ?? []
      ],
      plugins: plugins
    })
    .end()
}
const getBaseConfig = (chain: WebpackChain, isServer: boolean) => {
  const config = loadConfig()
  const { moduleFileExtensions, useHash, chainBaseConfig, corejsOptions, babelExtraModule, alias, define, babelOptions } = config
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
      name: '[name].[hash:8].[ext]',
      esModule: false,
      emitFile: !isServer
    })

  chain.plugin('minify-css').use(MiniCssExtractPlugin, [{
    filename: useHash ? '[name].[contenthash:8].css' : '[name].css',
    chunkFilename: useHash ? '[name].[contenthash:8].chunk.css' : '[name].chunk.css'
  }])

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
