# 性能优化

## 分析工具0x

这里我们首先来介绍一款开源的Node.js性能分析工具[0x](https://github.com/davidmarkclements/0x)， 借助它可以以火焰图的形式发现你代码中的性能瓶颈。 

### 使用方式

首先我们来模拟一个性能差的应用， 在getInitalProps方法中， 加入长循环。 

```js
Page.getInitialProps = (ctx) => {
    for (let i = 0; i < 1000000; i++) {
        console.log('xx')
    }
    return Promise.resolve({
        news: [{
                id: '1',
                title: 'Racket v7.3 Release Notes'
            },
            {
                id: '2',
                title: 'Free Dropbox Accounts Now Only Sync to Three Devices'
            },
            {
                id: '3',
                title: 'Voynich Manuscript Decoded by Bristol Academic'
            },
            {
                id: '4',
                title: 'Burger King to Deliver Whoppers to LA Drivers Stuck in Traffic'
            },
            {
                id: '5',
                title: 'How much do YouTube celebrities charge to advertise your product? '
            }
        ]
    })
}
```

接着我们写一个可以直接启动我们应用的脚本文件， 不需要通过egg-bin的方式来启动

```js
const Application = require('egg-core').EggCore
const Router = require('koa-router')
const {
    renderToStream
} = require('ykfe-utils')
const router = new Router()
const config = require('./config/config.default')
const app = new Application({
    framework: false
})
router.get('/', async (ctx) => {
    ctx.type = 'text/html'
    ctx.status = 200
    const stream = await renderToStream(ctx, 'Page', config)
    ctx.body = stream
})
app.use(router.routes())
app.ready(() => {
    app.listen(7001)
    console.log( `egg app start success. port 7001` )
})
```

接着我们用0x来检测我们的应用

```
npm install - g 0x
0x -o -- node start.js // -o选项让0x来自动从浏览器中打开热力图
ab -n 100 -c 2 http://127.0.0.1:7001/ //用ab工具来向该应用发起100次请求，每次并发数为2
```

### 分析结果

![](https://img.alicdn.com/tfs/TB1EdU3cMaH3KVjSZFjXXcFWpXa-2664-816.jpg)
我们可以看到标红的部分的调用栈， 首先是Page.server.js, 也就是我们服务端打包出的bundle文件， 在这个文件中调用了t.default, 也就是打包后的serverRender方法， 接着是调用了o.getInitialProps， 我们就可以很轻易的知道是这个方法里面出了问题， 它还可以更细致的告诉你是这个方法的哪一行出了问题， 这里是console.log的代码块出了问题。 

## 常见性能问题

### 处理cpu密集型任务

在实际的开发中， 我相信大部分人都能够轻易发现这种长循环的问题， 同时也可以看出， Node.js在处理cpu密集型的任务时确实不擅长， 当然也有办法通过创建子进程或者线程的方式处理， 这里先不介绍了。

### 请求数据超时

这里我们经常会遇到请求后端接口时响应时间过长，导致页面的响应迟迟没有返回。这里我们可以为所有的请求封装一层自定义操作，例如设置超时时间，以及错误的catch处理。

### 服务端生成的字符串size过大

我们注意到了我们在服务端将生成好的html字符串， 与获取好的数据以window.__initialData__的方式返回给了客户端， 那么一旦这块数据size特别大达到700KB或者几MB时， 随着请求qps的增多， 我们很容易造成cpu飙升的现象。 


## 解决方式

### 数据缓存

我们可以使用redis来作为储存服务端数据的容器， 在实时性不是特别强的应用， 我们可以设置过期时间， 来让服务端处理的逻辑减少很多  

### 过滤数据

我们可以只保留需要的字段， 例如我只需要当前视频的标题信息以及演员信息字段， 而后端将视频的几十个字段信息都返回给你了， 这时候你可以定义一个filter方法来过滤数据

### 服务端只渲染部分模块

我们可以将页面分为服务端和客户端渲染两部分， 让服务端只专注于首屏渲染， 以下是一种实现方式， 我们以移动端竖版的feed来举例。 

```js
class Page {
    componentWillMount() {
        // 首先获取到当前的需要渲染的抽屉
        const moduleList = this.props.moduleList
        // 定义两个数组，分别存放服务端需要渲染的抽屉以及客户端需要渲染的抽屉
        let serverModuleList = []
        let clientModuleList = []
        if (moduleList.length > 5) {
            // 如果当前抽屉的数量大于5个
            // 将前5个抽屉赋值给服务端需要渲染的抽屉，后面的抽屉赋值给客户端需要渲染的抽屉
            serverModuleList = moduleList.slice(0, 5)
            clientModuleList = moduleList.slice(5, moduleList.length)
            this.setState({
                clientModuleList: clientModuleList
            })
        } else {
            // 如果抽屉数量小于5个，全部由服务端渲染
            serverModuleList = moduleList
        }
        this.setState({
            // 首先用serverModuleList作为state，来让服务端只渲染serverModuleList包含的抽屉
            moduleList: serverModuleList
        })
    }
     componentDidMount () {
        if (this.state.clientModuleList.length !== 0) {
            // 如果存在客户端渲染的抽屉，将其与当前的moduleList即serverModuleList组合成一个完整的页面包含的抽屉
            // 当state更新时，触发页面的重新render来触发客户端渲染
            this.setState({
                moduleList: this.state.moduleList.concat(this.state.clientModuleList)
            })
        }
    }
    render () {
        return (
            <div>
                {   // 这里我们还可以结合懒加载来进一步提升首屏性能
                    this.state.moduleList.map((item, index) => <Lazyload key={`com${index}`}><Component data={item} /></Lazyload>)
                }
            </div>
        )
  }
}
```

### 打底数据

当我们服务端渲染出现错误时候，例如在服务端代码访问了浏览器对象，我们总不能让用户看到白屏的页面。这里我们可以使用两种方式来解决。

- 降级为客户端渲染，我们在config配置中提供了当前的渲染模式，当你的应用出现问题而又无法立即解决时，可以先降级为客户端渲染，这样即使你某个模块出了问题，其他的模块还能够展示

- 使用mock数据，当页面出现暂时无法修复的错误时，我们可以直接在服务端返回一个我们事先准备好的mock的完整html数据返回给客户端
