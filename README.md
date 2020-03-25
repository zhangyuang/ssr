# ssr

ssr-spec implement.

![](https://gw.alicdn.com/tfs/TB1wfPfzeH2gK0jSZFEXXcqMpXa-1874-262.png)

## developing

```bash
$ npm run bootstrap # Install and Symlink together all Lerna packages that are dependencies of each other in the current Lerna repo.
```

## Install

```shell
$ npm i -S ssr
$ ssr init
```

## Usage

ssr scaffold

```
$ ssr start
$ ssr build
$ ssr deploy
```

## Specification

本规范主要定义 ssr 特性，组件写法、目录结构以及 `f.yml` 文件扩展的编写规范。

目录结构待讨论，例如新增功能的api与删除功能的api理论上应该放在一个project当中，此时应该在src目录下建立不同的文件夹来隔离不同函数的模块

```bash
├── dist // 构建产物
│   ├── Page.server.js // 服务端页面bundle
│   ├── asset-manifest.json // 打包资源清单
│   ├── index.html // 页面承载模版文件，除非想换成传统的直接扔一个html文件部署的方式
│   └── static // 前端静态资源目录
│       ├── css
│       └── js
├── config // 配置
│   ├── webpack.js // webpack配置文件，使用chainWebpackConfig方式导出，非必选
│   └── other // 
├── index.js // 函数入口文件
├── f.yml // faas函数规范文件
├── package.json
├── src // 存放前端页面组件
│   ├── detail // 详情页
│   │   ├── fetch.js // 数据预取，非必选
│   │   ├── index.js // React组件，必选
│   │   └── layout.js // 页面布局，非必选，没有默认使用layout/index.js
│   ├── home // 首页
│   │   ├── fetch.js
│   │   ├── index.js
│   │   └── layout.js
│   └── layout
│       └── index.js // 默认的布局文件，必选,脚手架默认生成
└── README.md // 
```

命令用法

```
$ ssr build
$ ssr deploy
```

生成的dist目录结构如下。

- dist
    - funcName
        - static
            - clientBundle.js
            - js
            - css
            - images
        - serverBundle.js

构建命令

```
$ ssr build
$ ssr build --spa
$ ssr build hello
$ ssr build hello2
```

serverless集成步骤，通用方案集成

```
$ ssr xxx
$ serverless deploy
```

### 组件写法

```js
function Page(props) {
  return <div> {props.name} </div>
}

Page.fetch = async (ctx) => {
  return Promise.resolve({
    name: 'Serverless side render'
  })
}

Page.layout = (props) => {
    const { serverData } = props.ctx
    const { injectCss, injectScript } = props.ctx.app.config
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

export default Page
```

- render[必选]
- layout[可选]
- fetch(getInitialProps) [可选]



### 扩展render配置

路由由f.yml的配置文件中，所以在f.yml增加render配置扩展，具体如下。

```
service:
  name: serverless-ssr
provider:
  name: aliyun

functions:
  index:
    handler: index.handler
    render:
        component: src.home.index
        layout: src.home.layout
        fetch: src.home.fetch
        mode: ssr
        injectScript:
          - runtime~Page.js
          - vendor.chunk.js
          - Page.chunk.js
        injectCSS:
          - Page.chunk.css
        serverBundle: Page.server.js
    events:
      - http:              # 设置 vipserver trigger
          path: /
          method:
            - GET
```

### 多组件扩展支持

多组件支持是基于bigpipe的方式，首先写入layout布局，然后处理多个组件的组合逻辑，最终res.end即可。另外，组件上如果只有fetch方法，没有render方法也是没有问题的。写法有2种，具体如下。

component的值是数组，即串行方式

```js
functions:
  news:
    handler: index.handler
    render:
      - component: 
        - src.news.index
        - src.news.index
        - src.news.index3
      - layout: src.news.layout
      - fetch: src.news.fetch
      - mode: ssr | csr（默认ssr）
    events:
      - http:
          path: /
          method:
            - GET
```

component的值是对象，即并行方式

```js
functions:
  news:
    handler: index.handler
    render:
      - component: 
        a: src.news.index
        b: src.news.index
        c: src.news.index3
      - layout: src.news.layout
      - fetch: src.news.fetch
      - mode: ssr | csr（默认ssr）
    events:
      - http:
          path: /
          method:
            - GET
```

component支持无限嵌套，可以支持所有场景。

执行过程说明：

- ssr模式时，采用bigpipe写入，最后red.end即可，前端不需要改造。
- csr模式时，采用高阶组件封住，入口侧多个组件遍历，此处需要改造。

### 渲染函数

1）在 FaaS 数里

在 FaaS 数里，挂载ssr渲染方法，参数是ctx。

```js
module.exports = function (ctx) {
    // ctx.ssr.fassConfig.serverBundle
    
    ctx.body = ctx.ssr({
        filter: function(asset){
            // ctx.ssr.fassConfig
        }
    })
}
```

ctx.ssr根据ctx.ssr.fassConfig.mode，确定是ssr还是csr模式，伪代码示意如下。

```js
ctx.ssr = function (ctx) {
    if (ctx.ssr.fassConfig.mode === 'ssr') {
        ctx.ssrRender(ctx)
    } else{
        ctx.csrRender(ctx)
    }
}
```

ctx.ssr.fassConfig配置文件具体内容来自于 f.yml 文件，参见【扩展render配置】。

2）在 Node.js Web 框架里

渲染函数可以支持 midway/egg/koa/express 等 Node.js Web 框架，用法如下。

```
const conf = require('./config/config.ssr')
const ssr = require('ssr').koa(conf);

const Koa = require('koa');
const app = new Koa();

//  mount routes from config
app.use(ssr)

// ctx.ssrRender()
app.use(async ctx => {
  ctx.ssrRender(...);
});

app.listen(3000);
```

### 模式切换

```
//检查post的信息或者url查询参数或者头信息
conf.mode = req.query.ssr || req.headers['x-mode-ssr'];
```

- ssr(conf)
    - cookie
    - querystring
    - header

此处需要考虑优先级，比如querystring第一，其次是f.yml里的render.mode。

