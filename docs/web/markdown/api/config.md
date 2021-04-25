# 应用配置

本章节将介绍 `config.js` 支持的一些配置。了解详细的配置可以直接查看该[文件](https://github.com/ykfe/ssr/blob/dev/packages/server-utils/src/loadConfig.ts)

配置文件可通过 `config.js` 文件定义以及调用 `core.render` 方法时实时传入。会将两者配置进行合并

```js
import { render } from 'ssr-core-vue3'

const stream = await render<Readable>(this.ctx, userConfig)
```

## mode

渲染模式

- 类型: `string`
- 默认: `ssr`

通过渲染模式来决定当前应用采用服务端渲染还是客户端渲染

## stream

- 类型: `boolean`
- 默认: `false`

是否将组件编译为 `stream` 进行返回来加快展现速度。默认为 `false`, 即返回普通 `html` 字符串

## isDev

- 类型: `boolean`
- 默认: `false`

标志当前运行环境，根据 `NODE_ENV === development` 判断

## publicPath

- 类型: `string`
- 默认: `/`

静态资源的 `publicPath`, 本地开发环境一般无需配置。生产环境若走本地静态资源目录也无需配置。若需要走单独的 `CDN` 服务部署可配置为具体的 `CDN` 地址例如 `https://g.alicdn.com/path/xxx`

## useHash

- 类型: `boolean`
- 默认: `true`

构建产物是否带有 `hash`，默认生产环境开启，不建议关闭

## fePort

- 类型: `number`
- 默认: `8000`

本地开发时 `webpack-dev-server` 托管前端静态资源的端口，`Node.js Server` 会自动 `proxy` 静态资源, 无特殊需求不需要修改

## chunkName

- 类型: `string`
- 默认: `Page`

静态资源构建时默认的 `entry` 名, 默认为 `Page`。无特殊需求不需要修改
## webpackDevServerConfig

- 类型: `webpackDevServer.Configuration`
- 默认: `见文章上方具体配置文件`

`webpack-dev-server` 启动配置

## chainBaseConfig

- 类型: `(config: WebpackChain) => void`
- 默认: [React](https://github.com/ykfe/ssr/blob/dev/packages/plugin-react/src/config/base.ts) [Vue](https://github.com/ykfe/ssr/blob/dev/packages/plugin-vue/src/config/base.ts) [Vue3](https://github.com/ykfe/ssr/blob/dev/packages/plugin-vue3/src/config/base.ts)

使用 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 来修改 `服务端/客户端` 公共的 `Webpack` 构建配置。

注意：开发者的大部分需求都应该修改 `baseConfig` 而不是独立的 `serverConfig` 或 `clientConfig`

例如为 `markdown` 文件添加 `raw-loader` 进行解析 

```js
module.exports = {
  chainBaseConfig: (chain) => {
    chain.module
      .rule('markdown')
      .test(/\.md$/)
      .use('raw-loader')
      .loader(require.resolve('raw-loader'))
      .end()
  }
}
```

## chainServerConfig

- 类型: `(config: WebpackChain) => void`
- 默认: [React](https://github.com/ykfe/ssr/blob/dev/packages/plugin-react/src/config/server.ts) [Vue](https://github.com/ykfe/ssr/blob/dev/packages/plugin-vue/src/config/server.ts) [Vue3](https://github.com/ykfe/ssr/blob/dev/packages/plugin-vue3/src/config/server.ts)

使用 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 来修改 `服务端` 公共的 `Webpack` 构建配置

## chainClientConfig

- 类型: `(config: WebpackChain) => void`
- 默认: [React](https://github.com/ykfe/ssr/blob/dev/packages/plugin-react/src/config/client.ts) [Vue](https://github.com/ykfe/ssr/blob/dev/packages/plugin-vue/src/config/client.ts) [Vue3](https://github.com/ykfe/ssr/blob/dev/packages/plugin-vue3/src/config/client.ts)

使用 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 来修改 `客户端` 公共的 `Webpack` 构建配置

## whiteList

- 类型: `regExp[]`
- 默认: `[/\.(css|less|sass|scss)$/]`

设置服务端构建配置 `externals` 的白名单，即需要让 `Webpack` 来处理的模块

## cssModulesWhiteList

- 类型: `regExp[]`
- 默认: `[/antd/, /swiper/]`

设置该选项指定样式文件不用 `css-modules` 处理，防止服务端客户端 `className` 不匹配

## prefix

- 类型: `string|undefined`
- 默认: `undefined`

为前端路由添加统一的 `prefix`, 如 `/${prefix}/`, `/${prefix}/detail/:id`

## proxy

- 类型: `object`
- 默认: `{}`

底层使用 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 来进行代理，框架只是单纯透传参数， 具体配置查看 `http-proxy-middleware` 文档即可

## dynamic

- 类型: `boolean`
- 默认: `true`

是否开启代码分割，默认开启，不建议关闭。`Vite` 模式下必须开启


## customeHeadScript

- 类型: `Array<{describe: object, content: string }>`
- 默认: `[]`

仅在 `Vue` 场景下使用

用于通过配置在页面头部插入自定义的 `script` 为了避免影响期望功能这块内容不做 `escape`，为了避免 `xss` 需要保证插入脚本代码的安全性

`describe` 字段参考 `Vue` [createElement](https://cn.vuejs.org/v2/guide/render-function.html#createElement-%E5%8F%82%E6%95%B0) 用于设置 `script` 标签的 `attribute`

`content` 为 `script` 的内容

## css

- 类型: `() => { loaderOptions: {
      cssOptions: any
      postcss: {
        options: any
        plugins: any[]
      }
    }}`

- 默认: `() => {}`

用于添加用户自定义配置 `css-loader` 以及 `postcss-loader` 的配置，需要用 `函数 return` 的形式

## locale

- 类型: `{ enable: boolean }`

- 默认: `{ enable: false }`

是否启用 `vue-i18n` 国际化插件

## 注意事项

1. 由于 `config.js` 文件在 Node.js 环境也会被加载，如果直接在顶部 `require` 模块可能会导致模块`体积过大`，降低应用启动速度，我们建议在必要的函数当中再 `require` 需要用到的模块。
以添加 `postcss` 插件为例

```js
module.exports = {
  css: () => {
    // css 在 vue-cli 中是直接配置对象，但在本框架需要使用函数来 return 具体对象，这样我们只有在本地打包阶段才会去 require 要用到的依赖。在生产环境服务启动的时候不会 require
    const pxtoviewport = require('postcss-px-to-viewport')
    return {
      loaderOptions: {
        postcss: {
          plugins: [
            pxtoviewport({
              viewportWidth: 375
            })
          ]
        }
      }
    }
  }
}
```

2. 我们通过 `chainWebpackConfig` 的方式来让用户可以修改默认配置

但绝大部分情况下你不需要去修改默认的配置。我们默认的配置是基于 `create-react-app` 生成的配置上做了一些优化。已经极力做到最优。如果确定需要修改默认配置，应该先看看配置有无提供额外选项直接设置例如 `css.loaderOptions` ，而不是通过 `WebpackChain` 工具去重新设置规则。这样极易导致错误。

我们后续可能会兼容一些 `vue-cli` 支持的配置，但不是全部。我们并不打算做成大而全的工具这样只会变成大黑盒。配置越多只会增加错误出现的可能性。参考 `vue-cli` 工具 400多个文件，3w 行源码 580个待解决 `issue`。
