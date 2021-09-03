import { StyleOptions } from 'ssr-types'
import { Config } from 'ssr-types/cjs/third-party/webpack-chain'
import type { loader } from 'webpack'
import { loadConfig } from '../loadConfig'

const genericNames = require('generic-names')

const setStyle = (chain: Config, reg: RegExp, options: StyleOptions) => {
  const { css, isDev } = loadConfig()
  const { include, exclude, modules, importLoaders, loader } = options
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const loadModule = require.resolve

  const userCssloaderOptions = css?.().loaderOptions?.cssOptions ?? {}
  const cssloaderOptions = {
    importLoaders: importLoaders,
    modules: modules,
    url: (url: string) => {
      // 绝对路径开头的静态资源地址不处理
      return !url.startsWith('/')
    }
  }
  if (modules?.auto) {
    // 对齐 css-loader 与 postcss-modules 生成 hash 方式
    // @ts-expect-error
    cssloaderOptions.modules.getLocalIdent = (context: loader.LoaderContext, localIdentName, localName, options) => {
      return genericNames('[name]__[local]___[hash:base64:5]', {
        context: process.cwd()
      })(localName, context.resourcePath)
    }
  }

  Object.assign(cssloaderOptions, userCssloaderOptions)
  const postCssPlugins = css?.().loaderOptions?.postcss?.plugins ?? [] // 用户自定义 postcss 插件
  const userPostcssOptions = css?.().loaderOptions?.postcss?.options // postCssOptions maybe function|object
  const postcssOptions = typeof userPostcssOptions === 'function' ? userPostcssOptions : Object.assign({
    ident: 'postcss',
    plugins: [
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
    .options({
      postcssOptions: postcssOptions
    })
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
