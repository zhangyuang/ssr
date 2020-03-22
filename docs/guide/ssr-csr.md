# 同时兼容两种渲染模式

我们的应用的一大特色是能够同时兼容/启动， ssr/csr 两种渲染模式，在本地开发时，你可以同时启动两种渲染模式来观察区别。在生产环境时，你可以通过config配置，来随时切换两种渲染模式

## 详细做法

下面来介绍我们的详细做法，我们的一大特色是全面拥抱`jsx`来作为前端组件以及页面模版，抛弃`index.html`文件

## 使用jsx来当作通用模版

我们没有采用`html-webpack-plugin`这个插件来作为`csr`的页面模版，这个经典插件是根据传入的 `index.html` 来自动注入打包的静态资源。 但此方式缺点太多，一个是传统的模版引擎的语法实在是不人性化，比起`jsx`这种`带语法糖的手写 AST`的方法已经极其的落后，对前端工程师极度不友好，还得去专门学该模版引擎的语法造成心智负担。且灵活性太低，不能应对多变的业务需求。
所以我们移除 `web/index.html` 文件 其功能由 `web/layout/index.js` 来代替

## csr模式下自己DIY模版的生成内容

借助 React 官方 API 我们可以将一个 React 组件编译为 html 字符串

### 本地开发

以下代码皆封装在[yk-cli](https://github.com/ykfe/egg-react-ssr/blob/dev/packages/yk-cli/src/renderLayout.ts) 当中，让用户无感知
本地开发我们通过 `webpack-dev-server` 来创建一个服务，此时需要在访问根路由时返回正确的 dom 结构。
我们首先将 layout 组件编译为 string

``` js
// yk-cli/renderLayout.js
const renderLayout = async () => {
  let Layout
  // 我们调用webpack的api来应用目录下的webpack配置来编译layout组件，使其可以在Node环境中运行
  try {
    // serverless 场景我们从事先构建好的应用目录下的dist文件夹中读取layout
    Layout = isServerless ? require('../../../dist/Layout.server').default : require('../dist/Layout.server').default
  } catch (error) {
    // 非serverless场景首次读取失败我们先调用webpack api构建一遍在ykcli的目录下再读取
    const webpackWithPromise = require('./util')
    await webpackWithPromise(serverConfig)
    Layout = require('../dist/Layout.server').default
  }

  // 此时props.children 为 undefined 我们只需要传递一个空的layout骨架即可
  const props = {
    layoutData: {
      app: {
        config: config
      }
    }
  }

  const str = reactToString(Layout, props)
  return str
}
```

然后启动服务，将string返回

``` js
// ykcli/clientRender.js
const dev = () => {
    const compiler = webpack(clientConfig)
    const server = new WebpackDevServer(compiler, {
        disableHostCheck: true,
        publicPath: '/',
        hotOnly: true,
        host: 'localhost',
        contentBase: cwd + '/dist',
        hot: true,
        port: 8000,
        clientLogLevel: 'error',
        headers: {
            'access-control-allow-origin': '*'
        },
        before(app) {
            app.get('/', async (req, res) => {
                res.write(string)
                res.end()
            })
        },
        after(app) {
            app.get(/^\//, async (req, res) => {
                res.write(string)
                res.end()
            })
        }
    })
    server.listen(8000, 'localhost')
}
```

此时我们只需要返回一个空的html结构且包含 `<div id="app"></div>` 并且插入 `css/js` 资源即可
此时的最终渲染形式如下

``` js
const commonNode = props => (
  // 为了同时兼容ssr/csr请保留此判断，如果你的layout没有内容请使用 props.children ? <div>{ props.children }</div> : ''
  // 作为承载csr应用页面模版时，我们只需要返回一个空的节点
  props.children ? <div className='normal'><h1 className='title'><Link to='/'>Egg + React + SSR</Link><div className='author'>by ykfe</div></h1>{props.children}</div>
    : ''
)

const Layout = (props) => {
  if (__isBrowser__) {
    // 客户端hydrate时，只需要hydrate <div id='app'>里面的内容
    return commonNode(props)
  } else {
    const { serverData } = props.layoutData
    const { injectCss, injectScript } = props.layoutData.app.config
    return (
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
          <meta name='theme-color' content='#000000' />
          <title>React App</title>
          {
            injectCss && injectCss.map(item => <link rel='stylesheet' href={item} key={item} />)
          }
        </head>
        <body>
          <div id='app'>{ commonNode(props) }</div>
          {
            serverData && <script dangerouslySetInnerHTML={{
              __html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(serverData)}`
            }} />
          }
          <div dangerouslySetInnerHTML={{
            __html: injectScript && injectScript.join('')
          }} />
        </body>
      </html>
    )
  }
}
```

### 生产环境

生产环境我们直接将 `string` 写入 `dist/index.html` 文件，使得兼容 `csr`

``` js
// ykcli/clientRender.js

const build = async () => {
    const stats = await webpackWithPromise(clientConfig)
    console.log(stats.toString({
        assets: true,
        colors: true,
        hash: true,
        timings: true,
        version: true
    }))
    fs.writeFileSync(cwd + '/dist/index.html', string)
}
```

## ssr模式

ssr模式下我们可以直接渲染包含子组件的layout组件即可以获取到完整的页面结构

``` js
// ykfe-utils/renderToStream.js

const serverRes = await global.serverStream(ctx)
const stream = global.renderToNodeStream(serverRes)
return stream
```

我们直接将 `entry/serverRender` 方法的返回值传入 `renderToNodeStream` 即可

### ssr模式下切换为csr

为了应对大流量或者ssr应用执行错误，需要紧急切换到csr渲染模式下，我们照样可以通过 `config.type` 来控制。
实现方式如下

``` js
// ykfe-utils/renderToStream.js

if (config.type !== 'ssr') {
    const renderLayout = require('yk-cli/bin/renderLayout').default
    const str = await renderLayout()
    return str
}
```

在非ssr渲染模式下，服务端直接返回一个只包含空的 `<div id="app"></app>` 的html文档

## 总结

2.0.0版本的好处在于，原来的页面模版拼接逻辑都是写在 `renderToStream` 方法内部的，有如下缺点

* 过于黑盒，里面的逻辑略显复杂，使用者不知道自己的页面究竟是怎么渲染出来的
* 灵活性差，拼接的内容皆来自于锚点与config中的 `key-value` 的互相对应，一旦想要新增一个config配置，renderToStream 也得随之添加对应的锚点

而我们新的版本将这块逻辑迁移到 `layout` 组件中进行，使用者可以灵活决定页面的元素。并且此时让 `renderToStream` 中的逻辑变得十分简洁。保证每一个第三方模块中的方法做的事情都十分简单
