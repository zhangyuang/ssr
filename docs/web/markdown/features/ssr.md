# 什么是服务端渲染

尽管我相信选择 `ssr` 框架的开发者对什么是服务端渲染已经有了一个大概的了解。在这里仍需要详细的介绍一下什么是服务端渲染。以及什么是同构的服务端渲染。

`注：本框架同时支持服务端渲染/客户端渲染两种模式，若开发者不需要使用服务端渲染模式，可随时切换渲染模式`

## 同构开发

同构开发在大前端中指的是使用相同的代码支持同时运行于服务端和客户端。区别于传统的 `JSP/ASP` 以及 `template + data` `=>` `html` + 前端 `jQuery`, 原生 `JS` 获取 `DOM` 绑定事件的服务端渲染方式我们称之为前后端异构，同构渲染指的是组件可以在服务端运行，生成 `html`，再由客户端 `Vue/React` 接管从服务端吐出的 html，使其变为由客户端 Vue/React 管理的动态 `DOM` 的生成过程。

### 演变过程

下面看一下前端的演变过程：

1. 最初的 Java、PHP 时代的纯服务端渲染时代
2. 前后端分离，即使用 JavaScript 运行在客户端，通过请求获取服务端接口数据，借助如 jQuery、Angular、React、Vue 等前端框架操作或生成页面 `DOM`，充分利用客户端资源，减少服务端压力，前后端分工明确，一直到现在仍是最常用的开发方式。
3. 同构开发，如 `Next.js`、`Nuxt.js` 等框架以及本文档介绍的 `ssr` 框架，都提供了不同的适用场景和开发方式，但目的都是为了同一套代码能同时应用于服务端和客户端。

SSR 演变过程：

1. JSP/ASP/Smarty 都算，当然 Node 渲染模板也算，Node 世界模板最为丰富

2. bigpipe，虽然很老了，但分块传输优点是非常明显的，且浏览器友好。fb和微博，qunar都是受益者。Node天然支持，res.write 很友好

3. 基于组件写法的SSR，比如 `React SSR`, `Vue SSR`。时代变了，`SSR`也要跟上。`vdom + hydrate` 可以非常舒适的结合

4. 真正的同构，即 CSR 和 SSR 写法一致，未来不再区分概念，在 `serverless` 里，api和渲染都是函数。

近几年前端技术的变化可谓翻天覆地，在选择技术栈之前应该看清自己的应用场景，没有最好的框架，只有最适合应用场景的框架，同构开发方式也不例外，下面介绍一下使用同构开发的优点和需要注意的问题：

### 同构开发的需要考量的点

前后端同构的服务端渲染对前端开发者的心智要求更高。开发者不能够再以传统的 `spa` 应用的开发思想来开发服务端渲染应用。但是无论你是否使用服务端渲染，知道它们之间的差异能够帮助你变的更加专业。不要让自己仅仅是一个页面工程师

- 代码或框架层面需要兼容 server/client 的 runtime

比较直接的一个就是 `fetch` 数据操作，如果服务端数据源有 `rpc` 协议或请求的服务存在环境/网络隔离，此时运行在客户端就获取不到数据，`需要把 rpc 或存在环境/网络隔离的请求封装成通用的 http 接口`，或者一些前端使用的库无法在后端运行，这些问题需要都进行特殊处理。

- 更复杂的部署和打包构建

部署和打包构建过程加倍，简单的理解就是单独的 server 和单独的 client 的工作总和。但是这个问题在 `ssr` 框架中已基本抹平，对开发者暴露的配置更加简单、可定制程度更高，同时提供了一键打包和构建发布命令。

- 增加服务端负载

这个“缺点”严格上是传统 SSR 的通病，但使用同构开发方式后完全可以变成了一个可优化的点。在使用同构方式时，可以针对服务端资源负载做监控，如果遇到有服务端负载过大或高峰时段，可以将渲染方式无缝切换成 CSR，待服务端负载正常或流量回落时再切换为 SSR。

### 同构开发的优点

- 服务端和客户端共用代码

- 更快的页面内容到达时间

- 更友好的 SEO

- 更优雅的降级方式，更健壮的应用

以上优点集成了 SSR 和 CSR 两种渲染方式的优点。开发者在选择该解决方案时还是要考虑清楚是否一定需要使用这种方式，并权衡此解决方案的优缺点。评估 SEO 和内容到达时间是否对应用至关重要。
