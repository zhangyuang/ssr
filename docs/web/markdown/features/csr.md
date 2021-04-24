# 渲染降级
 框架支持渲染降级，服务端渲染可以一键降级为客户端渲染

## 服务端和客户端渲染

 ### 区别

` 客户端渲染（client-side Renderingende)`, HTML 仅仅作为静态文件，客户端在请求时，服务端不做任何处理，直接以原文件的形式返回给客户端客户端，然后根据 HTML 上的 JavaScript，生成 DOM 插入 HTML

 `服务端渲染（Server-Side Rendering`）,在浏览器请求页面URL的时候，服务端将我们需要的 HTML 文本组装好，并返回给浏览器，这个 HTML 文本被浏览器解析之后，不需要经过 JavaScript 脚本的执行，即可直接构建出希望的 DOM 树并展示到页面中。

 客户端渲染和服务器端渲染的最重要的区别就是究竟是谁来完成 HTML 文件的完整拼接，如果是在服务器端完成的，然后返回给客户端，就是服务器端渲染，而如果是前端做了更多的工作完成了 HTML 的拼接，则就是客户端渲染。

![](/images/ssr&csr.png)


> 注: 本框架的渲染方式获取数据的方式不同，具体可查看 [服务端渲染](/docs/features$fetch#%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E6%A8%A1%E5%BC%8F) 和 [客户端渲染](docs/features$fetch#客户端渲染模式)

 ### 服务端渲染优势
  - **利于SEO** 

  其实就是有利于爬虫来爬你的页面，然后在别人使用搜索引擎搜索相关的内容时，你的网页排行能靠得更前，这样你的流量就有越高

  - **白屏时间更短**

  相对于客户端渲染，服务端渲染在浏览器请求 URL 之后已经得到了一个带有数据的 HTML 文本，浏览器只需要解析 HTML，直接构建 DOM 树就可以。而客户端渲染，需要先得到一个空的 HTML 页面，这个时候页面已经进入白屏，之后还需要经过加载并执行 JavaScript、请求后端服务器获取数据、JavaScript 渲染页面几个过程才可以看到最后的页面。特别是在复杂应用中，由于需要加载 JavaScript 脚本，越是复杂的应用，需要加载的 JavaScript 脚本就越多、越大，这会导致应用的首屏加载时间非常长，进而降低了体验感。

- **无需占用客户端资源**
即解析模板的工作完全交由后端来做，客户端只要解析标准的 HTML 页面即可，这样对于客户端的资源占用更少，尤其是移动端，也可以更省电


### 客户端渲染优势
- **前后端分离**
前端专注于前端UI，后端专注于 Api 开发，且前端有更多的选择性，而不需要遵循后端特定的模板
- **体验更好**
比如，我们将网站做成SPA或者部分内容做成SPA，这样，尤其是移动端，可以使体验更接近于原生app


## 启用渲染降级

### URL 添加 query 参数
 框架启动的时候默认使用服务端渲染方式，如果想要启用渲染降级，只需要在请求 URL 后面添加 query 参数`?csr=1`或者`?csr=true`；举个栗子， [http://ssr-fc.com](http://ssr-fc.com/) 网站默认启用了服务端渲染,可以明显感受到页面秒开，没有白屏等待时间，而添加参数后 [http://ssr-fc.com?csr=true](http://ssr-fc.com?csr=true)，也就是启动客户端渲染之后再打开网站，可以明显感受到有一定的白屏时间，具体表现为有一个页面闪烁的过程

### config.js 配置
 服务发布的时候支持两种模式，默认是`mode: 'ssr'`模式，你也可以通过 config.js 中的 `mode: 'csr'` 将csr设置默认渲染模式。

### 通过 core 模块提供的 render 方法降级
[ssr-core-react](https://github.com/ykfe/ssr/blob/dev/packages/core-react/src/render.ts) 和 [ssr-core-vue](https://github.com/ykfe/ssr/blob/dev/packages/core-vue3/src/index.ts) (vue3)模块均支持该方式
在应用执行出错 `catch` 到 `error` 的时候降级为客户端渲染。也可根据具体的业务逻辑，在适当的时候通过该方式降级 `csr` 模式

下面可以看到 `ssr-core-react` 模块的例子

```
import { render } from 'ssr-core-react'

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
当 `server`出现问题的时候，这样的容灾做法是比较好的。更好的做法是网关层面，配置容灾，将请求打到 `cdn` 上。

