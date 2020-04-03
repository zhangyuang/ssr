# ssr

ssr-spec implement.

## CCONTRIBUTING

Please read the [document](./CONTRIBUTING.md)

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

命令用法

```
$ ssr build
$ ssr deploy
```

生成的dist目录结构如下。

```
- dist
    - funcName
        - client
            - clientBundle.js
            - js
            - css
            - images
        - server
          - serverBundle.js
```

构建命令

```bash
$ ssr build # 默认以spa形式进行构建
$ ssr build --mpa
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



### 开发规范

如何开发单页面应用(SPA)和多页面应用(MPA)。
关于SPA与MPA的区别如下(本表格转载自网络，如有侵权请提issue联系)

<table>
<thead>
<tr>
<th></th>
<th>单页面应用（SinglePage Web Application，SPA）</th>
<th>多页面应用（MultiPage Application，MPA）</th>
</tr>
</thead>
<tbody>
<tr>
<td>组成</td>
<td>一个外壳页面和多个页面片段组成</td>
<td>多个完整页面构成</td>
</tr>
<tr>
<td>资源共用(css,js)</td>
<td>共用，只需在外壳部分加载</td>
<td>不共用，每个页面都需要加载</td>
</tr>
<tr>
<td>刷新方式</td>
<td>页面局部刷新或更改</td>
<td>整页刷新</td>
</tr>
<tr>
<td>url 模式</td>
<td>a.com/pageone <br> a.com/pagetwo</td>
<td>a.com/pageone.html <br> a.com/pagetwo.html</td>
</tr>
<tr>
<td>用户体验</td>
<td>页面片段间的切换快，用户体验良好</td>
<td>页面切换加载缓慢，流畅度不够，用户体验比较差</td>
</tr>
<tr>
<td>转场动画</td>
<td>容易实现</td>
<td>无法实现</td>
</tr>
<tr>
<td>数据传递</td>
<td>容易</td>
<td>依赖 url传参、或者cookie 、localStorage等</td>
</tr>
<tr>
<td>搜索引擎优化(SEO)</td>
<td>需要单独方案、实现较为困难、不利于SEO检索 可利用服务器端渲染(SSR)优化</td>
<td>实现方法简易</td>
</tr>
<tr>
<td>试用范围</td>
<td>高要求的体验度、追求界面流畅的应用</td>
<td>适用于追求高度支持搜索引擎的应用 </td>
</tr>
<tr>
<td>开发成本</td>
<td>较高，常需借助专业的框架</td>
<td>较低 ，但页面重复代码多</td>
</tr>
<tr>
<td>维护成本</td>
<td>相对容易</td>
<td>相对复杂</td>
</tr>
</tbody>
</table>
</div></a>

#### SPA

单页面应用一个函数对应一个页面。一个页面对应多个path(即前端路由)。

##### 目录结构

这里我们使用约定式路由的概念。无需手动编写路由配置文件，会根据文件夹名称及路径自动生成路由配置。

```bash
.
├── README.md
├── build
│   └── spa # 函数名称
│       ├── client # 客户端bundle文件
│       └── server # 服务端bundle文件
├── f.yml
├── package.json
├── src # faas文件夹
│   └── index.ts  # faas函数的handler文件
├── tsconfig.json # 用于编译faas函数的ts编译配置
└── web # 前端文件
    ├── home # /home 路由
    │   ├── fetch.ts
    │   └── render.tsx
    ├── layout.tsx # 布局文件，SPA应用只需要一个公用的layout文件
    └── news # /news 路由
        ├── fetch.ts
        └── render.tsx
```

##### yml文件编写规范

```yml
service:
  name: serverless-ssr
provider:
  name: aliyun

functions:
  spa:
    handler: index.handler
    render:
      mode: ssr # 指定渲染模式
    events:
      - http:             
          path: /
          method:
            - get

package:
  artifact: code.zip
```

##### 如何发布

```bash
$ ssr deploy # 此时只有一个函数需要发布，选择spa函数发布即可
```

##### 展示形式

http://xxx.com/home -> spa 函数 -> 渲染home组件  
http://xxx.com/news -> spa 函数 -> 渲染news组件  

#### MPA

多页面应用一个函数对应一个页面。一个页面对应一个path(即服务端路由)。

##### 目录结构

这里我们的服务端路由存在多个，需要读取yml文件具体函数的配置

```bash
.
├── README.md
├── build
│   ├── mpa1
│   │   ├── client
│   │   └── server
│   └── mpa2
│       ├── client
│       └── server
├── f.yml
├── package.json
├── src
│   ├── mpa1handler.ts
│   └── mpa2handler.ts
├── tsconfig.json
└── web
    ├── mpa1
    │   ├── fetch.ts
    │   ├── layout.tsx
    │   └── render.tsx
    └── mpa2
        ├── fetch.ts
        ├── layout.tsx
        └── render.tsx
```

##### yml文件编写规范

```yml
service:
  name: serverless-ssr
provider:
  name: aliyun

functions:
  mpa1:
    handler: mpa1.handler
    render:
      mode: ssr
    events:
      - http:             
          path: /home
          method:
            - get
  mpa2:
    handler: mpa2.handler
    render:
      mode: ssr
    events:
      - http:             
          path: /news
          method:
            - get

            
package:
  artifact: code.zip
```

##### 如何发布

```bash
$ ssr deploy # 此时需要在终端选择需要发布哪个函数
```

##### 展示形式

http://xxx.com/home -> mpa1 函数 -> 渲染home组件  
http://xxx.com/news -> mpa2 函数 -> 渲染news组件  

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

