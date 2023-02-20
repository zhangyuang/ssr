# 渲染降级
 
相比于其他框架的功能。本框架还额外具备一键从 `服务端渲染` 降级为 `客户端渲染` 的功能
## 服务端和客户端渲染

下面让我们来看看  `服务端渲染` 和 `客户端渲染` 有什么区别

### 区别

`客户端渲染（client-side Renderingende)`, `HTML` 仅仅作为静态估价，客户端在请求时，服务端不做任何处理，直接以原文件的形式返回给客户端客户端，然后根据 `HTML` 上的 `JavaScript`，生成 `DOM` 插入 HTML

 `服务端渲染（Server-Side Rendering`）,在浏览器请求页面URL的时候，服务端将我们需要的 `HTML` 文本组装好，并返回给浏览器，这个 `HTML` 文本被浏览器解析之后，不需要经过 `JavaScript` 脚本的执行，即可直接构建出希望的 DOM 树并展示到页面中。

客户端渲染和服务器端渲染的最重要的区别就是究竟是谁来完成 `HTML` 文件的完整拼接，如果是在服务器端完成的，然后返回给客户端，就是服务器端渲染，而如果是客户端端做了更多的工作完成了 `HTML` 的拼接，则就是客户端渲染。

![](/images/ssr&csr.png)

> 注: 在不同的多渲染模式下本框架的渲染方式获取数据的时机不同，具体可查看 [数据获取](./docs/features$fetch)

### 服务端渲染优势

- SEO

有利于爬虫来爬你的页面，然后在搜索引擎搜索相关的内容时，你的网页排行能靠得更前，这样你的流量就有越高

- 白屏时间更短

相对于客户端渲染，服务端渲染在浏览器请求 URL 之后已经得到了一个带有数据的 HTML 文本，浏览器只需要解析 HTML，直接构建 DOM 树就可以。而客户端渲染，需要先得到一个空的 HTML 页面，这个时候页面已经进入白屏，之后还需要经过加载并执行 JavaScript、请求后端服务器获取数据、JavaScript 渲染页面几个过程才可以看到最后的页面。特别是在复杂应用中，由于需要加载 JavaScript 脚本，越是复杂的应用，需要加载的 JavaScript 脚本就越多、越大，这会导致应用的首屏加载时间非常长，进而降低了体验感。

### 客户端渲染优势

- 更少的服务器负载

由于服务端只需要返回最简单的页面骨架，故服务端的压力会更小，可以承担更多的 `QPS`

- 更少的心智负担

编写一个成熟的服务端渲染应用对开发者的心智要求以及能力要求无疑是更高的

## 如何降级为客户端渲染

在 `ssr` 框架中我们提供了多种降级到客户端渲染的方案
### URL Query 参数

框架启动的时候默认使用服务端渲染方式，如果想要启用渲染降级，只需要在请求 `URL` 后面添加 `query` 参数 `?csr=xxx` 
 
