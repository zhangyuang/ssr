# Application Configuration

Note: In the latest `example`, we support using `ts` files to write `config` for better type support. Use this in combination with this documentation to reduce the possibility of errors. If you find the documentation lagging behind or existing configurations cannot meet your needs, please submit an `issue`.

This chapter will introduce some configurations supported by `config.ts|js`. For detailed configuration, you can directly check this [file](https://github.com/zhangyuang/ssr/blob/dev/packages/types/src/config.ts).

Configuration files can be defined through `config.ts|js` files and passed in real-time when calling the `core.render` method. The two configurations will be merged.

Note: The `config.ts|js` file will be uniformly placed in the `build/config.js` path after compilation, so when you use relative paths to reference external files in the configuration file, please use syntax like `require cwd`. Currently, importing external `ts` files is not supported. Since documentation updates may not be timely, it is recommended to use the latest `ssr-types` types as the main reference.

```js
import { render } from "ssr-core";

const stream = (await render) < Readable > (this.ctx, userConfig);
```

## mode🤔

Rendering mode

- Type: `string`
- Default: `ssr`
- Applicable scenarios: `Webpack/Vite`

Determines whether the current application uses server-side rendering or client-side rendering through the rendering mode

## stream🤔

- Type: `boolean`
- Default: `false`
- Applicable scenarios: `Webpack/Vite`

Whether to compile components as `stream` for return to accelerate display speed. Default is `false`, i.e., return normal `html` strings

## alias🤔

- Type: `Record<string, string>`
- Default: `undefined`
- Applicable scenarios: `Webpack/Vite`

Configure `alias` aliases

## isDev🤔

- Type: `boolean`
- Default: `false`
- Applicable scenarios: `Webpack/Vite`

Flag for current runtime environment, determined by `NODE_ENV === development`

## rootId🤔️

- Type: `string`
- Default: `#app`
- Applicable scenarios: `Webpack/Vite + Vue2/3 + React17/18`

Set the application's root node `id` starting with `#`. For `React` scenarios, you need to manually modify `<div id="app">` in `layout/index.tsx` to the specified node

## assetsDir🤔

- Type: `string`
- Default: `static`
- Applicable scenarios: `Webpack/Vite`

Set the build directory for static file resources (js|css|image), default is `build/client/static`. When set to `config.assetsDir = 'assets'`, the build directory becomes `build/client/assets`

## publicPath🤔

- Type: `string`
- Default: `/`
- Applicable scenarios: `Webpack/Vite`

The `publicPath` for static resources. Generally no configuration needed for local development environment. No configuration needed for production environment if using local static resource directory. If you need to deploy through separate `CDN` service, configure to specific `CDN` address like `https://g.alicdn.com/path/xxx`

## useHash🤔

- Type: `boolean`
- Default: `true`
- Applicable scenarios: `Webpack`

Whether build artifacts have `hash`, enabled by default in production environment, not recommended to disable

## serverPort🤔

- Type: `number`
- Default: `3000`
- Applicable scenarios: `Webpack/Vite`

The port that the `Node.js` service listens on during local development. Can also be specified through environment variables `SERVER_PORT=9000 ssr start`

## fePort🤔

- Type: `number`
- Default: `8999`
- Applicable scenarios: `Webpack`

The port for `webpack-dev-server` to host frontend static resources during local development. The `Node.js Server` will automatically `proxy` static resources. No modification needed unless there are special requirements

<!-- ## chunkName

- Type: `string`
- Default: `Page`
- Applicable scenarios: `Webpack`

Default `entry` name when building static resources, defaults to `Page`. No modification needed unless there are special requirements -->

## define🤔

- Type: `{define?: {
  base?: Record<string, string>
  client?: Record<string, string>
  server?: Record<string, string>
}}`
- Default: `{}`
- Applicable scenarios: `Webpack/Vite`

Add universal `definePlugin` configuration that works on both client and server sides. Compatible with `Webpack/Vite` scenarios

## extraJsOrder🤔

- Type: `((ctx: ISSRContext) => string[]) | string[]`
- Default: `[]`
- Applicable scenarios: `Webpack/Vite`

Additional `js chunk name` that needs to be loaded during initialization, usually used together with `splitChunks` configuration. If other `name` chunks are generated, developers can view specific `chunkName` through the `http://localhost:3000/asset-manifest.json` file

```js
module.exports = {
  extraJsOrder: ["styles.js"], // Load additional styles.chunk.js file at the bottom of the page, production environment automatically gets the correct hash file
  extraCssOrder: ["styles.css"], // Load additional styles.chunk.css file at the head of the page, production environment automatically gets the correct hash file
};
```

Advanced usage, load split `vendor` on demand

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
    // Only load vendor-swiper when accessing the homepage
    if (ctxWithType.path === '/') {
      return ['vendor-swiper.js']
    }
  }
}

