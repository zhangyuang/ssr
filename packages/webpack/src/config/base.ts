
import { join } from 'path'
import * as Config from 'webpack-chain'
import { Mode } from 'ssr-types'
import { getFeDir, getCwd, StyleOptions } from 'ssr-server-utils'
import { buildConfig } from './config'

const { moduleFileExtensions, loadModule, isDev, useHash } = buildConfig
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')

const setStyle = (config: Config, reg: RegExp, options: StyleOptions) => {
  const { include, exclude, modules, importLoaders, loader } = options
  config.module
    .rule(options.rule)
    .test(reg)
    .when(Boolean(include), rule => {
      include && rule.include.add(include).end()
    })
    .when(Boolean(exclude), rule => {
      exclude && rule.exclude.add(exclude).end()
    })
    .when(isDev, rule => {
      rule.use('hmr')
        .loader(loadModule('css-hot-loader'))
        .end()
    })
    .use('MiniCss')
    .loader(MiniCssExtractPlugin.loader)
    .end()
    .use('css-loader')
    .loader(loadModule('css-loader'))
    .options({
      importLoaders: importLoaders,
      modules: modules,
      getLocalIdent: getCSSModuleLocalIdent
    })
    .end()
    .use('postcss-loader')
    .loader(loadModule('postcss-loader'))
    .options({
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        })
      ]
    })
    .end()
    .when(Boolean(loader), rule => {
      loader && rule.use(loader)
        .loader(loadModule(loader))
        .end()
    })
}
const getBaseConfig = () => {
  const config = new Config()
  const mode = process.env.NODE_ENV as Mode
  config.mode(mode)
  config.module.strictExportPresence(true)
  config
    .resolve
    .modules
      .add('node_modules')
      .add(join(getCwd(), './node_modules'))
      .add(join(__dirname, '../node_modules'))
      .add(join(__dirname, '../../../node_modules'))
    .end()
    .extensions.merge(moduleFileExtensions)
    .end()
    .alias
      .set('@', getFeDir())
    .end()

  config.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
        .use('url-loader')
          .loader(loadModule('url-loader'))
          .options({
            limit: 10000,
            name: 'static/[name].[hash:8].[ext]',
            // require 图片的时候不用加 .default
            esModule: false,
            fallback: {
              loader: loadModule('file-loader'),
              options: {
                name: 'static/[name].[hash:8].[ext]',
                esModule: false
              }
            }
          })
          .end()

  config.module
      .rule('compile')
          .test(/\.(js|mjs|jsx|ts|tsx)$/)
          .exclude
              .add(/node_modules/)
              .end()
          .use('babel-loader')
              .loader(loadModule('babel-loader'))
              .options({
                cacheDirectory: true,
                cacheCompression: false,
                sourceType: 'unambiguous',
                presets: [
                  [
                    loadModule('@babel/preset-env'),
                    {

                      modules: false
                      // corejs: 3,
                      // useBuiltIns: 'usage'
                    }
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
                      libraryDirectory: 'es',
                      style: 'css'
                    }
                  ]
                ]
              })
              .end()

  setStyle(config, /\.css$/, {
    exclude: /antd/,
    rule: 'css',
    modules: true,
    importLoaders: 1
  }) // 设置css
  setStyle(config, /\.css$/, {
    include: /antd/,
    rule: 'antd',
    modules: false,
    importLoaders: 1
  }) // antd不使用css-modules
  setStyle(config, /\.less$/, {
    rule: 'less',
    loader: 'less-loader',
    modules: true,
    importLoaders: 2
  })

  config.module
        .rule('svg')
        .test(/\.(svg)(\?.*)?$/)
        .use('file-loader')
          .loader(loadModule('file-loader'))
          .options({
            name: 'static/[name].[hash:8].[ext]',
            esModule: false
          })
        .end()

  config.module
        .rule('fonts')
        .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
        .use('file-loader')
          .loader(loadModule('file-loader'))
          .options({
            name: 'static/[name].[hash:8].[ext]',
            esModule: false
          })

  config.plugin('minify-css').use(MiniCssExtractPlugin, [{
    filename: useHash ? 'static/css/[name].[contenthash:8].css' : 'static/css/[name].css',
    chunkFilename: useHash ? 'static/css/[name].[contenthash:8].chunk.css' : 'static/css/[name].chunk.css'
  }])
  return config
}

export {
  getBaseConfig
}
