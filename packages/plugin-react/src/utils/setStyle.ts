
import * as WebpackChain from 'webpack-chain'
import { StyleOptions, loadConfig } from 'ssr-server-utils'

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const loadModule = require.resolve
const { css } = loadConfig()
const postCssPlugins = css?.().loaderOptions?.postcss?.plugins || []

const setStyle = (isDev: boolean, chain: WebpackChain, reg: RegExp, options: StyleOptions) => {
  const { include, exclude, modules, importLoaders, loader } = options

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
        require('postcss-discard-comments'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        })
      ].concat(postCssPlugins)
    })
    .end()
    .when(Boolean(loader), rule => {
      loader && rule.use(loader)
        .loader(loadModule(loader))
        .end()
    })
}

export {
  setStyle
}
