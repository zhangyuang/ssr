# FAQ

## 如何解决服务端访问不可访问的对象的问题

SSR是近几年才火热的话题，如果是新的项目且开发人员对SSR有较深的认知，那么在设计应用的过程中就会有意识的去避免在服务端访问客户端对象的情况。但在老项目或者老的第三方库/框架，或者是开发人员对SSR理解不深刻的情况下，会出现很多类似 `window is not defined` 的错误。  
先说前言，个人是不推荐用 `jsdom` 来在服务端模拟客户端环境，这样最多只能模拟最外层的对象例如 `window document` 但如果要访问更深层次的对象例如 `document.getElementById` 则还是会报错。且这种方式新增了一堆很dirty的代码且不利于debug容易造成未知的问题。  
自己的代码我们可以控制，那么如果有第三方模块犯了这种问题应该如何解决呢。在有能力给第三方模块提PR的时候还是建议以PR的形式进行修复。例如 `axios` 就会根据你当前的环境来决定到底是用xhr对象还是用http模块来发起请求。如果没办法改动第三方模块，我们可以在代码中延迟加载这些模块，让它在客户端执行的时候被调用。  

1. 使用本应用提供的 `__isBrowser__` 常量来判断，例如引入jquery可以使用以下引入方式
   
```js
import $ from 'jquery' // error
const $ = __isBrowser__ ? require('jquery') : {} // true
```

2. 在 `didMount` 生命周期加载模块

```js
class Page {
    this.state = {
        $: {}
    }
    componentDidMount () {
        this.setState({
            $: require('jquery')
        })
    }
}
```

3. 如果某个组件调用的库一定要使用浏览器对象才能得到结果，那么只能将该组件放到客户端进行render了，参考[onlyCsr](./faq.md#如何让某一个组件只在客户端进行渲染)

<span style="color: red">注: 不要想着在服务端去访问客户端对象，这意味着你 or 开发第三方模块的人对React SSR的理解不够, 虽然这一开始会导致一定的错误，但对于你去理解SSR的执行机制以及分清楚Server/Client两端的区别帮助很大</span>

## 开发过程中报content not match的错误如何解决

这种问题原因是你在服务端与客户端渲染了不同的DOM结果。这里我们分两种情况  
1. 你的代码写的有问题导致了出现服务端与客户端渲染结果不一致的差异，这种情况找到问题并解决就行了  
2. 你确实没办法保证服务端的结果与客户端渲染的结果一致，比如客户端渲染结果调用了document对象或者location对象，服务端无法获取。

这里我们讲一下情况2要怎么解决。举个例子，这里我们需要获取到location.href,这里我们虽然也能通过ctx.req.url来获取，但是如果是某个属性无法获取的情况要怎么处理呢

```js
<div>{location.href}</div>
```

```js
class Page {
    constructor () {
        this.state = {
            text: 'Error Content'
        }
    }

    componentDidMount () {
        this.setState({
            text: location.href
        })
    }

    render () {
        return (
            <div>{this.state.text}</div>
        )
    }
}
```

解决方式: 通过读取state的方式，在didmount中更新state，来触发组件的重新render，缺点是会让客户端再调用一次render方法

## 如何让某一个组件只在客户端进行渲染

使用ykfe-utils提供的高阶组件OnlyCsr

```js
import { onlyCsr } from 'ykfe-utils'

export default onlyCsr(Page)
```

## 如何引入antd

建议直接使用官方写好的example[ssr-with-antd](https://github.com/ykfe/egg-react-ssr/tree/dev/example/ssr-with-antd), 详细原理查看[PR](https://github.com/ykfe/egg-react-ssr/pull/32)

## 刷新8000端口为什么会导致404

8000端口启动的是CSR(客户端渲染)应用，并且此时我们使用的是history路由模式，这里我们首先要明白前端路由和后端路由有什么区别

- 前端路由，一般分为hash路由和history路由两种模式，分别是使用url hash值和html5 history api来实现前端修改url地址来局部更新页面
- 后端路由，是当前应用真实存在的访问路径，在请求到来时根据path去匹配对应的路由来做一些应用操作

形如`http://localhost:8000/user/:id`这种路由，在没有后端路由支持的情况下，服务端并不存在与之对应的资源，刷新后相当于去服务器访问该资源自然会404。
解决方式请查看: [HTML5 History 模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html)

<span style="color:red">已针对该情况做本地开发时的优化</span> by this [PR](https://github.com/ykfe/egg-react-ssr/pull/79)

## 如何切换渲染模式

分别介绍在本地开发和生产环境如何切换渲染模式

### 本地开发

由于本地开发时修改config，egg进程会自动重启，故只需要修改`config.type=csr`即可  

### 生产环境

生产环境，config修改并不能自动重启进程，我们建议采用以下做法。访问应用时先通过配置平台获取到最新的config配置覆盖默认配置，可采用http接口的形式或者metaq这种工具来做发布订阅

```js
  async index () {
    const { ctx } = this
    try {
      // Page为webpack打包的chunkName，项目默认的entry为Page
      ctx.type = 'text/html'
      ctx.status = 200
      let config = ctx.app.config
      if (ctx.app.config.env !== 'local') {
          const extraConfig = await http.get('xxx') // 通过接口拿到实时的config,覆盖默认配置
          config = Object.assign(config, extraConfig)
      }
      const stream = await renderToStream(ctx, config)
      ctx.body = stream
    } catch (error) {
      ctx.logger.error(`Page Controller renderToStream Error Error`, error)
    }
  }
```

## 找不到ykcli命令怎么办

首先, 科普一下当我们在命令行输入一个命令的时候，系统到底干了什么能让我们可以执行该命令。这一部分属于*nix系统的基础知识，必须要掌握。

### 环境变量

操作系统中存在叫做环境变量的东西，一般会有一些默认的环境变量存在，当我们用软件或者命令安装一些工具时，它也有可能根据实际需要来将自己的执行路径添加到环境变量中。我们知道`bin`这个文件夹一般是放可执行文件的。请看下图。

![](https://gw.alicdn.com/tfs/TB1Ze6thUY1gK0jSZFCXXcwqXXa-1190-556.jpg)

首先通过 `echo` 命令来输出我们系统当前的环境变量，在*nix系统下，环境变量以`:`进行分隔，可以看到都是某个目录下的`bin`文件夹。环境变量的作用是，当我们输入一个命令时，它会去环境变量中的路径依次检索该命令。那么我们再看看`ykcli`的执行路径在哪，可以看到是在我们Node.js的安装目录中，而这个目录在我们的环境变量当中，那么我们可以知道，当我们使用`npm`全局安装一个模块时，会自动将该模块的`bin`目录软连接到Node.js的安装目录中。

### 排查方式

- 排查ykcli是否安装成功
- 排查Node.js安装目录下的bin目录是否存在于环境变量当中
- 排查ykcli的bin文件夹是否同步到Node.js安装目录下的bin目录当中