export { userConfig }

```

## extraCssOrder🤔

- Type: `((ctx: ISSRContext) => string[]) | string[]`
- Default: `[]`
- Applicable scenarios: `Webpack/Vite`

Additional `css chunk name` that needs to be loaded during initialization, usually used together with `splitChunks` configuration. Usage is the same as `extraJsOrder`

```js
module.exports = {
  extraJsOrder: ["styles.js"],
  extraCssOrder: ["styles.css"],
};
```

## jsOrderPriority🤔

Advanced usage to control the loading priority order of all generated `js chunks` in the page. The processed parameters come from the complete result of merging `JsOrder` and `extraJsOrder`. No modification needed unless there are special circumstances.

- Type: `Record<string, number> | ((params: {chunkName: string}) => Record<string, number>) `

- Default: `undefined`

- version: `latest`

- Applicable scenarios: `Webpack/Vite`

Default loading order is as follows, where `chunkName` represents the `chunkName.chunk.js` file built from the frontend page-level component corresponding to the current request route

```js
const jsOrder = isVite
  ? ["Page.js"]
  : ["runtime~Page.js", "vendor.js", "common-vendor.js", "Page.js", "layout-app.js"];
```

```js
module.exports = {
  // Unset items have a unified priority of 0, higher priority loads first
  jsOrderPriority: {
      'vendor.js': 1,
      'common-vendor.js': 2 // Higher priority
  },
  jsOrderPriority: ({ chunkName }) => ({
      // Supports passing in a function, with the parameter being the ChunkName of the current request page, can be used directly. For example, 'index' in index.chunk.js is the chunkName for the homepage, 'detail-id' in detail-id.chunk.js is the chunkName for the detail page
      // Note that chunkName acquisition depends on server-side runtime logic, so in spa build mode, there is no chunkName parameter
      `${chunkName}.js`: 1,
      'common-vendor.js': 2 // Higher priority
  })
}
```

## cssOrderPriority🤔

Advanced usage to control the loading priority order of all generated `css chunks` in the page. The processed parameters come from the complete result of merging `cssOrder` and `extraCssOrder`. No modification needed unless there are special circumstances.

- Type: `Record<string, number> | ((params: {chunkName: string}) => Record<string, number>) `

- Default: `undefined`

- version: `latest`

- Applicable scenarios: `Webpack/Vite`

Default loading order is as follows, where `chunkName` represents the `chunkName.chunk.css` file built from the frontend page-level component corresponding to the current request route

```js
const cssOrder = ["vendor.css", "common-vendor.css", "Page.css", "layout-app.css"];
```

Specific usage is the same as `jsOrderPriority` above

## cssInline🤔

- Type `'all'|string[]`
- Default `undefined`
- Applicable scenarios `Vue2/3 + Webpack/Vite`

Only effective in production environment. Used to customize which `cssChunk` needs to be `inline` with `style` tags. The collection of `cssChunks` can be viewed in `asset-manifest.json`. Need to ensure that the path `path.join(process.cwd(), './build', '${chunkPath}')` exists in local files at runtime. When the value is `all`, all `cssChunk` will be inlined at runtime by default.

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

You can also override the local `asset-manifest.json` with absolute paths, for example `Page.js: /User/xxxx/Page.js` for custom control. The framework will directly use that path when it detects an absolute path

## babelOptions🤔

- Type: `babelCore.transformOptions`
- Default: `undefined`
- Applicable scenarios: `Webpack/Vite`

Recommended to use this configuration to modify the default `babel` configuration, compatible with `Webpack/Vite` scenarios

```js

