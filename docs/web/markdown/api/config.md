# 应用配置

注: 在最新的 `example` 中我们支持 `ts` 文件来编写 `config` 以便获取更加完善的类型支持。同时结合本文档一起使用，减少出错的可能性。如果你发现文档滞后或是已有配置无法满足需求。请提 `issue`

本章节将介绍 `config.ts|js` 支持的一些配置。了解详细的配置可以直接查看该[文件](https://github.com/zhangyuang/ssr/blob/dev/packages/types/src/config.ts)

配置文件可通过 `config.ts|js` 文件定义以及调用 `core.render` 方法时实时传入。会将两者配置进行合并

注：得益于 `ssr` 的强大设计，你会发现很多功能开发者完全可以自行在业务代码层面轻松实现而无需框架底层实现或者引入第三方库实现。比如指定页面 `ssr`，比如自定义 `meta` 标签。这些十分简单但重要的功能在其他框架用起来是无比的别扭。而在 `ssr` 框架。一切都是那么自然。

```js
import { render } from 'ssr-core-vue3'

const stream = await render<Readable>(this.ctx, userConfig)
```

## mode

渲染模式

- 类型: `string`
- 默认: `ssr`
- 生效场景: `Webpack/Vite` 

通过渲染模式来决定当前应用采用服务端渲染还是客户端渲染

## stream

- 类型: `boolean`
- 默认: `false`
- 生效场景: `Webpack/Vite` 

是否将组件编译为 `stream` 进行返回来加快展现速度。默认为 `false`, 即返回普通 `html` 字符串

## alias

- 类型: `Record<string, string>`
- 默认: `undefined`
- 生效场景: `Webpack/Vite` 

配置 `alias` 别名
## isDev

- 类型: `boolean`
- 默认: `false`
- 生效场景: `Webpack/Vite` 

标志当前运行环境，根据 `NODE_ENV === development` 判断

## publicPath

- 类型: `string`
- 默认: `/`
- 生效场景: `Webpack/Vite` 

静态资源的 `publicPath`, 本地开发环境一般无需配置。生产环境若走本地静态资源目录也无需配置。若需要走单独的 `CDN` 服务部署可配置为具体的 `CDN` 地址例如 `https://g.alicdn.com/path/xxx`

## useHash

- 类型: `boolean`
- 默认: `true`
- 生效场景: `Webpack` 

构建产物是否带有 `hash`，默认生产环境开启，不建议关闭

## serverPort

- 类型: `number`
- 默认: `3000`
- 生效场景: `Webpack/Vite` 

本地开发时 `Node.js` 服务启动监听的端口, 也可以通过环境变量指定 `SERVER_PORT=9000 ssr start`

## fePort

- 类型: `number`
- 默认: `8888`
- 生效场景: `Webpack` 

本地开发时 `webpack-dev-server` 托管前端静态资源的端口，`Node.js Server` 会自动 `proxy` 静态资源, 无特殊需求不需要修改

<!-- ## chunkName

- 类型: `string`
- 默认: `Page`
- 生效场景: `Webpack` 

静态资源构建时默认的 `entry` 名, 默认为 `Page`。无特殊需求不需要修改 -->

## extraJsOrder

- 类型: `string[]`
- 默认: `[]`
- 生效场景: `Webpack/Vite` 

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
- 生效场景: `Webpack/Vite` 

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
- 生效场景: `Webpack` 

`webpack-dev-server` 启动配置

## chainBaseConfig

- 类型: `(config: WebpackChain) => void`
- 默认: [React](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-react/src/config/base.ts) [Vue](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue/src/config/base.ts) [Vue3](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue3/src/config/base.ts)
- 生效场景: `Webpack` 

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
- 默认: [React](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-react/src/config/server.ts) [Vue](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue/src/config/server.ts) [Vue3](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue3/src/config/server.ts)
- 生效场景: `Webpack` 

使用 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 来修改 `服务端` 公共的 `Webpack` 构建配置

## chainClientConfig

- 类型: `(config: WebpackChain) => void`
- 默认: [React](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-react/src/config/client.ts) [Vue](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue/src/config/client.ts) [Vue3](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue3/src/config/client.ts)
- 生效场景: `Webpack` 

使用 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 来修改 `客户端` 公共的 `Webpack` 构建配置

## whiteList

- 类型: `RegExp[]|string[]`
- 默认: `[/\.(css|less|sass|scss)$/]`
- 生效场景: `Webpack/Vite` 

新增功能：同时支持 `Vite/Webpack` 模式下设置，等价于 `vite.ssr.noexternal`

处理 `server` 端构建模块时，我们默认会对所有的第三方模块使用 `externals` 模式，即不在构建时用 `Webpack` 处理，运行时直接从 `node_modules` 中加载具体模块，但对于一些只提供了 `esm` 格式的模块，或者是非 `Node.js` 环境能直接执行的文件，例如 `jsx|less|sass|css` 等类型的文件会发生运行错误，针对这种类型的特殊模块我们提供了白名单配置，设置服务端构建配置 `externals` 的白名单，即需要让 `Webpack` 来处理的模块.

## prefix🤔 

- 类型: `string|undefined`
- 默认: `undefined`
- 生效场景: `Webpack/Vite`

为前端路由添加统一的 `prefix`, 如 `/${prefix}/`, `/${prefix}/detail/:id`。在功能上等价于 `React-Router` 提供的 `basename` 以及 `Vue-Router` 提供的 `base` 选项。  
同样在设置完该参数后，前端路由的跳转操作都会添加该前缀

## proxy

- 类型: `object`
- 默认: `{}`
- 生效场景: `Webpack/Vite` 

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
- 生效场景: `Webpack/Vite` 

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
- 生效场景: `Webpack` 

是否开启代码分割，默认开启, Vite 模式下必须开启

## customeHeadScript

- 类型: `Array<{describe: object, content: string }>|(ctx: ISSRContext) => Array<{describe: object, content: string }>`
- 默认: `[]`
- 生效场景: `Webpack/Vite` 

仅在 `Vue` 场景下使用, 这里最新版本支持两种类型，可根据当前请求上下文输出不同的脚本内容，常用于动态 [prefix](./features$faq#动态路由前缀) 场景

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

- 类型: `Array<{describe: object, content: string }>|(ctx: ISSRContext) => Array<{describe: object, content: string }>`
- 默认: `[]`
- 生效场景: `Webpack/Vite` 

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
          options: Object|Function // 推荐使用 object see https://www.npmjs.com/package/postcss-loader/v/4.3.0
          plugins: any[]
        }
      }}
    }
}
```

- 默认: `() => {}`

- 生效场景: `Webpack/Vite` 

用于添加用户自定义配置 `css-loader` `less-loader` 以及 `postcss-loader` 的配置，需要用 `函数 return` 的形式

## parallelFetch

- 类型: `boolean`
- 默认: `undefined`
- 生效场景: `Webpack/Vite` 

开启后在服务端获取数据时会并行请求 `layout fetch` 与 `page fetch`。若 `page fetch` 的请求依赖 `layout fetch` 的返回。请不要使用该选项

### antd 定制主题

- 生效场景: `Webpack/Vite` 

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

- 生效场景: `Webpack/Vite` 

构建服务端 `bundle` 时的 [vue-loader](https://vue-loader.vuejs.org/options.html) 选项
## csrVueLoaderOptions

- 类型: `Object`

- 默认: `{}`

- version: `>=5.5.23`

- 生效场景: `Webpack/Vite` 

构建客户端 `bundle` 时的 [vue-loader](https://vue-loader.vuejs.org/options.html) 选项

## locale

- 类型: `{ enable: boolean }`

- 默认: `{ enable: false }`

- 生效场景: `Webpack` 

是否启用 `vue-i18n` 国际化插件

## corejs

- 类型: `boolean`

- 默认: `false`

- 生效场景: `Webpack` 

- Ref: https://www.babeljs.cn/docs/babel-preset-env#corejs

通常与下面的 `corejsOptions` 配合使用，开启后我们将会在 [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env#corejs) 中追加如下配置。会自动根据当前代码的使用情况注入对应的 `polyfill` 具体表现请查看 `@babel/preset-env` 中相关说明。此选项用于兼容低端浏览器

```js
const corejsVersion = coerce(require('core-js/package.json').version).major
const corejsOptions = userConfig.corejs ? {
    corejs: {
      version: corejsVersion,
      proposals: corejsVersion === 3
    },
    targets: {
      chrome: '60',
      firefox: '60',
      ie: '9',
      safari: '10',
      edge: '17'
    },
    useBuiltIns: 'usage',
    shippedProposals: corejsVersion === 2,
    ...userConfig.corejsOptions
  } : {}
