# Local Development

In the `ssr` framework, regardless of which plugins you use for combination, our local development commands are consistent, which is the `ssr start` command. This article will explain what actually happens after executing the `ssr start` command.

## Starting the Service

```shell
$ npm init ssr-app my-ssr-project --template=midway-vue3-ssr # You can choose any of the above templates here
$ cd my-ssr-project && npm i # You can use yarn, don't use cnpm
$ npm start # Start the service, equivalent to npx ssr start
$ open http://localhost:3000
```

After executing the `ssr start` command, we will start the default listening port `3000` to provide external services.

## ssr start

Since our design is based on a plugin architecture, when executing the `ssr start` command, we essentially call the `start` methods exposed by server-side plugins and client-side plugins in sequence to start local Node.js Server services respectively. The service providers here can be `Midway.js`, `Nest.js`, or other server-side plugins developed by developers. As well as the build hosting of frontend static resource files and `HMR` capabilities provided by client-side plugins. For more detailed understanding of this part, you can read the [Plugin Mechanism](./features$plugin) chapter.

## Request Flow

Each of our `http` requests will first go through a `server` layer, and then decide whether this request returns `json` data, `html` pages, or frontend static resources based on specific logic. In our scenario, the `server` layer is the service provided by the Node.js framework. The request flow for a server-side rendered page is as follows.

```js
import { render } from 'ssr-core'

@Get('/')
@Get('/detail/:id')
async handler (): Promise<void> {
  try {
    this.ctx.apiService = this.apiService
    this.ctx.apiDeatilservice = this.apiDeatilservice
    const stream = await render<Readable>(this.ctx, {
      stream: true
    })
    this.ctx.body = stream
  } catch (error) {
    console.log(error)
    this.ctx.body = error
  }
}
```

当我们访问 `http://localhost:3000` 或者 `http://localhost:3000/detail/xxx` 时，请求会首先经过我们在 [Controller](https://github.com/zhangyuang/ssr/blob/dev/example/midway-vue3-ssr/src/controller/index.ts) 中注册的路由。并且交由对应的函数进行处理。

示例函数的处理逻辑，调用了 `ssr-core-xxx` 模块提供的 `render` 方法，来渲染当前请求所对应的前端组件。并且将返回的结果是一个包含 `html`, `meta` 标签的完整 `html` 文档结构。我们提供 `string`, `stream` 两种格式的 `response` 类型给开发者使用。返回的文档结构中已经包含了 `script` 标签加载客户端资源的相关代码

### 服务端路由 VS 前端路由

大多数初入门的开发者，甚至一些工作多年的开发同学并不能弄清楚服务端路由与前端路由的区别。

前端路由是目前很流行的一些前端框架提供的一些能力。例如 [vue-router](https://router.vuejs.org/zh/installation.html), [react-router](https://github.com/ReactTraining/react-router) 等。一般都会提供 `hash`, `history` 两种路由模式。大部分开发者都会选择 `history` 模式，这样会让你的 `url` 看起来非常舒服例如 `http://yoursite.com/user/id`。

但是要弄清楚，前端路由只是假的路由！在实际的服务器资源上，并没有对应的真实资源存在。这也就是经典的问题，为什么前端 SPA 应用部署后，刷新访问会 404。因为每一个请求会首先经过服务端 `Server` 的逻辑分发再来决定这个请求的具体行为。在本地开发时之所以不会 404，是因为这些框架本地提供的小型 Node.js Server 添加了重定向到 `index.html` 的[逻辑](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)。

如果在本框架中你出现了刷新 404 的问题，很明显你只写了前端路由没有服务端路由对应。解决方式: `controller` 中添加对应的服务端路由解析规则

```js
// controller/xxx.ts
@Get('/')
@Get('/detail/:id')
async handler (): Promise<void> {
  try {
    this.ctx.apiService = this.apiService
    this.ctx.apiDeatilservice = this.apiDeatilservice
    const stream = await render<Readable>(this.ctx, {
      stream: true
    })
    this.ctx.body = stream
  } catch (error) {
    console.log(error)
    this.ctx.body = error
  }
}
```

### 双端路由对应

了解完服务端路由与前端路由的区别之后，在 SSR 服务端渲染应用中我们是怎么将它们关联起来的呢

上面提到了。`core` 模块提供的 `render` 方法，会根据当前请求去渲染对应的页面级组件。这里我们会渲染与服务端请求 `path` 一致的前端路由 `path` 对应的组件。

例如当前我们请求的 `ctx.req.path` 为 `/` 即根路由。根据这个 `path` 我们找到前端 `parse` 出的路由结构中 `/` 对应的前端组件为 `web/page/index/render.vue`。就代表当前的请求需要渲染该组件。

同理，当我们访问的链接为 `http://ssr-fc.com/detail/cbba934b14f747049187`, 此时 `ctx.req.path` 为 `/detail/cbba934b14f747049187` 是一个动态路由即 `/detail/:id`。根据这个 `path` 我们找到前端 `parse` 出的路由结构中 `/detail/:id` 对应的前端组件为 `web/page/detail/render$id.vue`。就代表当前的请求需要渲染该组件。

至此我们从一个 `http` 请求的发送，到服务端支出完整 `html` 结构的过程就了解了

## 客户端激活

通过服务端返回出来的完整 `html` 结构交由浏览器渲染后只是一个“死”的页面，并不包含 DOM 事件的绑定。所以我们还需要加载客户端的静态资源文件来调用各框架提供的 [hydrate](https://zh-hans.reactjs.org/docs/react-dom.html#hydrate) 操作来激活 DOM。

在本地开发时，我们会使用 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 这个非常成熟的模块。来编译以及托管前端静态资源代码到内存中。使其具备快速加载以及 `HMR` 能力。由于 `webpack-dev-server` 自带了一个小型的 `express` 服务。所以这里底层我们使用它去监听了 `8999` 端口。

也就是说我们的前端静态资源文件实际是托管在 `8999` 端口的服务之下的。但这一切对于使用者来说是无感知的，因为我们在本地开发时会做一个 `proxy` 的操作，来将 `3000` 端口的下列 `path` 的请求给代理到 `8999` 端口

```js
const proxyPathMap = {
  "/static": remoteStaticServerOptions,
  "/sockjs-node": remoteStaticServerOptions,
  "/*.hot-update.js(on)?": remoteStaticServerOptions,
  "/__webpack_dev_server__": remoteStaticServerOptions,
  "/asset-manifest": remoteStaticServerOptions,
};
```

也就是说，在实际的页面当中，我们加载的是 `http://127.0.0.1:3000/static/js/Page.chunk.js` 其实在底层会自动 `proxy` 到 `http://127.0.0.1:8999/static/js/Page.chunk.js`

![](https://res.wx.qq.com/op_res/NwnohVbzIg_ko9mFMQ6_JGbXlHbTeVmDcrYihLC8hi0_CEOMH67s4DCGx8vQuSah0gnZaZOyDy7zKI9ODg4cbA)
