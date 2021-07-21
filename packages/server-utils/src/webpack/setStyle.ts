import * as WebpackChain from 'webpack-chain'
import { StyleOptions } from 'ssr-types'
import { loadConfig } from '../loadConfig'

const setStyle = (chain: WebpackChain, reg: RegExp, options: StyleOptions, isReact?: boolean) => {
  const { css, isDev } = loadConfig()
  const { include, exclude, modules, importLoaders, loader } = options
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const loadModule = require.resolve

  const userCssloaderOptions = css?.().loaderOptions?.cssOptions ?? {}
  const cssloaderOptions = {
    importLoaders: importLoaders,
    modules: modules
  }
  if (isReact) {
    // @ts-expect-error
    cssloaderOptions.localIdentName = '[name]__[local]___[hash:base64:5]'
  }
  Object.assign(cssloaderOptions, userCssloaderOptions)

  const postCssPlugins = css?.().loaderOptions?.postcss?.plugins ?? [] // 用户自定义 postcss 插件
  const postCssOptions = Object.assign({
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'),
      require('postcss-discard-comments'),
      require('postcss-preset-env')({
        autoprefixer: {
          flexbox: 'no-2009'
        },
        stage: 3
      })
    ].concat(postCssPlugins)
  }, css?.().loaderOptions?.postcss?.options ?? {}) // 合并用户自定义 postcss options

  chain.module
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
    .options({
      // vite 场景下服务端 bundle 输出 css 文件，否则 服务端不输出
      emit: process.env.BUILD_TOOL === 'vite' ? true : !options.isServer
    })
    .end()
    .use('css-loader')
    .loader(loadModule('css-loader'))
    .options(cssloaderOptions)
    .end()
    .use('postcss-loader')
    .loader(loadModule('postcss-loader'))
    .options(postCssOptions)
    .end()
    .when(Boolean(loader), rule => {
      loader && rule.use(loader)
        .loader(loadModule(loader))
        .when(loader === 'less-loader', rule => {
          rule.options(css?.().loaderOptions?.less ?? {
            lessOptions: {
              javascriptEnabled: true
            }
          })
        })
        .when(loader === 'sass-loader', rule => {
          rule.options(css?.().loaderOptions?.sass ?? {})
        })
        .end()
    })
}

export {
  setStyle
}