```

## corejsOptions

- 类型: `Object`

- 默认: `如上所示`

该配置用于覆盖默认的 `corejsOptions` 配置

## babelExtraModule

- 类型: `webpack.RuleSetCondition`

- 默认: `undefined`

- version: `>5.5.45`

- 生效场景: `Webpack` 

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

- 生效场景: `Webpack/Vite` 

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

- 生效场景: `Webpack/Vite` 


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

- 生效场景: `Webpack/Vite` 


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

- 生效场景: `Webpack/Vite` 

```js
module.exports {
  routerOptimize: {
    // 注意，include 和 exclude 不能同时设置只能设置一项
    include: ['/'], // 选择需要构建的前端路由 path
    exclude: ['/'] // 排除不需要构建的前端路由 path
  }
}

```

## viteConfig

在 `vite` 模式下的 `config` 配置

- 类型

```js
export type viteConfig? = () => {
  // 这里以函数返回值的形式获取配置，参考注意事项，只在本地开发和构建阶段使用到的依赖在函数内部引入，防止生产环境引入导致拖慢速度
  common?: {
    // 双端通用配置
    extraPlugin?: any[] // 需要使用的额外插件
  }
  client?: {
    // 只在客户端生效的配置
    defaultPluginOptions?: any // 默认使用的 vite 前端框架插件的配置，vue3 场景为 @vitejs/plugin-vue， react场景为 @vitejs/plugin-react 查看对应文档获取类型 https://vitejs.dev/plugins/
    define?: Record<string, any>
    extraPlugin?: any[] // 需要使用的额外插件
  }
  server?: {
    // 只在服务端生效的配置
    defaultPluginOptions?: any
    define?: Record<string, any>
    extraPlugin?: any[]
  }
}
```

- 生效场景: `Webpack` 

为了防止用户的配置覆盖框架默认的必要配置导致启动构建失败，所以这里我们暂时只会开放部分配置让开发者使用，若无法满足你的需求，可以提 `issue` 来反馈，我们会根据实际情况新增配置项
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
