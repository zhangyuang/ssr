# 构建配置

这里我们存在baseConfig, clientConfig, serverConfig 三个配置文件，分别存放基础配置，客户端特有的配置，服务端特有的配置
## 基础配置

服务器端渲染(SSR)项目的配置大体上与纯客户端项目类似，我们建议将配置分为三个文件：base, client 和 server。基本配置(base config)包含在两个环境共享的配置，例如，resolve，plugins，module，别名(alias)和 loader等配置项。服务器配置(server config)和客户端配置(client config)，可以通过使用 webpack-merge 来简单地扩展基本配置。

我们利用 webpack 分别对客户端代码和服务器端代码分别进行打包，服务器需要服务器 bundle 用于服务器端渲染(SSR)，而客户端 bundle 会发送给浏览器，用于客户端对服务端渲染的 html 进行事件绑定和接管。

###  base config

webpack.base.conf.js 配置主要定义服务端客户端通用的rules，例如 MiniCssExtractPlugin 对css文件的处理，对 js 文件 babel 编译，处理图片、字体等。其基本配置如下：

```javascript
'use strict'

const paths = require('./paths')
const path = require('path')
// style files regexes
const webpackModule = {
  rules: [
    {
      oneOf: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          // 只用babel编译 web 目录下的文件，默认不处理 node_modules 因为这会拖慢你的构建速度，如果有特殊 node_modules 模块编译需求，可以在这里自行添加
          include: paths.appSrc,
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
            cacheCompression: false
          }
        },
        {
          test: /\.less$/,
          exclude: /\.module\.less$/,
          // getStyleLoaders将less-loader与基础的通用loader进行组装，例如css-loader,postcss-loader等
          use: getStyleLoaders(
            {
              importLoaders: 2,
              localIdentName: '[local]'
            },
            'less-loader'
          ),
          sideEffects: true
        },
        {
          // .module.less后缀名的文件使用css-modules来处理
          test: /\.module\.less$/,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              modules: true,
              getLocalIdent: getCSSModuleLocalIdent
            },
            'less-loader'
          )
        }
      ]
    }
  ]
}

module.exports = {
  // 1. 条件匹配：通过 test、include、exclude 三个配置项来命中 Loader 要应用规则的文件。
  // 2. 应用规则：对选中后的文件通过 use 配置项来应用 Loader，可以只应用一个 Loader 或者按照从后往前的顺序应用一组 Loader，同时还可以分别给Loader 传入参数。
  // 3. 重置顺序：一组 Loader 的执行顺序默认是从右到左执行，通过 enforce 选项可以让其中一个 Loader 的执行顺序放到最前或者最后。
  module: webpackModule,
  // 用来拓展webpack功能的，它们会在整个构建过程中生效，执行相关的任务。
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[name].chunk.css'
    })
  ],
  // 配置如何展示性能提示。例如，如果一个资源超过 250kb，webpack 会对此输出一个警告来通知你。
  performance: false
}
```

我们为了保证开发环境和生产环境的统一，在上面配置中的 CSS 样式处理配置我们在开发环境没有用 style-loader 来将其用style标签内置，统一用MiniCssExtractPlugin来将其提取为单独的样式文件，统一本地开发与生产环境表现形式，这里我们使用了 css-hot-loader 来实现CSS HMR，具体解释详见 [CSS HMR 实现](/guide/hmr.html#css-hmr-实现)。

## client 配置

以下是常见的客户端资源的打包配置

```javascript
// 合并 base 配置
module.exports = merge(baseConfig, {
  // 打包时可以通过 NODE_ENV 设置打包模式
  // 'production' || 'development' || 'none'
  mode: process.env.NODE_ENV,
  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  devtool: isDev ? 'cheap-module-source-map' : (process.env.GENERATE_SOURCEMAP !== 'false' ? 'source-map' : false),
  // 打包入口
  entry: {
    Page: paths.entry
  },
  // 生成的打包文件路径
  output: {
    path: 'your target output path',
    pathinfo: true,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: publicPath,
    hotUpdateChunkFilename: '[hash].hot-update.js',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },
  // 压缩配置
  optimization: optimization,
  // 用来拓展 webpack 功能，它们会在整个构建过程中生效，执行相关的任务。
  plugins: plugins.filter(Boolean),
  // 配置如何展示性能提示。例如，如果一个资源超过 250kb，webpack 会对此输出一个警告来通知你。
  performance: false
})
```

## server 配置

以下是打包服务端bundle的配置，这里我们的处理与客户端的打包配置差异比较大

```js
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const nodeExternals = require('webpack-node-externals')
const paths = require('./paths')
const isDev = process.env.NODE_ENV === 'development'

const plugins = [
  new webpack.DefinePlugin({
    '__isBrowser__': false //eslint-disable-line
  })
]

// 合并 base 配置
module.exports = merge(baseConfig, {
  // 打包时可以通过 NODE_ENV 设置打包模式
  mode: process.env.NODE_ENV,
  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  devtool: isDev ? 'eval-source-map' : '',
  // 打包入口
  entry: {
    Page: paths.entry
  },
  // 运行环境
  // 编译为类 Node.js 环境可用（使用 Node.js require 加载 chunk）
  target: 'node',
  // 这是最重要的选项，详见下方对externals的讲解
  externals: nodeExternals({
    whitelist: /\.(css|less|sass|scss)$/
  }),
  // 生成的打包文件路径
  output: {
    path: paths.appBuild,
    publicPath: '/',
    filename: '[name].server.js',
    // 设置依赖引用规则为 commonjs2
    libraryTarget: 'commonjs2'
  },
  // 用来拓展 webpack 功能，它们会在整个构建过程中生效，执行相关的任务。
  plugins: plugins
})
```

server 构建配置中，需要注意以下几个点：

1. 在整个输出模块里新增target选项

```js
// 告诉webpack当前环境是 Node 环境，可以使用 Node.js require 加载 chunk。
target："node"
```

2. externals 白名单

这里使用 `webpack-node-externals` 模块来将依赖外置。意思是什么呢，如果我们的代码中包含`require('react')`这样的代码，在打包的时候，不会将React的源码和你的代码打包在一起，而是保留`require` 语句在你构建后的代码中。在传统的CSR项目中，我们可能会开启此选项来让React/Vue/Jquery 这些基本上永远不会更新的库以script标签的形式从外部引入注入为全局变量，而不是将他们的代码打包到业务代码中，将浏览器缓存的功能发挥出来。

这里我们更进一步，使用nodeExternals将所有的node_modules的模块都不打包，一个是因为这样构建出来的bundle更小，服务端执行速度更快。一个是因为我们的运行环境就存在 node_modules 文件夹，所以不需要将其打包在服务端bundle中，在请求来的时候，再从node_modules中加载相应模块即可。

whitelist白名单选项的作用是，在白名单中的文件仍需要webpack去处理它。由于Node.js环境直接require一个css文件会报错，所以这些样式文件我们仍需要用webpack去处理，将它从js文件中剥离出来，成为一个单独的样式文件

3. libraryTarget: 'commonjs2' 指定导出模块的类型为 commonjs2，因为当前我们的运行环境是Node.js而不是浏览器端，所以我们需要遵循Node.js的模块格式


以上的配置是全部配置项的一些关键截取，在实际项目中如果对于配置有定制需求可以修改对应的 client/server 打包配置文件。所有的配置内容可以参考项目 [build](https://github.com/ykfe/egg-react-ssr/tree/master/example/ssr-with-js/build) 目录下的配置内容。