export {
  babelOptions: {
    include: [] as RegExp[], // Third-party modules that need additional processing
    exclude: [] as RegExp[], // Business code files that don't need processing, usually used to specify pure JS files that have already been built once for reuse
    presets: [] // Less commonly used
    plugins: [] // Usually use this configuration to add plugins
  }
}
```

## webpackDevServerConfig🤔

- Type: `webpackDevServer.Configuration`
- Default: `See specific configuration file above in the article`
- Applicable scenarios: `Webpack`

`webpack-dev-server` startup configuration

## chainBaseConfig🤔

- Type: `(config: WebpackChain) => void`
- Default: [React](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-react/src/config/base.ts) [Vue](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue/src/config/base.ts) [Vue3](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue3/src/config/base.ts)
- Applicable scenarios: `Webpack`

Use [webpack-chain](https://github.com/neutrinojs/webpack-chain) to modify the common `Webpack` build configuration for `server/client`.

Note: Most developer needs should modify `baseConfig` rather than independent `serverConfig` or `clientConfig`

For example, to add `raw-loader` for parsing `markdown` files

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

- Type: `(config: WebpackChain) => void`
- Default: [React](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-react/src/config/server.ts) [Vue](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue/src/config/server.ts) [Vue3](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue3/src/config/server.ts)
- Applicable scenarios: `Webpack`

Use [webpack-chain](https://github.com/neutrinojs/webpack-chain) to modify the common `Webpack` build configuration for `server`

## chainClientConfig🤔

- Type: `(config: WebpackChain) => void`
- Default: [React](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-react/src/config/client.ts) [Vue](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue/src/config/client.ts) [Vue3](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue3/src/config/client.ts)
- Applicable scenarios: `Webpack`

Use [webpack-chain](https://github.com/neutrinojs/webpack-chain) to modify the common `Webpack` build configuration for `client`

## whiteList🤔

- Type: `RegExp[]|string[]`
- Default: `[/\.(css|less|sass|scss)$/]`
- Applicable scenarios: `Webpack/Vite`

New feature: Supports settings in both `Vite/Webpack` modes, equivalent to `vite.ssr.noexternal`

When processing `server` side build modules, we default to using `externals` mode for all third-party modules, i.e., not processed by `Webpack` during build, directly loaded from `node_modules` at runtime. However, for some modules that only provide `esm` format, or files that cannot be directly executed in non-`Node.js` environments, such as `jsx|less|sass|css` type files, runtime errors will occur. For this type of special module, we provide whitelist configuration to set the server-side build configuration `externals` whitelist, i.e., modules that need to be processed by `Webpack`.

`whiteList` has two forms: `string[]` and `RegExp[]`, representing different meanings. Please choose according to actual needs

- `string[]`: When the value of `whiteList` is `string` instead of `RegExp`, the framework will treat it as a module name and deeply traverse the module's own dependencies and dependencies of dependencies. For example, `antd`'s own `dependencies` depend on other modules. To avoid duplicate configuration, these modules also need to be configured in the whitelist together. To reduce workload, the framework itself adds a relatively simple dependency automatic traversal collection strategy to automatically collect all modules that need to be processed. In `Serverless` deployment mode, we usually use the `string[]` form because we only install `production` environment `node_modules` in this scenario

- `RegExp[]`: Only matches dependencies that the regular expression can match. Can be used when the application has installed complete `node_modules` or when it's certain that sub-dependencies of dependencies don't need to be processed. This makes the program logic simpler and provides faster build speed.

## prefix🤔

- Type: `string|undefined`
- Default: `undefined`
- Applicable scenarios: `Webpack/Vite`

Add a unified `prefix` to frontend routes, such as `/${prefix}/`, `/${prefix}/detail/:id`. Functionally equivalent to the `basename` option provided by `React-Router` and the `base` option provided by `Vue-Router`.  
Similarly, after setting this parameter, all frontend route navigation operations will add this prefix

## proxy🤔

- Type: `object`
- Default: `{}`
- Applicable scenarios: `Webpack/Vite`

Uses [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) at the underlying layer for proxying. The framework simply passes through parameters. See `http-proxy-middleware` documentation for specific configuration

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

- Type: `boolean`
- Default: `userConfig.https ? userConfig.https : !!process.env.HTTPS`
- Applicable scenarios: `Webpack/Vite`

Whether to enable the underlying `webpack-dev-server`'s `https` mode, needs to be used synchronously with the `Node.js` `https` service on port `3000`. Setting to `true` will use the default self-signed certificate. When this certificate cannot be trusted, you can also pass certificate configuration consistent with the `Node.js` server side.

Note: It is more recommended to use [whistle](https://wproxy.org/whistle/) to start `https` proxy service during local development

```js
const fs = require("fs");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  // Can read configuration in server-side code through ssr-server-utils loadConfig api, pass to corresponding server-side framework to set certificate
  https: isProd
    ? {}
    : {
        key: fs.readFileSync("./scripts/https/https.key"),
        cert: fs.readFileSync("./scripts/https/https.crt"),
      },
};

// How to read on server side, using nest.js as example
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

- Type: `boolean`
- Default: `true`
- Applicable scenarios: `Webpack`

Whether to enable code splitting, enabled by default. Must be enabled in Vite mode

## customeHeadScript🤔

- Type: `Array<{tagName?: string, describe: object, content: string }>|(ctx: ISSRContext) => Array<{tagName?: string, describe: object, content: string }>`
- Default: `[]`
- Applicable scenarios: `Webpack/Vite`

