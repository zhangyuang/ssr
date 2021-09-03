# 应用配置

本章节将介绍 `config.js` 支持的一些配置。了解详细的配置可以直接查看该[文件](https://github.com/ykfe/ssr/blob/dev/packages/server-utils/src/loadConfig.ts)

配置文件可通过 `config.js` 文件定义以及调用 `core.render` 方法时实时传入。会将两者配置进行合并

注：得益于 `ssr` 的强大设计，你会发现很多功能开发者完全可以自行在业务代码层面轻松实现而无需框架底层实现或者引入第三方库实现。比如指定页面 `ssr`，比如自定义 `meta` 标签。这些十分简单但重要的功能在其他框架用起来是无比的别扭。而在 `ssr` 框架。一切都是那么自然。

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

## serverPort

- 类型: `number`
- 默认: `3000`

本地开发时 `Node.js` 服务启动监听的端口, 也可以通过环境变量指定 `SERVER_PORT=9000 ssr start`

## fePort

- 类型: `number`
- 默认: `8888`

本地开发时 `webpack-dev-server` 托管前端静态资源的端口，`Node.js Server` 会自动 `proxy` 静态资源, 无特殊需求不需要修改

## chunkName

- 类型: `string`
- 默认: `Page`

静态资源构建时默认的 `entry` 名, 默认为 `Page`。无特殊需求不需要修改

## extraJsOrder

- 类型: `string[]`
- 默认: `[]`

需要额外初始化加载的 `js chunk name`，通常配合 `splitChunks` 配置一起使用, 若生成其他 `name` 的 `chunk` 开发者可通过 `http://localhost:3000/asset-manifest.json` 文件查看具体的 `chunkName`

```js
module.exports = {
  extraJsOrder: ['styles.js'], // 在页面底部额外加载 styles.chunk.js 文件，生产环境自动获取正确的 hash 文件
  extraCssOrder: ['styles.css'] // 在页面头部额外加载 styles.chunk.css 文件，生产环境自动获取正确的 hash 文件
}
```

## extraCssOrder

- 类型: `string[]`
- 默认: `[]`

需要额外初始化加载的 `css chunk name`，通常配合 `splitChunks` 配置一起使用

```js
module.exports = {
  extraJsOrder: ['styles.js'],
  extraCssOrder: ['styles.css']
}
```
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

## prefix

- 类型: `string|undefined`
- 默认: `undefined`

为前端路由添加统一的 `prefix`, 如 `/${prefix}/`, `/${prefix}/detail/:id`。在功能上等价于 `React-Router` 提供的 `basename` 以及 `Vue-Router` 提供的 `base` 选项。  
同样在设置完该参数后，前端路由的跳转操作都会添加该前缀

## proxy

- 类型: `object`
- 默认: `{}`

底层使用 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 来进行代理，框架只是单纯透传参数， 具体配置查看 `http-proxy-middleware` 文档即可

```js
module.exports = {
  proxy: {
    '/api': {
      target: 'http://www.example.org', 
      changeOrigin: true
    }
  }
}
```

## https

- 类型: `boolean`
- 默认: `userConfig.https ? userConfig.https : !!process.env.HTTPS`

是否开启底层 `webpack-dev-server` 的 `https` 模式，需配合 `3000` 端口的 `Node.js` 的 `https` 服务同步使用。设置为 `true` 将使用默认的自签名证书。当此证书无法被信任时，也可以自行传递与 `Node.js` 服务端一致的证书配置。

```js
const fs = require('fs')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  https: isProd ? {} : {
    key: fs.readFileSync('./scripts/https/https.key'),
    cert: fs.readFileSync('./scripts/https/https.crt')
  }
}
```
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


```js
module.exports = {
  customeHeadScript: [
    // Vue3 直接写 attr 属性即可
    {
      describe: {
        type: 'text/javascript',
        src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'
      },
      content: ''
    },
    // Vue2 需要包裹在 attrs 属性中，具体详情查看对应版本的 Vue 文档即可
    {
      describe: {
        attrs: {
          type: 'text/javascript',
          src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'
        }
      },
      content: ''
    },
    // 直接插入 script 内容
    {
      content: `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?xxxx";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`
    }
  ],
}
```

## customeFooterScript

- 类型: `Array<{describe: object, content: string }>`
- 默认: `[]`

仅在 `Vue` 场景下使用, 意义同上。在页面底部加载的静态资源文件。需要配合 `<slot name="customeFooterScript" />` 使用。若当前 `example` 是之前创建的 `layout/index.vue` 不存在该 `slot` 的话需要手动添加

## css

- 示例: 

```js
module.exports = {
  // 这里需要查看框架使用的版本 loader 的文档
  css: () => { 
    return {
      loaderOptions: {
        cssOptions: any // css-loader options see https://www.npmjs.com/package/css-loader/v/5.2.7
        less?: any // less-loader options see https://www.npmjs.com/package/less-loader/v/7.3.0
        sass?: any // sass-loader options see https://www.npmjs.com/package/sass-loader/v/10.2.0
        postcss: {
          options: function|object // 推荐使用 object see https://www.npmjs.com/package/postcss-loader/v/4.3.0
          plugins: any[]
        }
      }}
    }
}
```

- 默认: `() => {}`

用于添加用户自定义配置 `css-loader` `less-loader` 以及 `postcss-loader` 的配置，需要用 `函数 return` 的形式

## parallelFetch

- 类型: `boolean`
- 默认: `undefined`

开启后在服务端获取数据时会并行请求 `layout fetch` 与 `page fetch`。若 `page fetch` 的请求依赖 `layout fetch` 的返回。请不要使用该选项

### antd 定制主题

参考 `antd` 官方[文档](https://ant.design/docs/react/customize-theme-cn#%E5%AE%9A%E5%88%B6%E6%96%B9%E5%BC%8F), 在 `ssr` 框架中默认使用 `less-loader@^7.0.0` 采用如下配置, 需要 `ssr` 框架 `version >=5.5.21`

```js
css: () => {
  return {
    loaderOptions: {
      less: {
        // 透传参数给 less-loader
        lessOptions: {
          modifyVars: {
            'primary-color': '#fff',
            'link-color': '#1DA57A',
            'border-radius-base': '20px'
          },
          javascriptEnabled: true
        }
      }
    }
  }
}
```
## ssrVueLoaderOptions

- 类型: `Object`

- 默认: `{}`

- version: `>=5.5.23`

构建服务端 `bundle` 时的 [vue-loader](https://vue-loader.vuejs.org/options.html) 选项
## csrVueLoaderOptions

- 类型: `Object`

- 默认: `{}`

- version: `>=5.5.23`

构建客户端 `bundle` 时的 [vue-loader](https://vue-loader.vuejs.org/options.html) 选项

## locale

- 类型: `{ enable: boolean }`

- 默认: `{ enable: false }`

是否启用 `vue-i18n` 国际化插件

## corejs

- 类型: `boolean`

- 默认: `false`

开启后我们将会在 [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env#corejs) 中追加如下配置。会自动根据当前代码的使用情况注入对应的 `polyfill` 具体表现请查看 `@babel/preset-env` 中相关说明。此选项用于兼容低端浏览器

```js
module.exports = {
  corejs: {
    version: 3,
    proposals: true
  },
  useBuiltIns: 'usage'
}
```

## babelExtraModule

- 类型: `webpack.RuleSetCondition`

- 默认: `undefined`

- version: `>5.5.45`

框架默认不使用 `babel` 来编译 `node_modules` 中的代码，这会拖慢构建速度，且十分没有必要。一个质量合格的模块应当在发布前对自身进行构建。针对模块质量不合格的特殊情况，我们提供了配置来让开发者指定具体的模块参与 `babel` 编译

```js
module.exports = {
  babelExtraModule: [/module-name/]
}
```

## routerPriority

针对同一前端 `path` 可以对应多个路由时控制约定式路由优先级例如 `/foo`, 可以同时匹配 `/:page` `/foo`。用于约定式路由解析生成的数组排序。数字越大代表优先级越高。没有显示指定的路由优先级统一为 `0`

- 类型: `Record<string, number>`

- 默认: `undefined`

- version: `>5.5.89`

```js
module.exports = {
  routerPriority: {
      '/': 1,
      '/detail/:id': 2 // 优先级更高
    }
}
```

## nestStartTips

自定义 `Nest.js` 场景服务启动成功提示文案，不填写则为 `Server is listening on ${https ? 'https' : 'http'}://localhost:${serverPort}`

- 类型: `string`

- 默认: `undefined`


```js
module.exports = {
  nestStartTips: 'xxx'
}
```

## disableClientRender

禁用默认的客户端渲染逻辑调用。通常与[微前端](./features$在微前端场景下使用(Beta))结合使用

- 类型: `boolean`

- 默认: `undefined`

- version: `>=5.6.4`


```js
module.exports = {
  disableClientRender: true
}
```

## routerOptimize

指定前端页面进行编译构建。在某些情况下我们只需要调试某个前端页面而不是所有页面，此时可以通过该配置来选择需要调试的页面进行构建来提升构建速度减小代码体积。但要注意，如果生产环境仍然是所有页面都需要发布，需要在生产环境禁用此配置，否则构建出来的代码只包含当前选中的页面。

- 类型: `routerOptimize?: {
    include?: string[]
    exclude?: string[]
  }`

- 默认: `undefined`

- version: `>=5.6.12`

```js
module.exports {
  routerOptimize: {
    // 注意，include 和 exclude 不能同时设置只能设置一项
    include: ['/'], // 选择需要构建的前端路由 path
    exclude: ['/'] // 排除不需要构建的前端路由 path
  }
}

```

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