举个栗子， [http://ssr-fc.com](http://ssr-fc.com/) 网站默认启用了服务端渲染,可以明显感受到页面秒开，没有白屏等待时间，而添加参数后 [http://ssr-fc.com?csr=true](http://ssr-fc.com?csr=true)，也就是启动客户端渲染之后再打开网站，可以明显感受到有一定的白屏时间，具体表现为有一个页面闪烁的过程。

此方案适用于开发者本地进行测试

### config.js 配置

服务发布的时候支持两种模式，默认是 `mode: 'ssr'` 模式，你也可以通过 [应用配置](./api$config#mode) 中的 `mode: 'csr'` 将 `csr` 设置默认渲染模式。

### 通过 core 模块提供的 render 方法降级

[ssr-core-react](https://github.com/zhangyuang/ssr/blob/dev/packages/core-react/src/render.ts) 和 [ssr-core-vue](https://github.com/zhangyuang/ssr/blob/dev/packages/core-vue3/src/index.ts) (vue3)模块均支持该方式

在应用执行出错 `catch` 到 `error` 的时候降级为客户端渲染。也可根据具体的业务逻辑，由开发者自行决定在适当的时候通过该方式降级 `csr` 模式。也可以通过接入发布订阅机制，通过发布平台来实时设置当前的渲染模式。

下面可以看到 `ssr-core-react` 模块的例子，如果你有更好的写法欢迎向我们反馈。

#### 处理 字符串 返回形式的降级

字符串的降级处理很简单，我们只需要 `try catch` 到错误后，直接修改渲染模式拿到新的结果即可。因为此时组件的渲染是在 `render` 方法被调用时就被渲染执行了

```js
import { render } from 'ssr-core'

try {
  const htmlStr = await render(this.ctx)
  return htmlStr
} catch (error) {
  const htmlStr = await render(this.ctx, {
    mode: 'csr'
  })
  return htmlStr
}
```

当 `server` 出现问题的时候，这样的容灾做法是比较好的。更好的做法是网关层面，配置容灾，将请求打到 `cdn` 上。


#### 处理 流 返回形式的降级

流返回形式的降级处理略麻烦。在 `Nest.js` 或者 `express` 系的框架中我们可以用以下写法进行降级。

这里又额外分为 `Vue3` 与非 `Vue3` 的情况。

在 `Vue3` 的 `renderToNodeStream` 方法中，当渲染出错时会同步的将错误抛出。开发者可以在上层直接使用 `try catch` 捕获

```js
 try {
    const stream = await render<Readable>(ctx, {
      stream: true
    })
    stream.pipe(res, { end: false })
    stream.on('end', () => {
      res.end()
    })
  } catch (error) {
    const stream = await render<Readable>(ctx, {
      stream: true,
      mode: 'csr'
    })
    stream.pipe(res, { end: false })
    stream.on('end', () => {
      res.end()
    })
  }

```

在 `Vue2/React` 中，它们会在底层通过 `stream.emit` 来触发 `error`, 这种情况需要开发者手动监听事件

```js
const stream = await render<Readable>(ctx, {
  stream: true
})
stream.pipe(res, { end: false })
stream.on('error', async () => {
  stream.destroy() // 销毁旧的错误流
  const newStream = await render<Readable>(ctx, {
    stream: true,
    mode: 'csr'
  })
  newStream.pipe(res, { end: false })
  newStream.on('end', () => {
    res.end()
  })
})
stream.on('end', () => {
  res.end()
})
```

在 `Midway.js/Koa` 系框架中采用如下写法

```js
const stream = await render<Readable>(this.ctx, {
  stream: true,
  mode: 'ssr'
})
stream.on('error', async () => {
  stream.destroy()
  const newStream = await render<string>(ctx, {
    stream: false, // 这里只能用 string 形式来渲染 koa 无法二次赋值 stream 给 body
    mode: 'csr'
  })
  this.ctx.res.end(newStream)
})
this.ctx.body = stream
```

## 实现机制

在 `ssr` 框架中实现渲染降级这个功能的原理是十分简单的。如果你已经使用本框架进行了项目开发，那么你应该会发现我们没有传统的 `index.html` 文件，也没有任何模版引擎。我们的 `html` 页面布局完全是通过 `JSX` 或是 `Vue SFC` 来渲染出来的。

在看完上述的 `服务端渲染` 应用和 `客户端渲染` 应用的区别后，我们可以发现在降级为客户端渲染后，我们无需在服务端渲染页面组件以及数据的获取。而仅仅渲染一个空的 `html` 骨架即可。`React` 场景通过代码来表示如下

```js
const layoutFetchData = (!isCsr && layoutFetch) ? await layoutFetch(ctx) : null
const fetchData = (!isCsr && routeItem.fetch) ? await routeItem.fetch(ctx) : null

return (
  <Layout ctx={ctx} config={config} staticList={staticList} viteReactScript={viteReactScript}>
    {isCsr ? <></> : <Component />}
  </Layout>
)
```

可以非常轻易的看出实现原理。同样在 `Vue` 场景我们通过 `slot` 实现了类似的功能

## 注意事项(必看)

出现错误时进行降级，这里的错误我们归类为两种 `实际运行时错误`, `资源加载时错误`

### 错误分类

对于 `实际运行时错误` 错误，常发生于具体的生命周期执行时，或者是组件 `render` 时，对于这种错误，我们可以通过框架提供的降级能力来避免。

而对于 `资源加载时错误` 错误，也就是我们写在文件顶层的代码，例如我们在组件顶层 `import` 的文件中绑定了浏览器对象，那么无论我们是哪种渲染模式这种错误都将出现。因为我们在初始化路由结构的时候就会将组件 `import` 的逻辑执行一遍。对于这种错误只能手动编写代码来兼容解决。参考[文档](http://doc.ssr-fc.com/docs/features$faq#%E5%A6%82%E4%BD%95%E8%A7%A3%E5%86%B3%E6%9C%8D%E5%8A%A1%E7%AB%AF%E8%AE%BF%E9%97%AE%E4%B8%8D%E5%8F%AF%E8%AE%BF%E9%97%AE%E7%9A%84%E5%AF%B9%E8%B1%A1%E7%9A%84%E9%97%AE%E9%A2%98)

### 组件分类

在本框架中渲染降级在大部分场景下是针对 `pages` 类型的具体页面组件而言的。而对于 `layout` 组件以及 `App` 组件。无论是哪种渲染模式都会进行渲染。所以我们建议在这两种组件中不要进行与业务逻辑相关的代码编写，尽量存放 `no logic` 类型的代码。

### 当心 xss

通过前端框架来渲染 `html` 标签并不是这些框架所推荐的。我们可以看到代码中使用了诸如 `dangerouslySetInnerHTML` 这样的写法，来提醒我们不要这么做。因为这样很容易被恶意脚本注入导致 [xss](https://developer.mozilla.org/zh-CN/docs/Glossary/Cross-site_scripting)。所以我们必须严格把控这一部分的渲染内容，绝不能出现用户可以控制的部分。

在注入页面数据时，我们会使用 [serialize-javascript](https://www.npmjs.com/package/serialize-javascript) 来将 `window.__INITIAL_DATA__` 序列化。但是在 `html` 头部的其他部分内容注入，特别是 `script` 标签相关内容需要开发者密切注意。

## 如何使用独立 html 文件部署

此功能几乎不会用到。除非开发者的部署环境不存在 Node.js 服务或者需要对核心应用做容灾 CDN 降级时才可能需要用到。

此功能我们将会生成一个 `html` 文件用于直接部署。效果跟传统 `SPA` 应用一样。若开发者一开始就打算使用 `html` 的形式部署。不建议使用本框架，请使用 `vue-cli`, `create-react-app` 等脚手架。

### 使用方式

需要依赖版本 `>=5.5.62`

```shell
$ npx ssr build --html
```

构建后我们将会生成 `build/index.html` 文件可直接用于部署。但选择此方案便意味着

- 无法使用服务端渲染功能
- 无法直接使用当前应用的 Node.js 编写的接口服务