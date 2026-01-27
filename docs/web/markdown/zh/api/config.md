# 应用配置

注: 在最新的 `example` 中我们支持 `ts` 文件来编写 `config` 以便获取更加完善的类型支持。同时结合本文档一起使用，减少出错的可能性。如果你发现文档滞后或是已有配置无法满足需求。请提 `issue`

本章节将介绍 `config.ts|js` 支持的一些配置。了解详细的配置可以直接查看该[文件](https://github.com/zhangyuang/ssr/blob/dev/packages/types/src/config.ts)

配置文件可通过 `config.ts|js` 文件定义以及调用 `core.render` 方法时实时传入。会将两者配置进行合并

注：`config.ts|js` 文件将会在编译后统一放置于 `build/config.js` 路径，所以当你在配置文件中使用相对路径引用外部文件时请使用 `require cwd` 类似的语法。目前不支持引入外部 `ts` 文件。由于文档更新不一定及时，建议以最新的 `ssr-types` 类型为主要参考

```js
import { render } from "ssr-core";

const stream = (await render) < Readable > (this.ctx, userConfig);
```

## mode🤔

渲染模式

- 类型: `string`
- 默认: `ssr`
- 生效场景: `Webpack/Vite`

通过渲染模式来决定当前应用采用服务端渲染还是客户端渲染

## stream🤔

- 类型: `boolean`
- 默认: `false`
- 生效场景: `Webpack/Vite`

是否将组件编译为 `stream` 进行返回来加快展现速度。默认为 `false`, 即返回普通 `html` 字符串

## alias🤔

- 类型: `Record<string, string>`
- 默认: `undefined`
- 生效场景: `Webpack/Vite`

配置 `alias` 别名

## isDev🤔

- 类型: `boolean`
- 默认: `false`
- 生效场景: `Webpack/Vite`

标志当前运行环境，根据 `NODE_ENV === development` 判断

## rootId🤔️

- 类型: `string`
- 默认: `#app`
- 生效场景: `Webpack/Vite + Vue2/3 + React17/18`

设置应用的根节点的 `id` 以 `#` 号开头, `React` 场景使用需要额外手动修改 `layout/index.tsx` 中的 `<div id="app">` 修改为指定节点

## assetsDir🤔

- 类型: `string`
- 默认: `static`
- 生效场景: `Webpack/Vite`

设置静态文件资源(js|css|image)的构建目录，默认为 `build/client/static`, 当设置为 `config.assetsDir = 'assets'` 时，构建目录为 `build/client/assets`

## publicPath🤔

- 类型: `string`
- 默认: `/`
- 生效场景: `Webpack/Vite`

静态资源的 `publicPath`, 本地开发环境一般无需配置。生产环境若走本地静态资源目录也无需配置。若需要走单独的 `CDN` 服务部署可配置为具体的 `CDN` 地址例如 `https://g.alicdn.com/path/xxx`

## useHash🤔

- 类型: `boolean`
- 默认: `true`
- 生效场景: `Webpack`

构建产物是否带有 `hash`，默认生产环境开启，不建议关闭

## serverPort🤔

- 类型: `number`
- 默认: `3000`
- 生效场景: `Webpack/Vite`

本地开发时 `Node.js` 服务启动监听的端口, 也可以通过环境变量指定 `SERVER_PORT=9000 ssr start`

## fePort🤔

- 类型: `number`
- 默认: `8999`
- 生效场景: `Webpack`

本地开发时 `webpack-dev-server` 托管前端静态资源的端口，`Node.js Server` 会自动 `proxy` 静态资源, 无特殊需求不需要修改

<!-- ## chunkName

- 类型: `string`
- 默认: `Page`
- 生效场景: `Webpack`

静态资源构建时默认的 `entry` 名, 默认为 `Page`。无特殊需求不需要修改 -->

## define🤔

- 类型: `{define?: {
  base?: Record<string, string>
  client?: Record<string, string>
  server?: Record<string, string>
}}`
- 默认: `{}`
- 生效场景: `Webpack/Vite`

添加通用 `definePlugin` 配置，在双端皆可生效。兼容 `Webpack/Vite` 场景

## extraJsOrder🤔

- 类型: `((ctx: ISSRContext) => string[]) | string[]`
- 默认: `[]`
- 生效场景: `Webpack/Vite`

需要额外初始化加载的 `js chunk name`，通常配合 `splitChunks` 配置一起使用, 若生成其他 `name` 的 `chunk` 开发者可通过 `http://localhost:3000/asset-manifest.json` 文件查看具体的 `chunkName`

```js
module.exports = {
  extraJsOrder: ["styles.js"], // 在页面底部额外加载 styles.chunk.js 文件，生产环境自动获取正确的 hash 文件
  extraCssOrder: ["styles.css"], // 在页面头部额外加载 styles.chunk.css 文件，生产环境自动获取正确的 hash 文件
};
```

高级用法，按需加载切割出来的 `vendor`

```js
import type { UserConfig, ISSRMidwayKoaContext } from 'ssr-types'

const userConfig: UserConfig = {
  chainClientConfig: chain => {
    chain.optimization.splitChunks({
      ...chain.optimization.get('splitChunks'),
      cacheGroups: {
        'vendor-swiper': {
          test: (module: any) => {
            return module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.match('swiper')
          },
          name: 'vendor-swiper',
          priority: 3
        },
        ...chain.optimization.get('splitChunks').cacheGroups
      }
    })
  },
  extraJsOrder: (ctx) => {
    const ctxWithType = ctx as ISSRMidwayKoaContext
    // 只有访问首页的时候加载 vendor-swiper
    if (ctxWithType.path === '/') {
      return ['vendor-swiper.js']
    }
  }
}

export { userConfig }

```

## extraCssOrder🤔

- 类型: `((ctx: ISSRContext) => string[]) | string[]`
- 默认: `[]`
- 生效场景: `Webpack/Vite`

需要额外初始化加载的 `css chunk name`，通常配合 `splitChunks` 配置一起使用。用法与 `extraJsOrder` 一样

```js
module.exports = {
  extraJsOrder: ["styles.js"],
  extraCssOrder: ["styles.css"],
};
```

## jsOrderPriority🤔

高级用法，用来控制生成的所有 `js chunk` 在页面中的加载优先级顺序处理参数来源是 `JsOrder` 与 `extraJsOrder` 合并后的完整结果。无特殊情况不需要进行改设置。

- 类型: `Record<string, number> | ((params: {chunkName: string}) => Record<string, number>) `

- 默认: `undefined`

- version: `latest`

- 生效场景: `Webpack/Vite`

默认加载顺序如下，`chunkName` 代表当前请求的路由对应的前端页面级组件被构建出来的 `chunkName.chunk.js` 文件

```js
const jsOrder = isVite
  ? ["Page.js"]
  : ["runtime~Page.js", "vendor.js", "common-vendor.js", "Page.js", "layout-app.js"];
```

```js
module.exports = {
  // 没有设置的统一优先级为0， 优先级越高的越先加载
  jsOrderPriority: {
      'vendor.js': 1,
      'common-vendor.js': 2 // 优先级更高
  },
  jsOrderPriority: ({ chunkName }) => ({
      // 支持传入函数，入参为当前请求的页面 ChunkName 名称，可直接使用，例如 index.chunk.js 中的 index 为首页的 chunkName, detail-id.chunk.js 中的 detail-id 为详情页的 chunkName
      // 注意 chunkName 的获取依赖服务端运行时逻辑，故 spa build 模式下，不存在 chunkName 入参
      `${chunkName}.js`: 1,
      'common-vendor.js': 2 // 优先级更高
  })
}
```

## cssOrderPriority🤔

高级用法，用来控制生成的所有 `css chunk` 在页面中的加载优先级顺序处理参数来源是 `cssOrder` 与 `extraCssOrder` 合并后的完整结果。无特殊情况不需要进行改设置。

- 类型: `Record<string, number> | ((params: {chunkName: string}) => Record<string, number>) `

- 默认: `undefined`

- version: `latest`

- 生效场景: `Webpack/Vite`

默认加载顺序如下，`chunkName` 代表当前请求的路由对应的前端页面级组件被构建出来的 `chunkName.chunk.css` 文件

```js
const cssOrder = ["vendor.css", "common-vendor.css", "Page.css", "layout-app.css"];
```

具体用法如上参考 `jsOrderPriority`

## cssInline🤔

- 类型 `'all'|string[]`
- 默认 `undefined`
- 生效场景 `Vue2/3 + Webpack/Vite`

只在生产环境生效。用于自定义哪些 `cssChunk` 需要被 `style` 标签 `inline`。`cssChunks` 的集合查看 `asset-manifest.json` 获得。需要保证运行时 `path.join(process.cwd(), './build', '${chunkPath}')`的路径存在于本地文件中。当值为 `all` 时，默认所有的 `cssChunk` 都会在运行时內联。

```js
// asset-manifest.json
{
  "index~detail-id.css": "/client/static/index~detail-id.8894e773.chunk.css",
  "index~detail-id.js": "/client/static/index~detail-id.1fe746c4.chunk.js",
  "vendor.js": "/client/static/vendor.6bb41bc3.chunk.js",
  "Page.css": "/client/static/Page.18a19313.chunk.css",
  "Page.js": "/client/static/Page.13ad4870.chunk.js",
  "detail-id.css": "/client/static/detail-id.03b9e22b.chunk.css",
  "detail-id.js": "/client/static/detail-id.e30e8bf6.chunk.js",
  "detail-id-fetch.js": "/client/static/detail-id-fetch.3af0feb0.chunk.js",
  "index.css": "/client/static/index.48cc7c95.chunk.css",
  "index.js": "/client/static/index.71a22404.chunk.js",
  "index-fetch.js": "/client/static/index-fetch.bf6bd7af.chunk.js",
  "runtime~Page.js": "/client/static/runtime~Page.e43266a7.js"
}
```

这里也可以自行覆盖本地的 `asset-manifest.json` 为绝对路径例如 `Page.js: /User/xxxx/Page.js`来自定义控制。框架检测到绝对路径将会直接使用该路径

## babelOptions🤔

- 类型: `babelCore.transformOptions`
- 默认: `undefined`
- 生效场景: `Webpack/Vite`

建议使用该配置来修改默认的 `babel` 配置，兼容 `Webpack/Vite` 场景

```js

export {
  babelOptions: {
    include: [] as RegExp[], // 需要额外处理的第三方模块
    exclude: [] as RegExp[], // 业务代码不需要处理的文件，通常用于指定纯 js 已经构建过一次的文件二次使用
    presets: [] // 比较少用
    plugins: [] // 通常使用该配置新增 plugin
  }
}
```

## webpackDevServerConfig🤔

- 类型: `webpackDevServer.Configuration`
- 默认: `见文章上方具体配置文件`
- 生效场景: `Webpack`

`webpack-dev-server` 启动配置

## chainBaseConfig🤔

- 类型: `(config: WebpackChain) => void`
- 默认: [React](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-react/src/config/base.ts) [Vue](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue/src/config/base.ts) [Vue3](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue3/src/config/base.ts)
- 生效场景: `Webpack`

使用 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 来修改 `服务端/客户端` 公共的 `Webpack` 构建配置。

注意：开发者的大部分需求都应该修改 `baseConfig` 而不是独立的 `serverConfig` 或 `clientConfig`

例如为 `markdown` 文件添加 `raw-loader` 进行解析

```js
module.exports = {
  chainBaseConfig: (chain, isServer) => {
    chain.module
      .rule("markdown")
      .test(/\.md$/)
      .use("raw-loader")
      .loader(require.resolve("raw-loader"))
      .end();
  },
};
```

## chainServerConfig🤔

- 类型: `(config: WebpackChain) => void`
- 默认: [React](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-react/src/config/server.ts) [Vue](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue/src/config/server.ts) [Vue3](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue3/src/config/server.ts)
- 生效场景: `Webpack`

使用 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 来修改 `服务端` 公共的 `Webpack` 构建配置

## chainClientConfig🤔

- 类型: `(config: WebpackChain) => void`
- 默认: [React](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-react/src/config/client.ts) [Vue](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue/src/config/client.ts) [Vue3](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue3/src/config/client.ts)
- 生效场景: `Webpack`

使用 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 来修改 `客户端` 公共的 `Webpack` 构建配置

## whiteList🤔

- 类型: `RegExp[]|string[]`
- 默认: `[/\.(css|less|sass|scss)$/]`
- 生效场景: `Webpack/Vite`

新增功能：同时支持 `Vite/Webpack` 模式下设置，等价于 `vite.ssr.noexternal`

处理 `server` 端构建模块时，我们默认会对所有的第三方模块使用 `externals` 模式，即不在构建时用 `Webpack` 处理，运行时直接从 `node_modules` 中加载具体模块，但对于一些只提供了 `esm` 格式的模块，或者是非 `Node.js` 环境能直接执行的文件，例如 `jsx|less|sass|css` 等类型的文件会发生运行错误，针对这种类型的特殊模块我们提供了白名单配置，设置服务端构建配置 `externals` 的白名单，即需要让 `Webpack` 来处理的模块。

`whiteList` 有 `string[]` 和 `RegExp[]` 两种形式，代表不同的含义请根据实际需求选择

- `string[]`: 当 `whiteList` 的值不为 `RegExp` 而是 `string` 的时候，框架会将其当成模块名，并且会深度遍历模块自身的依赖以及依赖的依赖。例如 `antd` 自身的 `dependencies` 里依赖了其他模块，为了避免重复配置，这些模块也需要一并配置到白名单当中。这里为了减少工作量，框架本身增加了一层比较简单的依赖自动遍历收集策略来自动收集所以需要处理的模块。在 `Serverless` 发布模式下我们通常使用 `string[]` 的形式，因为我们在这种场景只会安装 `production` 环境的 `node_modules`

- `RegExp[]`: 只匹配正则能够匹配的依赖，当应用安装了完整的 `node_modules` 或确定依赖的子依赖无需被处理时可使用正则匹配。会让程序的逻辑变得简单以及更快的构建速度。

## prefix🤔

- 类型: `string|undefined`
- 默认: `undefined`
- 生效场景: `Webpack/Vite`

为前端路由添加统一的 `prefix`, 如 `/${prefix}/`, `/${prefix}/detail/:id`。在功能上等价于 `React-Router` 提供的 `basename` 以及 `Vue-Router` 提供的 `base` 选项。  
同样在设置完该参数后，前端路由的跳转操作都会添加该前缀

## proxy🤔

- 类型: `object`
- 默认: `{}`
- 生效场景: `Webpack/Vite`

底层使用 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 来进行代理，框架只是单纯透传参数， 具体配置查看 `http-proxy-middleware` 文档即可

```js
module.exports = {
  proxy: {
    "/api": {
      target: "http://www.example.org",
      changeOrigin: true,
    },
  },
};
```

## https🤔

- 类型: `boolean`
- 默认: `userConfig.https ? userConfig.https : !!process.env.HTTPS`
- 生效场景: `Webpack/Vite`

是否开启底层 `webpack-dev-server` 的 `https` 模式，需配合 `3000` 端口的 `Node.js` 的 `https` 服务同步使用。设置为 `true` 将使用默认的自签名证书。当此证书无法被信任时，也可以自行传递与 `Node.js` 服务端一致的证书配置。

注：更加推荐本地开发时使用 [whistle](https://wproxy.org/whistle/) 启动 `https` 代理服务

```js
const fs = require("fs");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  // 可以通过 ssr-server-utils 的 loadConfig api 在服务端代码中读取配置，传递给对应的服务端框架设置证书
  https: isProd
    ? {}
    : {
        key: fs.readFileSync("./scripts/https/https.key"),
        cert: fs.readFileSync("./scripts/https/https.crt"),
      },
};

// server 端如何读取, 以 nest.js 为例
// main.ts
import { loadConfig } from "ssr-common-utils";

const { https } = loadConfig();
const app =
  (await NestFactory.create) <
  NestExpressApplication >
  (AppModule,
  isProd
    ? {}
    : {
        httpsOptions: https,
      });
```

## dynamic🤔

- 类型: `boolean`
- 默认: `true`
- 生效场景: `Webpack`

是否开启代码分割，默认开启, Vite 模式下必须开启

## customeHeadScript🤔

- 类型: `Array<{tagName?: string, describe: object, content: string }>|(ctx: ISSRContext) => Array<{tagName?: string, describe: object, content: string }>`
- 默认: `[]`
- 生效场景: `Webpack/Vite`

仅在 `Vue` 场景下使用, 这里最新版本支持两种类型，可根据当前请求上下文输出不同的脚本内容，常用于动态 [prefix](./features$faq#动态路由前缀) 场景

用于通过配置在页面头部插入自定义的 `script` 为了避免影响期望功能这块内容不做 `escape`，为了避免 `xss` 需要保证插入脚本代码的安全性

`tagName` 自定义需要创建的标签名称，默认为 `script` 标签

`describe` 字段参考 `Vue` [createElement](https://cn.vuejs.org/v2/guide/render-function.html#createElement-%E5%8F%82%E6%95%B0) 用于设置 `script` 标签的 `attribute`

`content` 为 `script` 的内容

```js
module.exports = {
  customeHeadScript: [
    // Vue3 直接写 attr 属性即可
    {
      tagName: "xxx", // 默认值为 script
      describe: {
        type: "text/javascript",
        src: "https://res.wx.qq.com/open/js/jweixin-1.2.0.js",
      },
      content: "",
    },
    // Vue2 需要包裹在 attrs 属性中，具体详情查看对应版本的 Vue 文档即可
    {
      describe: {
        attrs: {
          type: "text/javascript",
          src: "https://res.wx.qq.com/open/js/jweixin-1.2.0.js",
        },
      },
      content: "",
    },
    // 直接插入 script 内容
    {
      content: `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?xxxx";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`,
    },
  ],
};
```

## customeFooterScript🤔

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

## parallelFetch🤔

- 类型: `boolean`
- 默认: `undefined`
- 生效场景: `Webpack/Vite`

开启后在服务端获取数据时会并行请求 `layout fetch` 与 `page fetch`。若 `page fetch` 的请求依赖 `layout fetch` 的返回。请不要使用该选项

### antd 定制主题🤔

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
            "primary-color": "#fff",
            "link-color": "#1DA57A",
            "border-radius-base": "20px",
          },
          javascriptEnabled: true,
        },
      },
    },
  };
};
```

## ssrVueLoaderOptions🤔

- 类型: `Object`

- 默认: `{}`

- version: `>=5.5.23`

- 生效场景: `Webpack/Vite`

构建服务端 `bundle` 时的 [vue-loader](https://vue-loader.vuejs.org/options.html) 选项

## csrVueLoaderOptions🤔

- 类型: `Object`

- 默认: `{}`

- version: `>=5.5.23`

- 生效场景: `Webpack/Vite`

构建客户端 `bundle` 时的 [vue-loader](https://vue-loader.vuejs.org/options.html) 选项

## locale🤔

- 类型: `{ enable: boolean }`

- 默认: `{ enable: false }`

- 生效场景: `Vue3 + Webpack`

是否启用 `vue-i18n` 国际化插件

## corejs🤔

- 类型: `boolean`

- 默认: `false`

- 生效场景: `Webpack`

- Ref: https://www.babeljs.cn/docs/babel-preset-env#corejs

通常与下面的 `corejsOptions` 配合使用，开启后我们将会在 [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env#corejs) 中追加如下配置。会自动根据当前代码的使用情况注入对应的 `polyfill` 具体表现请查看 `@babel/preset-env` 中相关说明。此选项用于兼容低端浏览器

```js
const corejsVersion = coerce(require("core-js/package.json").version).major;
const corejsOptions = userConfig.corejs
  ? {
      corejs: {
        version: corejsVersion,
        proposals: corejsVersion === 3,
      },
      targets: {
        chrome: "60",
        firefox: "60",
        ie: "9",
        safari: "10",
        edge: "17",
      },
      useBuiltIns: "usage",
      shippedProposals: corejsVersion === 2,
      ...userConfig.corejsOptions,
    }
  : {};
```

## corejsOptions🤔

- 类型: `Object`

- 默认: `如上所示`

该配置用于覆盖默认的 `corejsOptions` 配置

## babelExtraModule🤔 (建议使用 babelOptions.include 代替)

- 类型: `RegExp`

- 默认: `undefined`

- version: `>5.5.45`

- 生效场景: `Webpack`

框架默认不使用 `babel` 来编译 `node_modules` 中的代码，这会拖慢构建速度，且十分没有必要。一个质量合格的模块应当在发布前对自身进行构建。针对模块质量不合格的特殊情况，我们提供了配置来让开发者指定具体的模块参与 `babel` 编译

```js
module.exports = {
  babelExtraModule: [/module-name/],
};
```

## routerPriority🤔

针对同一前端 `path` 可以对应多个路由时控制约定式路由优先级例如 `/foo`, 可以同时匹配 `/:page` `/foo`。用于约定式路由解析生成的数组排序。数字越大代表优先级越高。没有显示指定的路由优先级统一为 `0`

- 类型: `Record<string, number>`

- 默认: `undefined`

- version: `>5.5.89`

- 生效场景: `Webpack/Vite`

```js
module.exports = {
  routerPriority: {
    "/": 1,
    "/detail/:id": 2, // 优先级更高
  },
};
```

## nestStartTips🤔

自定义 `Nest.js` 场景服务启动成功提示文案，不填写则为 `Server is listening on ${https ? 'https' : 'http'}://localhost:${serverPort}`

- 类型: `string`

- 默认: `undefined`

- 生效场景: `Webpack/Vite`

```js
module.exports = {
  nestStartTips: "xxx",
};
```

<!-- ## disableClientRender

禁用默认的客户端渲染逻辑调用。通常与[微前端](./features$在微前端场景下使用(Beta))结合使用

- 类型: `boolean`

- 默认: `undefined`

- version: `>=5.6.4`

- 生效场景: `Webpack/Vite`


```js
module.exports = {
  disableClientRender: true
}
``` -->

## routerOptimize🤔

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

## hashRouter🤔

- 类型: `boolean`

- 默认: `undefined`

- version: `>=6.2.2`

- 生效场景: `Vue3` + `Webpack/Vite`

仅在 `Vue3 ssr build --html` 场景下生效，通于降级 `html` 渲染的场景不存在服务器环境，此时需要让客户端使用 `hashRouter`。

```js
import type { UserConfig } from 'ssr-types'

const userConfig: UserConfig = {
  hashRouter: true
}

export { userConfig }

```

## viteConfig🤔

在 `vite` 模式下的 `config` 配置

- 类型

```js
type viteConfig?: () => {
    common?: {
      // 双端通用配置
      extraPlugin?: PluginOption | PluginOption[]
      server?: ServerOptions // 对应 vite.server 配置
    }
    client?: {
      // 只在客户端生效的配置
      defaultPluginOptions?: any // 为默认装载的插件定义 options, vue3 场景是 @vitejs/plugin-vue, react 场景是 @vitejs/plugin-react
      otherConfig?: ViteConfig
      processPlugin?: (plugins: PluginOption[]) => PluginOption[] // 传入当前使用的插件列表，返回新的插件列表，通过此方法来新增/移除框架默认插件
    }
    server?: {
      // 只在服务端生效的配置
      externals?: string[] // 强制 externals 的第三方依赖
      defaultPluginOptions?: any
      otherConfig?: ViteConfig
      processPlugin?: (plugins: PluginOption[]) => PluginOption[]
    }
  }
```

为了防止用户的配置覆盖框架默认的必要配置导致启动构建失败，所以这里我们暂时只会开放部分配置让开发者使用，若无法满足你的需求，可以提 `issue` 来反馈，我们会根据实际情况新增配置项

## htmlTemplate🤔

参考文件 [html](https://github.com/zhangyuang/ssr/blob/dev/packages/cli/src/html.ts)

- 类型: `string`
- 默认: `\<!DOCTYPE html>
\<html lang="en">
\<head>
  \<meta charset="UTF-8">
  \<meta http-equiv="X-UA-Compatible" content="IE=edge">
  \<meta name="viewport" content="width=device-width, initial-scale=1.0">
  \<title>Document\</title>
  cssInject
  jsHeaderManifest
\</head>
\<body>
  \<div id="app">\</div>
  hashRouterScript
  jsFooterManifest
  jsManifest
\</body>
\</html>`

- 生效场景: `Webpack/Vite`

作为 `ssr build --html` 的构建模版，开发者可自行设置 `title, meta` 等标签信息，其余模版插入内容请不要修改保持不变。

## bigpipe🤔

- 类型 `boolean`
- 默认 `undefined`
- 生效场景 `Vue2/3 + Webpack/Vite`

高级用法，只在特定场景下适用。

开启 `bigpipe` 配置后，框架将会将完整的 `html` 文档拆分为两部分返回，分别是无实际意义内容的 `layout` 和有实际内容的 `children` 部分。

此功能用于开发者需要提前返回包含页面所需的静态资源文件给浏览器提前加载，而无需等待服务端渲染接口响应和页面完全渲染完毕才返回完整的 `html` 文档。

例如如下的 `layout` 组件

```html
<template>
  <!-- 注：Layout 只会在服务端被渲染，不要在此运行客户端有关逻辑，不要删除 rem 初始化以外的任何初始设置 -->
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#000000" />
      <title>Serverless Side Render for Vue</title>
      <slot name="remInitial" />
      <!-- 包含 css 静态资源文件，以及预请求 js 静态资源文件 -->
      <slot name="injectHeader" />
    </head>
    <!-- -------我是分割线----------- -->
    <body>
      <slot name="content" />
    </body>
  </html>
</template>
```

将会以分割线为结点，分为前后两部分进行内容返回。

```js
import { render } from 'ssr-core'

// 此时将不会调用 fetch 返回的内容为不包含实际页面组件内容的 layout 组件
const headHtmlStr = await render(ctx, {
  bigpipe: true
  stream: false, // 注意这里要使用字符串形式的返回数据类型
});

// 使用基于 koa 的框架需要手动设置 status
// ctx.status = 200

// 提前返回包含静态资源文件的 html 头部 也可提前返回 loading
res.write(headHtmlStr.split('<body>')[0]);
res.write('<body><!-- loading -->');

// 第二次调用 render 后返回完整的页面内容
const bodyhtmlStr = await render(ctx, {
  stream: false
});

// 与首次返回的页面内容进行组装拼接为完整的 html 文档结构
// 这里也可以根据 html 字符串的大小决定是直接返回字符串给客户端，还是将字符串转换为 stream 后再进行返回
res.write(bodyhtmlStr.split('<body>')[1]);

res.end();

```

通常在 `ssr` 过程中接口和页面元素节点过多导致渲染时间过长进而页面白屏时间较长的场景可能会使用到此能力。可通过提前返回 `<head>` 的部分，预加载样式和脚本文件，也可以通过分块提前返回 `loading` 或骨架屏来替代 `<body>` 返回前的白屏。

## staticConfigPath🤔

- 类型 `string`
- 默认 `build/staticConfig.js`
- 生效场景 `Vue2/3 + Webpack/Vite`

设置静态构建文件的路径。默认值 `build/staticConfig.js` 目前不允许修改!!!。

使用场景：针对一些需要在构建时获取生成 `customeHeadScript|customeFooterScript` 的业务场景例如构建时通过接拉取脚本配置信息，减少运行时的性能损耗。开发者可以自定义构建逻辑，在 `ssr build` 执行之前或者之后(如果要兼容 `SPA静态html文件` 场景需要在 `ssr build` 执行之前完成)生成 `build/staticConfig.js` 文件。框架将会在运行时加载此文件读取其中的内容。

```bash
$ node xxx.js && ssr build
```

可以在 `ssr build` 执行前通过调用自己编写的脚本来生成此文件，也可以通过 `chainClientWebpack` 等配置在 `ssr build` 时监听 `webpack` 事件来生成。生成 `SPA` 的逻辑将会在 `webpack` 构建结束后再执行。

文件示例如下

```js
// build/staticConfig.js
// 只能使用 commonjs 语法兼容 Node.js 环境

exports.customeHeadScript = [
  // 规范与上文的 customeHeadScript 保持完全一致
  // Vue3 直接写 attr 属性即可
  {
    tagName: "script", // 默认值为 script
    describe: {
      type: "text/javascript",
      src: "https://res.wx.qq.com/open/js/jweixin-1.2.0.js",
    },
    content: "",
  },
];
```

此文件建议使用 `exports.xxx` 语法进行导出。目前支持 `customeHeadScript|customeFooterScript` 的导出逻辑。

## framework

- 类型 `string`
- 默认 `undefined`
- 生效场景 `all`

自定义前端插件来替换例如 `ssr-plugin-vue3` 的逻辑，常用于在 `ssr-plugin-vue3` 二次开发的情况

## streamHighWaterMark

- 类型 `number`
- 默认 `1024 * 16`
- 生效场景 `react`

`react` 场景设置默认的`stream`缓冲区大小,默认为`16kb`，当页面体积过大超过限制时会渲染失败,此时需要通过该配置设置默认缓冲区大小，或者修改返回类型为 `string`，单位byte (1024\*1024 = 1mb)

## 注意事项

1. 由于 `config.js` 文件在 Node.js 环境也会被加载，如果直接在顶部 `require` 模块可能会导致模块`体积过大`，降低应用启动速度，对于一些只在构建逻辑中才会用到的模块我们建议在必要的函数当中再 `require` 加载。
   以添加 `postcss` 插件为例

```js
module.exports = {
  css: () => {
    // css 在 vue-cli 中是直接配置对象，但在本框架需要使用函数来 return 具体对象，这样我们只有在本地打包阶段才会去 require 要用到的依赖。在生产环境服务启动的时候不会 require
    const pxtoviewport = require("postcss-px-to-viewport");
    return {
      loaderOptions: {
        postcss: {
          plugins: [
            pxtoviewport({
              viewportWidth: 375,
            }),
          ],
        },
      },
    };
  },
};
```

2. 我们通过 `chainWebpackConfig` 的方式来让用户可以修改默认配置

但绝大部分情况下你不需要去修改默认的配置。我们默认的配置是基于 `create-react-app` 生成的配置上做了一些优化。已经极力做到最优。如果确定需要修改默认配置，应该先看看配置有无提供额外选项直接设置例如 `css.loaderOptions` ，而不是通过 `WebpackChain` 工具去重新设置规则。这样极易导致错误。

我们后续可能会兼容一些 `vue-cli` 支持的配置，但不是全部。我们并不打算做成大而全的工具这样只会变成大黑盒。配置越多只会增加错误出现的可能性。参考 `vue-cli` 工具 400多个文件，3w 行源码 580个待解决 `issue`。
