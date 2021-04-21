# 本地开发

在 `ssr` 框架中无论你是使用哪些插件进行组合，我们的本地开发命令都是一致的，即 `ssr start` 命令。本篇文章将会讲述执行 `ssr start` 命令后到底发生了什么

## 启动服务

```bash
$ npm init ssr-app my-ssr-project --template=midway-vue3-ssr # 这里可以选择上述任意模版
$ cd my-ssr-project && npm i
$ npm start # 启动服务，等价于 npx ssr start
$ open http://localhost:3000
```

执行 `ssr start` 命令后我们将会启动默认监听的 `3000` 端口来提供对外的服务

## ssr start

由于我们的设计是基于插件架构的，在执行 `ssr start` 命令时，其实我们本质是依次调用了服务端插件和客户端插件暴露的 `start` 方法，来分别启动本地 Node.js Server 服务，这里的服务提供者可以是 `Midway.js`, `Nest.js` 或者开发者另外开发的其他服务端插件。以及客户端插件提供的前端静态资源文件的构建托管以及 `HMR` 能力。关于这部分内容更加详细的了解可以阅读[插件机制](./features$plugin)章节。

## 请求链路

我们的每一个 `http` 请求都会先经过一个 `server` 层，再根据具体的逻辑来决定这个请求到底是返回 `json` 数据，还是 `html` 页面，还是前端静态资源。在我们这个场景，`server` 层就是 Node.js 框架提供的服务。一个服务端渲染页面的请求链路如下。

```js
import { render } from 'ssr-core-vue3'

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

当我们访问 `http://localhost:3000` 或者 `http://localhost:3000/detail/xxx` 时，请求会首先经过我们在 [Controller](https://github.com/ykfe/ssr/blob/dev/example/midway-vue3-ssr/src/controller/index.ts) 中注册的路由。并且交由对应的函数进行处理。

示例函数的处理逻辑，调用了 `ssr-core-xxx` 模块提供的 `render` 方法，来渲染当前请求所对应的前端组件。并且将返回的结果是一个包含 `html`, `meta` 标签的完整 `html` 文档结构。我们提供 `string`, `stream` 两种格式的 `response` 类型给开发者使用。返回的文档结构中已经包含了 `script` 标签加载客户端资源的相关代码

### 服务端路由 VS 前端路由

大多数初入门的开发者，甚至一些工作多年的开发同学并不能弄清楚服务端路由与前端路由的区别。

前端路由是目前很流行的一些前端框架提供的一些能力。例如 [vue-router](https://router.vuejs.org/zh/installation.html), [react-router](https://github.com/ReactTraining/react-router) 等。一般都会提供 `hash`, `history` 两种路由模式。大部分开发者都会选择 `history` 模式，这样会让你的 `url` 看起来非常舒服例如 `http://yoursite.com/user/id`。


但是要弄清楚，前端路由只是假的路由！在实际的服务器资源上，并没有对应的真实资源存在。这也就是经典的问题，为什么前端 SPA 应用部署后，刷新访问会 404。因为每一个请求会首先经过服务端 `Server` 的逻辑分发再来决定这个请求的具体行为。在本地开发时之所以不会 404，是因为这些框架本地提供的小型 Node.js Server 添加了重定向到 `index.html` 的[逻辑](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)。

### 双端路由对应

了解完服务端路由与前端路由的区别之后，在 SSR 服务端渲染应用中我们是怎么将它们关联起来的呢

上面提到了。`core` 模块提供的 `render` 方法，会根据当前请求去渲染对应的页面级组件。这里我们会渲染与服务端请求 `path` 一致的前端路由 `path` 对应的组件。

例如当前我们请求的 `ctx.req.path` 为 `/` 即根路由。根据这个 `path` 我们找到前端 `parse` 出的路由结构中 `/` 对应的前端组件为 `web/page/index/render.vue`。就代表当前的请求需要渲染该组件。

同理，当我们访问的链接为 `http://ssr-fc.com/detail/cbba934b14f747049187`, 此时 `ctx.req.path` 为 `/detail/cbba934b14f747049187` 是一个动态路由即 `/detail/:id`。根据这个 `path` 我们找到前端 `parse` 出的路由结构中 `/detail/:id` 对应的前端组件为 `web/page/detail/render$id.vue`。就代表当前的请求需要渲染该组件。

至此我们从一个 `http` 请求的发送，到服务端支出完整 `html` 结构的过程就了解了

## 客户端激活

通过服务端返回出来的完整 `html` 结构交由浏览器渲染后只是一个“死”的页面，并不包含 DOM 事件的绑定。所以我们还需要加载客户端的静态资源文件来调用各框架提供的 [hydrate](https://zh-hans.reactjs.org/docs/react-dom.html#hydrate) 操作来激活 DOM。

在本地开发时，我们会使用 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 这个非常成熟的模块。来编译以及托管前端静态资源代码到内存中。使其具备快速加载以及 `HMR` 能力。由于 `webpack-dev-server` 自带了一个小型的 `express` 服务。所以这里底层我们使用它去监听了 `8000` 端口。

也就是说我们的前端静态资源文件实际是托管在 `8000` 端口的服务之下的。但这一切对于使用者来说是无感知的，因为我们在本地开发时会做一个 `proxy` 的操作，来将 `3000` 端口的下列 `path` 的请求给代理到 `8000` 端口

```js
const proxyPathMap = {
  '/static': remoteStaticServerOptions,
  '/sockjs-node': remoteStaticServerOptions,
  '/*.hot-update.js(on)?': remoteStaticServerOptions,
  '/__webpack_dev_server__': remoteStaticServerOptions,
  '/asset-manifest': remoteStaticServerOptions
}
```

也就是说，在实际的页面当中，我们加载的是 `http://127.0.0.1:3000/static/js/Page.chunk.js` 其实在底层会自动 `proxy` 到 `http://127.0.0.1:8000/static/js/Page.chunk.js`

![](https://res.wx.qq.com/op_res/NwnohVbzIg_ko9mFMQ6_JGbXlHbTeVmDcrYihLC8hi0_CEOMH67s4DCGx8vQuSah0gnZaZOyDy7zKI9ODg4cbA)