Only used in `Vue` scenarios. The latest version supports two types, allowing different script content output based on the current request context, commonly used in dynamic [prefix](./features$faq#dynamic-route-prefix) scenarios

Used to insert custom `script` in the page header through configuration. To avoid affecting expected functionality, this content is not `escaped`. To avoid `xss`, ensure the security of inserted script code

`tagName` customizes the tag name to be created, defaults to `script` tag

`describe` field references Vue [createElement](https://cn.vuejs.org/v2/guide/render-function.html#createElement-%E5%8F%82%E6%95%B0) for setting `script` tag `attribute`

`content` is the content of the `script`

```js
module.exports = {
  customeHeadScript: [
    // Vue3 directly write attr properties
    {
      tagName: "xxx", // Default value is script
      describe: {
        type: "text/javascript",
        src: "https://res.wx.qq.com/open/js/jweixin-1.2.0.js",
      },
      content: "",
    },
    // Vue2 needs to be wrapped in attrs property, see corresponding Vue version documentation for details
    {
      describe: {
        attrs: {
          type: "text/javascript",
          src: "https://res.wx.qq.com/open/js/jweixin-1.2.0.js",
        },
      },
      content: "",
    },
    // Directly insert script content
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

- Type: `Array<{describe: object, content: string }>|(ctx: ISSRContext) => Array<{describe: object, content: string }>`
- Default: `[]`
- Applicable scenarios: `Webpack/Vite`

Only used in `Vue` scenarios, same meaning as above. Static resource files loaded at the bottom of the page. Needs to be used with `<slot name="customeFooterScript" />`. If the current `example` was created previously and `layout/index.vue` doesn't have this `slot`, you need to manually add it

## css

- Example:

```js
module.exports = {
  // Here you need to check the documentation of the loader version used by the framework
  css: () => {
    return {
      loaderOptions: {
        cssOptions: any // css-loader options see https://www.npmjs.com/package/css-loader/v/5.2.7
        less?: any // less-loader options see https://www.npmjs.com/package/less-loader/v/7.3.0
        sass?: any // sass-loader options see https://www.npmjs.com/package/sass-loader/v/10.2.0
        postcss: {
          options: Object|Function // Recommended to use object see https://www.npmjs.com/package/postcss-loader/v/4.3.0
          plugins: any[]
        }
      }}
    }
}
```

- Default: `() => {}`

- Applicable scenarios: `Webpack/Vite`

Used to add user-defined configurations for `css-loader`, `less-loader`, and `postcss-loader`. Needs to be in `function return` form

## parallelFetch🤔

- Type: `boolean`
- Default: `undefined`
- Applicable scenarios: `Webpack/Vite`

When enabled, server-side data fetching will make parallel requests to `layout fetch` and `page fetch`. If `page fetch` requests depend on the return of `layout fetch`, please do not use this option

### antd Custom Themes🤔

- Applicable scenarios: `Webpack/Vite`

Refer to the `antd` official [documentation](https://ant.design/docs/react/customize-theme-cn#%E5%AE%9A%E5%88%B6%E6%96%B9%E5%BC%8F). In the `ssr` framework, `less-loader@^7.0.0` is used by default with the following configuration. Requires `ssr` framework `version >=5.5.21`

```js
css: () => {
  return {
    loaderOptions: {
      less: {
        // Pass parameters to less-loader
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

- Type: `Object`

- Default: `{}`

- version: `>=5.5.23`

- Applicable scenarios: `Webpack/Vite`

[vue-loader](https://vue-loader.vuejs.org/options.html) options when building server-side `bundle`

## csrVueLoaderOptions🤔

- Type: `Object`

- Default: `{}`

- version: `>=5.5.23`

- Applicable scenarios: `Webpack/Vite`

[vue-loader](https://vue-loader.vuejs.org/options.html) options when building client-side `bundle`

## locale🤔

- Type: `{ enable: boolean }`

- Default: `{ enable: false }`

- Applicable scenarios: `Vue3 + Webpack`

Whether to enable `vue-i18n` internationalization plugin

## corejs🤔

- Type: `boolean`

- Default: `false`

- Applicable scenarios: `Webpack`

- Ref: https://www.babeljs.cn/docs/babel-preset-env#corejs

Usually used in conjunction with `corejsOptions` below. After enabling, we will append the following configuration in [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env#corejs). It will automatically inject corresponding `polyfill` based on the usage of current code. For specific behavior, please check the relevant instructions in `@babel/preset-env`. This option is used to be compatible with low-end browsers.

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
