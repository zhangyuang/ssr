import { StyleOptions } from 'ssr-types'
import { Config } from 'ssr-types/cjs/third-party/webpack-chain'
import { loadConfig } from '../loadConfig'

const genericNames = require('generic-names')

const setStyle = (chain: Config, reg: RegExp, options: StyleOptions, isReact?: boolean) => {
  const { css, isDev } = loadConfig()
  const { include, exclude, modules, importLoaders, loader } = options
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const loadModule = require.resolve

  const userCssloaderOptions = css?.().loaderOptions?.cssOptions ?? {}
  const cssloaderOptions = {
    importLoaders: importLoaders,
    modules: process.env.BUILD_TOOL === 'vite' ? {
      // 本地开发 vite 场景只针对 module 后缀名使用 css-modules
      auto: /\.module\.\w+$/i
    } : modules
  }
  if (isReact && modules?.auto) {
    // 对齐 css-loader 与 postcss-modules 生成 hash 方式
    // @ts-expect-error
    cssloaderOptions.modules.getLocalIdent = (context, localIdentName, localName, options) => {
      return genericNames('[name]__[local]___[hash:base64:5]', {
        context: process.cwd()
      })(localName, context.resourcePath)
    }
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
