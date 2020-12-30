<h1 align="center">SSR</h1>
<div align="center">
  <img src="https://gw.alicdn.com/tfs/TB1ckATCGL7gK0jSZFBXXXZZpXa-540-540.jpg" width="300" />
</div>
<br />
<div align="center">
  <strong>A future-oriented ssr framework based on midway-faas that implemented serverless-side render specification for faas.</strong>
</div>
<br />
<a href="https://github.com/ykfe/ssr/actions"><img src="https://github.com/ykfe/ssr/workflows/CI/badge.svg" alt="githubActions"></a>
<a href="https://npmcharts.com/compare/ssr-core"><img src="https://img.shields.io/npm/dt/ssr-core" alt="download"></a>
<a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="standardjs"></a>
<a href="https://github.com/ykfe/ssr"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>
<a href="https://github.com/ykfe/ssr"><img src="https://img.shields.io/badge/node-%3E=10-green.svg" alt="Node"></a>

ssr is serverless-side render specification implementation. focus on developer experience, easy debug and no over-engineering.

features

- minimal：build bundle size is smaller than nextjs
- full feature：write once，generate SSR/CSR bundle, tranfer ssr to csr mode seamless degradation
- support multi‑cloud：based on [midway-faas](https://github.com/midwayjs/midway) framework，can be deployed to any serverless plateform


## Serverless for Developer

> Serverless 解放了端开发者（不仅仅是 Web 开发者）的生产力，让端开发者可以更快、更好、更灵活地开发各种端上应用，不需要投入太多精力关注于后端服务的实现。”

传统应用开发流程

![](https://img.alicdn.com/tfs/TB1CE7FB5_1gK0jSZFqXXcpaXXa-1402-150.png)

Serverless 应用开发流程

![](https://img.alicdn.com/tfs/TB1hZgHB7T2gK0jSZPcXXcKkpXa-1136-174.png)

使用本框架开发 Serverless SSR 应用开发流程

![](https://img.alicdn.com/tfs/TB1wzqpCkP2gK0jSZPxXXacQpXa-1880-256.jpg)

相比于传统服务端应用开发，我们将细节在底层统一抹平。前端开发者只需要关注业务逻辑，无需感知服务器的运行状况。成本和心智负担大大降低，只需要申请一个域名即可将应用发布到公网让所有用户可以访问。

🚀 表示已经实现的功能

| 里程碑                                                                 | 状态 |
| ---------------------------------------------------------------------- | ---- |
| 最小而美的实现 React 服务端渲染功能                           | 🚀   |
| 约定式前端路由                            | 🚀   |
| 渲染模式切换：服务端渲染一键降级为客户端渲染                            | 🚀   |
| 统一服务端客户端的数据获取方式                                 | 🚀   |
| 类型友好，全面拥抱 TS                                | 🚀   |
| 支持无缝接入 [antd](https://github.com/ant-design/ant-design) 无需修改任何配置                             | 🚀   |
| 支持使用 less 作为 css 预处理器                                                | 🚀   |
| 接入 useContext + useReducer 实现极简的数据管理，摒弃传统的 redux/dva 等数据管理方案                         |    🚀  |
| 支持在阿里云 [云平台](https://zhuanlan.zhihu.com/p/139210473)创建使用          | 🚀     |
| ssr deploy 一键部署到[阿里云](https://www.aliyun.com/)平台           | 🚀   |
| ssr deploy --tencent 无需修改任何配置一键部署到[腾讯云](https://cloud.tencent.com/)平台                                   | 🚀   |

## 哪些应用在使用

正在使用这个项目的公司(应用), 如果您正在使用但名单中没有列出来的话请提 issue，欢迎推广分享，我们将随时提供技术支持

<table>
<tr height="100">
<td align="center"><a target="_blank" href="http://youku.com/"><img src="https://img.alicdn.com/tfs/TB17DTuXkH0gK0jSZPiXXavapXa-680-133.svg" width="100px;"/><br />
 <sub><b>优酷视频
</b></td>
<td align="center"><a target="_blank" href="https://yulebao.alibaba.com/"><img src="https://gw.alicdn.com/tfs/TB1CmlIIFT7gK0jSZFpXXaTkpXa-190-46.png" width="100px;"/><br><sub><b>阿里影业娱乐宝
</b></sub></a></td>
<td align="center"><a target="_blank" href="http://ssr-fc.com/"><img src="https://img.alicdn.com/tfs/TB13DzOjXP7gK0jSZFjXXc5aXXa-212-48.png" width="100px;"/><br><sub><b>部署于阿里云示例应用
</b></sub></a></td>
<td align="center"><a target="_blank" href="http://tx.ssr-fc.com/"><img src="http://s0.60logo.com/uploads/items/images/soft/180126/tengxunyun.svg" width="100px;"/><br><sub><b>部署于腾讯云示例应用
</b></sub></a></td>
</tr>
</table>

## 快速开始

开发者只需 5 分钟就可以快速的创建并发布一个 SSR 应用上线

### 环境准备

```bash
$ node -v # 建议版本>=v10.15.0
v12.16.1
```

### 创建项目

我们使用 [create-ssr-app](https://github.com/zhangyuang/create-ssr-app) 来快速的创建项目

```bash
$ npm init ssr-app my-ssr-project # 默认创建 Serverless SPA 项目, MPA 支持中
$ cd my-ssr-project
```

### 本地开发

```bash
$ npm i
$ npm start # 等价于 ssr start
$ open http://localhost:3000
```

为了方便开发我们建议全局安装 `ssr` 模块 `npm i -g ssr` 这样可以很方便的通过在命令行使用 `ssr xxx` 等命令来开发部署应用

### 资源构建

```bash
$ npm run build # 等价于 ssr build
$ npm run build --func=index # 对指定函数进行构建(支持中)
```

### 发布到阿里云

发布命令

```bash
$ npm run deploy # 支持发布多个平台默认发布到阿里云 等价于 ssr deploy
```

首次发布需要输入阿里云账户信息，并且在阿里云控制台开通函数计算服务。账户信息在函数计算[控制台](https://fc.console.aliyun.com/fc)查看。

![](https://img.alicdn.com/tfs/TB1fZzQB.z1gK0jSZLeXXb9kVXa-1446-1262.jpg)

将 AccountId 以及 Key Secret 在下面输入，只需要输入一次信息会储存在本地，之后 deploy 无需做该操作。

![](https://img.alicdn.com/tfs/TB10vYVBYY1gK0jSZTEXXXDQVXa-2044-528.jpg)

发布成功后得到一个 http 地址`https://1812856288776972.cn-shanghai.fc.aliyuncs.com/***`。由于阿里云安全限制，无法直接在浏览器查看。需要手动配置域名转发过去。`阿里云控制台域名服务` -> `域名解析设置` -> `函数计算控制台` -> `自定义域名`。之后打开[域名](http://ssr-fc.com)便能够访问到发布的函数。

![](https://gw.alicdn.com/tfs/TB1yfjUB4D1gK0jSZFKXXcJrVXa-1212-680.jpg)

![](https://gw.alicdn.com/tfs/TB1g_CwB7P2gK0jSZPxXXacQpXa-1254-698.jpg)

![](https://gw.alicdn.com/tfs/TB1JZGyB1H2gK0jSZFEXXcqMpXa-1468-1012.jpg)

### 发布到腾讯云

无需做任何配置文件的修改即可一键发布到腾讯云！

发布命令

```bash
$ npm run dploy:tencent # 发布到腾讯云 等价于 ssr deploy --tencent
```

首次发布时需要使用微信扫终端展示的二维码注册/登陆腾讯云服务。  
如果想详细的了解腾讯云发布功能可参考[文档](https://www.yuque.com/midwayjs/faas/deploy_tencent_faq)
发布后同样我们可以得到平台返回的一个地址, 需要绑定域名后才能正确的访问页面渲染服务。否则由于访问 /test 路径造成服务端路由和客户端路由不一致会导致页面内容闪现后白屏。  
![](https://res.wx.qq.com/op_res/mbNMsqF_px3tS0x_x1fryyR3Z5RipX3Lo8PIzvcAVxyXwoQyvQz0lQev-W2io3AP)
默认发布到测试环境, 这里建议在第一次发布后显示在 yml 中指定要发布的serviceID, 否则每次发布将会创建一个新的 server 实例。  
在腾讯云[API](https://console.cloud.tencent.com/apigateway/service-detail)网关平台进行域名的绑定以及函数发布到正式环境的操作  
在腾讯云[SCF](https://console.cloud.tencent.com/scf)平台可以进行函数的管理调试以及日志查看

#### 绑定域名

在发布到腾讯云时 midway-faas 支持通过 [provider.region](https://www.yuque.com/midwayjs/faas/serverless_yml) 来设置发布的服务器区域。  
如果发布的区域是国内则绑定的域名需要在腾讯云进行备案服务，如果是香港则无需备案。默认绑定域名后需要通过 [tx.ssr-fc.com/release](http://tx.ssr-fc.com) 来访问具体的环境。也可以通过自定义路径映射使得不需要添加 /release 也可以访问到具体的环境。
![](https://res.wx.qq.com/op_res/Ln1MuNWmmfNDyTuJlooXiGdhwtCtz_4rVDi_qvmuUEoL_mo6PNsd3z4d7z9RBj17)

### 线上案例

```bash
$ open http://ssr-fc.com/ # 发布到阿里云的函数
$ open http://ssr-fc.com?csr=true # 以csr模式运行
$ open http://tx.ssr-fc.com/ # 发布到腾讯云的函数
$ open http://tx.ssr-fc.com?csr=true # 以csr模式运行
```

### 结合阿里云开发平台

本框架可结合阿里云开发平台，使用 CloudIDE 全程上云开发 Serverless SSR 应用使用方式可参考该[教程](https://zhuanlan.zhihu.com/p/139210473)。

## 开发规范

`注：本规范适用于绝大多数的业务场景，如需额外定制请先想清楚是否必要!`

### 前端技术选型

- 前端框架: React v17, 实时跟进 React17的新特性
- 开发语言: TypeScript
- 代码风格: [Standard](https://standardjs.com/)
- 样式处理: less + css modules
- UI 组件: 默认已对 antd 的使用做打包配置无需额外配置
- 前端路由: 约定式路由
- 数据管理: 使用 React Hooks 提供的 useContext + useReducer 实现极简的数据管理方案, 摒弃传统的 redux/dva 等数据管理方案

### 本地调试

借助 [debug](https://github.com/visionmedia/debug) 模块的能力，开发者可以在本地开发过程中获取一些构建渲染过程的信息。

```bash
$ DEBUG=ssr:* npm start # 打印所有的 ssr 模块提供的 debug 信息
$ DEBUG=ssr:parse npm start # 打印约定式路由解析 debug 信息
$ DEBUG=ssr:render npm start # 打印页面渲染 debug 信息
```

### 应用原理解析

点击[此处](./images/ykfe-ssr.png)查看高清大图
![](./images/ykfe-ssr.png)

### 不同页面组件进行数据共享

通过使用 `useContext` 来获取全局的 `context`, `useContext` 返回两个值分别为

- state: 全局的状态，可在不同的组件/页面之间共享
- dispatch: 通过 `disptach` 来触发类型为 `updateContext` 的 `action` 来更新全局的 `context`

`注: hooks 只能够在函数组件内部使用`

```js
import { useContext } from 'react'

const { state, dispatch } = useContext(window.STORE_CONTEXT)
```

通过 `dispatch action` 来进行全局 `context` 的更新，并通知到所有的组件。  
`注: dispatch 是异步的只能够在客户端渲染的阶段使用，服务端使用无效。context 更新会导致所有组件重新 render 可根据实际情况使用 React.useMemo 来避免不必要的重新计算，且建议根据不同的模块使用不同的 namespace 防止数据覆盖`

```js
import React, { useContext } from 'react'
import styles from './index.less'

function Search (props) {
  const { state, dispatch } = useContext(window.STORE_CONTEXT)
  const handleChange = e => {
    dispatch({
      type: 'updateContext',
      payload: {
        search: {
          // 搜索框模块的 namespace 为 search
          text: e.target.value
        }
      }
    })
  }
   return (
    <div className={styles.searchContainer}>
      {/* 这里需要给 value 一个兜底的状态 否则 context 改变 首次 render 的 text 值为 undefined 会导致 input 组件 unmount */}
      {/* ref: https://stackoverflow.com/questions/47012169/a-component-is-changing-an-uncontrolled-input-of-type-text-to-be-controlled-erro/47012342 */}
      <input type="text" className={styles.input} value={state.search?.text ?? ''} onChange={handleChange} placeholder="该搜索框内容会在所有页面共享"/>
      <img src="https://img.alicdn.com/tfs/TB15zSoX21TBuNjy0FjXXajyXXa-48-48.png" alt="" className={styles.searchImg} onClick={toSearch}/>
    </div >
  )
}

export default Search

```

### 应用类型

我们支持单页面应用(SPA)和多页面应用(MPA)两种常见的应用类型的开发。
关于 SPA 与 MPA 的区别如下(本表格转载自网络，如有侵权请提 issue 联系)

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

单页面应用一个函数对应一个页面。一个页面对应多个 path(即前端路由)。

##### 目录结构

这里我们使用约定式路由。无需手动编写路由配置文件，会根据文件夹名称及路径自动生成路由配置。

```bash
.
├── build # web目录构建产物
│   └── index
│       ├── client
│       └── server
├── config.js # 定义应用的配置
├── f.yml
├── package.json
├── src # 存放faas函数的handler
│   └── index.ts
├── tsconfig.json
├── web
│   ├── components # 存放公共组件
│   │   └── header
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   └── layout # SPA应用只需要一个默认的layout
│   │       ├── index.less
│   │       └── index.tsx
│   ├── pages # pages目录下的文件夹会映射为前端路由
│   │   ├── index # index文件夹映射为根路由
│   │   │   ├── fetch.ts # 定义fetch文件用来获取数据，会自动注入到组件的props中
│   │   │   ├── index.less
│   │   │   └── render.tsx # 定义render文件用来定义页面渲染逻辑
│   │   └── detail
│   │       ├── fetch.ts
│   │       ├── index.less
│   │       └── render$id.tsx # 映射为/detail/:id
│   │       └── render$id$.tsx # 映射为/detail/:id?
│   ├── tsconfig.json # 仅用于编辑器ts语法检测
│   └── typings.d.ts
```

##### yml 文件编写规范

```yml
service:
  name: serverless-ssr
provider:
  name: aliyun

functions:
  index:
    handler: index.handler
    render: # 定义页面渲染服务
      mode: ssr
    events:
      - http:
          path: /
          method: get
      - http:
          path: /detail/*
          method: get
  api-index: # 定义api接口服务
    handler: api.handler
    events:
      - http:
          path: /api/index
          method: get
  api-detail:
    handler: api.detail.handler
    events:
      - http:
          path: /api/detail/*
          method: get

package:
  artifact: code.zip
```

##### 如何发布

```bash
$ ssr deploy # 此时只有一个函数需要发布，选择index函数发布即可
```

##### 展示形式

http://ssr-fc.com/ -> index 函数 -> 渲染 index 组件  
http://ssr-fc.com/detail/* -> index 函数 -> 渲染 detail 组件

#### MPA

多页面应用一个函数对应一个页面。一个页面对应一个 path(即服务端路由)。

##### 目录结构

这里我们的服务端路由存在多个，需要读取 yml 文件具体函数的配置

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
├── web
│   ├── components # 存放公共组件
│   │   └── header
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   └── layout # 默认的layout
│   │       ├── index.less
│   │       └── index.tsx
│   ├── pages
│   │   ├── index
│   │   │   ├── fetch.ts
│   │   │   ├── index.less
|   |   |   ├── layout.tsx # 每个独立的页面可以有自己的layout
│   │   │   └── render.tsx
│   │   └── detail
│   │       ├── fetch.ts
│   │       ├── index.less
│   │       └── render$id.tsx
```

##### yml 文件编写规范

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
          path: /
          method:
            - get
  mpa2:
    handler: mpa2.handler
    render:
      mode: ssr
    events:
      - http:
          path: /detail/*
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

http://ssr-fc.com/ -> mpa1 函数 -> 渲染 mpa1 文件夹下的 render 组件  
http://ssr-fc.com/detail/* -> mpa2 函数 -> 渲染 mpa2 文件夹下的 render 组件

### 渲染函数

1）在 FaaS 函数里

在 FaaS 函数里，只需要调用 ssr-core 提供的 render 方法传入 ctx 即可

```js
import { render } from 'ssr-core'

async handler () {
  try {
    const htmlStr = await render(this.ctx)
    return htmlStr
  } catch (error) {
    return error
  }
}
```

根据 f.yml 或者 query 来判断当前渲染模式

2）在 Node.js Web 框架里

该渲染方式实现是服务端无关的，理论上可以支持任何 Node.js 框架只需引入 render 方法以及有一个 web 目录，用法与 Faas 函数保持一致。

```
const Koa = require('koa');
const { render } = require('ssr-core')
const app = new Koa();

//  mount routes from config
app.use(ssr)

// ctx.ssrRender()
app.get('/*', async ctx => {
  ctx.body = render(ctx)
});

app.listen(3000);
```

### 模式切换

```js
// url查询参数或者头信息
conf.mode = req.query.ssr || req.headers['x-mode-ssr']
```

- ssr(conf)
  - cookie
  - querystring
  - header

此处需要考虑优先级，比如 querystring 第一，其次是 f.yml 里的 render.mode。

## 配置

config.js 支持以下配置, 默认配置已适用于绝大部分应用, 无特殊需求不要修改

```js
{
  cwd: string; // 设置命令执行的cwd，默认为 process.cwd()，无特殊需求不需修改
  isDev: boolean; // 当前运行环境，默认为 process.env.NODE_ENV
  publicPath: string; // webpack-dev-server 的publishPath，默认为 /
  useHash: boolean; // 生成文件是否带有 hash，默认本地运行关闭，生产环境构建时开启
  port: number; // 前端静态资源本地开发时的监听端口，默认为 8000FaaS Server 会自动 proxy,无特殊需求不需要修改
  faasPort: number; // 本地开发启动的FaaS 服务的端口，默认为3000
  chunkName: string; // 生成的bundle的chunkName，默认为Page,无特殊需求不要修改
  webpackDevServerConfig: webpackDevServer.Configuration; // webpack-dev-server 启动配置
  staticPrefix: string; // 加载的静态资源前缀，需要发布到单独的cdn服务时可以使用该配置设置为cdn服务的地址
  chainServerConfig: (config: Config) => Configuration; // 使用 webpack-chain 来修改服务端 wbepack 构建配置
  chainClientConfig: (config: Config) => Configuration; // 使用 webpack-chain 来修改服务端 wbepack 构建配置
  whiteList: RegExp[]; // 设置服务端构建配置 externals 的白名单，即需要让 webpack 来处理的模块
  cssModulesWhiteList: RegExp[]; // 设置该选项指定样式文件不用 css-modules 处理，防止样式和 className 不匹配
  prefix: string; // 为前端路由添加统一的prefix, 如 /${prefix}/, /${prefix}/detail/:id
  proxy: {
    // 可用于本地proxy api接口调试，使用方式查看koa-proxy文档
    host: string;
    match: RegExp;
  }
}

```

## FAQ

遇到问题先去该[文档](http://ykfe.surge.sh/guide/faq.html)找答案，该文档列举了开发 SSR 应用可能会遇到的大部分问题。如果没有预期的答案再提 issue

## CONTRIBUTING

Please read the [document](./CONTRIBUTING.md)

## License

[MIT](LICENSE)

## 答疑群

虽然我们已经尽力检查了一遍应用，但仍有可能有疏漏的地方，如果你在使用过程中发现任何问题或者建议，欢迎提[issue](https://github.com/ykfe/ssr/issues)或者[PR](https://github.com/ykfe/ssr/pulls)
欢迎直接扫码加入钉钉群
<img src="https://res.wx.qq.com/op_res/gQfTCN-BGtR7Luw1CjnJoJiPt7MDmyxl_G-LAyR4Wp4l8R9ISlTWj6yLuLt41zTO4nwneqdAd9g5-QnMt9qKTQ" width="300">
