# 为什么要选择 SSR 

<div align="center">
  <strong>A most advanced ssr framework on Earth that implemented serverless-side render specification for faas and traditional web server.</strong>
</div>
<br />
<div align="center">
<a href="https://github.com/ykfe/ssr/actions" target="_blank"><img src="https://github.com/ykfe/ssr/workflows/CI/badge.svg" style="width:90px;height: 20px" alt="githubActions"></a>
<a href="https://www.cypress.io/" target="_blank"><img src="https://img.shields.io/badge/cypress-dashboard-brightgreen.svg" style="width:90px;height: 20px" alt="cypress"></a>
<a href="https://npmcharts.com/compare/ssr" target="_blank"><img src="https://img.shields.io/npm/dt/ssr" style="width:90px;height: 20px" alt="download"></a>
<a href="https://standardjs.com" target="_blank"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" style="width:90px;height: 20px" alt="standardjs"></a>
<a href="https://github.com/ykfe/ssr" target="_blank"><img src="https://img.shields.io/npm/l/vue.svg" style="width:90px;height: 20px" alt="License"></a>
<a href="https://github.com/ykfe/ssr" target="_blank"><img src="https://img.shields.io/badge/node-%3E=12-green.svg" style="width:90px;height: 20px" alt="Node"></a>
</div>
<br />

[ssr](https://github.com/ykfe/ssr) 框架是为前端框架在服务端渲染的场景下所打造的开箱即用的服务端渲染框架。

此框架脱胎于 [egg-react-ssr](https://github.com/ykfe/egg-react-ssr) 项目和 `ssr` v4.3版本（midway-faas + react ssr），在之前的基础上做了诸多演进，通过插件化的代码组织形式，支持任意服务端框架与任意前端框架的组合使用。开发者可以选择通过 Serverless 方式部署或是以传统 Node.js 的应用形式部署，并且我们专注于提升 Serverless 场景下服务端渲染应用的开发体验，打造了一站式的开发，发布应用服务的功能。最大程度提升开发者的开发体验，将应用的开发，部署成本降到最低。

在最新的 v5.0 版本中，同时支持 `React` 以及 `Vue2`, `Vue3` 作为服务端渲染框架。在构建工具方面我们同样支持了最流行的 [Vite](https://cn.vitejs.dev/guide/why.html) 来提升应用的启动速度和 HMR 速度，且提供一键以 Serverless 的形式发布上云的功能。  

我们可以非常有自信说它是`地球上最先进的ssr框架`。如果你希望获得开箱即用的体验且能够一键部署上云，请选择 `ssr` 框架。

## 什么情况下你应该选择 ssr 框架

- 需要在 `Node.js` 与前端框架结合的场景使用，与其他纯前端的框架不同 `ssr` 框架是专为服务端渲染场景或者 `Node.js` 与前端结合的场景打造的框架
- 需要一个开箱即用的服务端渲染能力，不需要手动去组合不同的前端框架与服务端框架之间的联系
- 需要一个配置简单逻辑清晰的框架， `ssr` 框架的渲染逻辑和应用构建逻辑是同类型框架中最清晰的
- 可能会改动技术栈，如从 `Vue2` 升级为 `Vue3`，从 `Vue3` 降级为 `Vue2` 或 `React/Vue` 互相切换
- 需要在服务端渲染场景下开箱即用使用 `antd` `vant` 等流行 `ui` 库
- 需要能够同时支持 `Webpack`, `Vite` 两种构建工具，以便同时得到快速的启动速度 `HMR` 速度以及稳定的生产环境代码

## Features

- 🌱　极易定制：前端支持 React/Vue2/Vue3 等现代Web框架；
- 🚀　开箱即用：内置 10+ 脚手架配套扩展，如Antd、Vant、TS、Hooks等；
- 🧲　插件驱动：基于插件架构，用户更加专注于业务逻辑；
- 💯　Serverless优先：一键发布到各种Serverless平台，也支持传统Web Server，比如Egg、Midway、Nest等。
- 🛡　高可用场景，可无缝从SSR降级到CSR，最佳容灾方案。
- 😄　功能丰富，构建工具支持 Webpack/Vite

## 已实现的功能

🚀 表示已经实现的功能

| 里程碑                                                                 | 状态 |
| ---------------------------------------------------------------------- | ---- |
| 支持任意服务端框架与任意前端框架的组合使用。(Serverless/Midway/Nestjs) + (React/Vue2/Vue3)             | 🚀   |
| 支持一键部署 SSR 应用到各种 Serverless 平台            | 🚀   |
| 支持 [vite](https://vite-design.surge.sh/) 作为构建工具在 SSR 场景下的组合[使用](./features$vite) |  🚀    |
| 最小而美的实现服务端渲染功能                           | 🚀   |
| 针对Serverless 场景对代码包的大小的严格限制，将生产环境的代码包大小做到极致            | 🚀   |
| 同时支持约定式前端路由和声明式前端路由                            | 🚀   |
| React 场景下 All in JSX，Vue 场景 All in template，没有传统模版引擎，所有部分包括 html layout 布局皆使用 JSX/Vue 来编写生成            | 🚀   |
| 同时支持三种渲染模式，提供服务端渲染一键降级为客户端渲染的能力                           | 🚀   |
| 统一不同框架服务端客户端的数据获取方式，做到高度复用                                 | 🚀   |
| 类型友好，全面拥抱 TS                                | 🚀   |
| 支持无缝接入 [antd](https://github.com/ant-design/ant-design) [vant](https://vant-contrib.gitee.io/vant/#/) 无需修改任何配置                             | 🚀   |
| 支持使用 less 作为 css 预处理器                                                | 🚀   |
| 实现 React/Vue SSR 场景下的 [优秀代码分割方案](https://zhuanlan.zhihu.com/p/343743374) 首屏性能做到极致                  |    🚀  |
| React 场景下使用 useContext + useReducer 实现极简的[数据管理](./features$communication#React%20场景)方案，摒弃传统的 `redux/dva` 等数据管理方案                         |    🚀  |
| Vue3 场景提供 [Provide/Inject](./features$communication#Vue%20场景解决方案) 代替 Vuex 进行跨组件通信                     |    🚀  |
| 支持在阿里云 [云平台](https://zhuanlan.zhihu.com/p/139210473)创建使用          | 🚀     |
| ssr deploy 一键部署到[阿里云](https://www.aliyun.com/)平台           | 🚀   |
| ssr deploy --tencent 无需修改任何配置一键部署到[腾讯云](https://cloud.tencent.com/)平台                                   | 🚀                                |

## 哪些应用在使用

正在使用这个项目的公司(应用), 如果您正在使用但名单中没有列出来的话请提 [issue](https://github.com/ykfe/ssr/issues)，欢迎推广分享，我们将随时提供技术支持。事实上本文档的源代码便是使用本框架的 [vue3 + vite + provide/inject]() 编写的。

<table>
<tr>
<td align="center"><a target="_blank" href="http://youku.com/"><img src="https://img.alicdn.com/tfs/TB17DTuXkH0gK0jSZPiXXavapXa-680-133.svg" width="100px;"/><br />
 <sub><b>优酷视频
</b></td>
<td align="center"><a target="_blank" href="https://yulebao.alibaba.com/"><img src="https://gw.alicdn.com/tfs/TB1CmlIIFT7gK0jSZFpXXaTkpXa-190-46.png" width="100px;"/><br><sub><b>阿里影业娱乐宝
</b></sub></a></td>
<td align="center"><a target="_blank" href="https://campaign.vmate.com/vrbollywood"><img src="https://img.alicdn.com/tfs/TB17p6Vhbj1gK0jSZFOXXc7GpXa-512-512.png" width="100px;" alt="vmate 积分商城"/><br />
  <a target="_blank" href="https://job.alibaba.com/zhaopin/position_detail.htm?trace=qrcode_share&positionCode=GP524819"><sub><b>Vmate短视频
</b></a></td>
<td align="center"><a target="_blank" href="https://enjoysales.paat.com/"><img src="https://img.alicdn.com/tfs/TB1Ma0BiEY1gK0jSZFMXXaWcVXa-836-836.png" width="100px;" alt="火炽星原CRM"/><br />
<a target="_blank" href="https://enjoysales.paat.com/"><sub><b>火炽星原CRM
</b></a></td>
<td align="center"><a href="https://www.niuniuda.com/mall" target="_blank"><img src="https://img.alicdn.com/tfs/TB1df_8pBr0gK0jSZFnXXbRRXXa-160-60.png" width="100px;" alt="牛牛搭"/><br />
<a href="https://www.niuniuda.com/mall" target="_blank"><sub><b>牛牛搭
</b></a></td>
<td align="center"><a href="https://help.seewo.com/" target="_blank"><img src="https://img.alicdn.com/tfs/TB11Xo3q4v1gK0jSZFFXXb0sXXa-350-55.png" width="100px;" alt="cvte"/><br /><a href="https://help.seewo.com/" target="_blank"><sub><b>希沃帮助中心
</b></a></td>
<td align="center"><a href="https://wecard.qq.com/index/" target="_blank"><img src="https://img.alicdn.com/tfs/TB1pTZGrFT7gK0jSZFpXXaTkpXa-164-164.jpg" width="100px;" alt="腾讯微卡"/><br />
<a href="https://wecard.qq.com/index/" target="_blank"><sub><b>腾讯微卡
</b></a></td>
<td align="center"><a href="https://www.myweimai.com/#sectionOne" target="_blank"><img src="https://img.alicdn.com/tfs/TB16i3VrQT2gK0jSZPcXXcKkpXa-400-400.jpg" width="100px;" alt="微脉"/><br />
<a href="https://www.myweimai.com/#sectionOne" target="_bvlank"><sub><b>微脉
</b></a></td>
</tr>
<tr>
<td align="center"><a href="https://syzs.qq.com/" target="_blank"><img src="https://res.wx.qq.com/op_res/X1jdQAm4Xihf8fBxzoibB3aX6w4n_Km5g1GZ-ZQavJ-4m10Z3-gw0cukUfRwTDePFi5NBCsY7XYBlnVaXwgT2g
" width="100px;" alt="腾讯手游助手"/><br />
<a href="https://syzs.qq.com/" target="_bvlank"><sub><b>腾讯手游助手
</b></a></td>
<td align="center"><a href="https://kcmall.b2bwings.com/home" target="_blank"><img src="https://img.alicdn.com/imgextra/i1/O1CN01P7CAop1h7qQ3noefa_!!6000000004231-2-tps-211-79.png" width="100px;" alt="国家现代农业科技创新中心"/><br />
<a href="https://kcmall.b2bwings.com/home" target="_bvlank"><sub><b>国家现代农业科技创新中心
</b></a></td>
<td align="center"><a target="_blank" href="http://ssr-fc.com/"><img src="https://img.alicdn.com/tfs/TB13DzOjXP7gK0jSZFjXXc5aXXa-212-48.png" width="100px;"/><br><sub><b>部署于阿里云示例应用
</b></sub></a></td>
<td align="center"><a target="_blank" href="http://tx.ssr-fc.com/"><img src="http://s0.60logo.com/uploads/items/images/soft/180126/tengxunyun.svg" width="100px;"/><br><sub><b>部署于腾讯云示例应用
</b></sub></a></td>
<td align="center"><a href="https://www.gszq.com/" target="_blank"><img src="https://www.gszq.com/static/media/icon-slogan.4d1c7974.png
" width="100px;" alt="国盛证券"/><br />
<a href="https://www.gszq.com/" target="_bvlank"><sub><b>国盛证券
</b></a></td>
<td align="center"><a href="https://m.isle.org.cn" target="_blank"><img src="https://res.wx.qq.com/op_res/qzBjcpT1AZDopDDkEJfj5gKFADotYHTgD33lz9xvZUIj7VJaIR_8HE4lfOxwaiYBgi4V2xXm0xLmAcdQxF4IrQ" width="100px;" alt="三易科技"/><br />
<a href="https://m.isle.org.cn" target="_bvlank"><sub><b>三易科技
</b></a></td>
<td align="center"><a href="https://www.66tools.com/" target="_blank"><img src="https://cdn.66tools.com/extension/chrome_qrcode_avatar.png" width="100px;" alt="极速二维码"/><br />
<a href="https://www.66tools.com/" target="_bvlank"><sub><b>极速二维码
</b></a></td>
<td align="center"><a href="https://www.100.com/" target="_blank"><img src="https://oss.bs2dl.100.com/hippo/config/f13ee98cfca7ce13888752c1261081b44bd356fd.png" width="100px;" alt="100教育"/><br />
<a href="https://www.100.com/" target="_bvlank"><sub><b>100教育
</b></a></td>
</tr>
<tr>
<td align="center" height="100px"><a href="https://m.film.qq.com/x/tva-vip-center/" target="_blank"><img src="https://res.wx.qq.com/op_res/x7sWI9AfUK1QwH0EDhKp4e_bGWxYOQ_1RlZqBFy9JntJzaE4aRzNhVgmxLNloAFpSQ-mBr9X9pux3QlV9QHHvQ" width="100px;margin: 20px 0" alt="腾讯视频"/><br />
<a href="https://m.film.qq.com/x/tva-vip-center/" target="_bvlank"><b>腾讯视频
</b></a></td>
</tr>
</table>

## 方案对比

与其他方案的对比无疑是难写的但同时也是重要的。在保持谦虚的同时，我们也希望能够尽可能的展现出其他类型解决方案的不足。即使它们的 `star` 数量看起来非常多并不意味着这些方案 "好用"。事实上它们的问题实在是太多了。让开发者能够清晰的了解不同解决方案的差别在哪里。由于所有框架都是在不断更新当中如果你注意到一个不准确或似乎不太正确的地方，请提[issue](https://github.com/ykfe/ssr/issues)。

客观来说，作为项目核心团队成员，我们认为 `ssr` 框架是同类型解决方案中最优秀的能够解决非常多其他框架的问题，否则在一开始就不会去创建本项目。 目前 `ssr` 框架的历史使用者人数已经超过几千人，在统计了交流群的反馈后，我们十分有信心认为 `ssr` 框架是要优于同类型的任何解决方案的。有不少开发者是在使用过其他类型的方案后踩了无数的坑最终选择了 `ssr` 框架。或者直接应用从其他框架重构为 `ssr` 框架

无论是 `Next.js` 还是 `Nuxt.js` 还是其他类型的解决方案，它们仅仅是 `React`, `Vue` 的上层封装并不是一个崭新的前端框架。然而这些解决方案的上层封装的复杂度无比庞大，并且新造了很多概念很多新模块。我认为这非常的 `dirty` 并且割裂了与原框架社区的联系。

与 `egg-react-ssr` 相比，我们最新的版本在此基础之上又做了许多优化将会在本文档进行讲述。包括插件化的改造以及支持 `Vite` 作为构建工具，优化核心渲染逻辑等等。相比于 `Next/Nuxt` 的一堆 [issue](https://github.com/vercel/next.js/issues)， 当你深度使用本框架时你会发现你几乎不会遇到什么问题。无论如何，仔细阅读本文档，你会对服务端渲染应用有更加深度的认知。

以下简单介绍一下比较显著的优点。事实上还有更多的优点没有足够的篇幅介绍需要开发者去发掘

### 完美适配 Serverless

优先考虑 `Serverless`，我们为应用在 `Serverless` 场景使用做了诸多优化包括内置发布命令一键发布到多个平台，以及对 `Serverless` 场景下的代码包大小优化，事实上本文档的源代码便是直接用本框架进行开发以及部署的

### 优秀的依赖分离

正如 [README.md](https://github.com/ykfe/ssr#%E7%94%9F%E6%80%81%E7%B3%BB%E7%BB%9F) 介绍的生态系统。之所以需要划分出这么多的 `npm` 包是为了

- 支持所有框架场景的使用
- 分离开发环境依赖和生产环境依赖，保证生产环境安装的依赖最小。事实上生产环境只依赖 `core` 模块

### 简单优秀的代码预加载逻辑

我们不依赖 `vue-server-renderer/client-plugin` 来生成构建清单，也不需要 `vue-renderer` 提供的 `preload` 逻辑。它内置的逻辑过于复杂并且依赖 `vue-loader` 与框架强绑定无法直接在 `React` 场景下使用，`ssr` 框架自身实现了非常简单优秀的异步 `chunk` 预加载逻辑兼容所有前端框架场景，防止页面出现 `css` 闪烁问题。

### 代码轻量

单框架场景核心源代码 2400 行 vs Next.js 18w 行 vs Nuxt.js 2w 行，简洁的核心代码意味着更少的黑盒以及更少的性能损耗，事实上我们的性能等于直接调用框架提供的原生 API 无任何中间层

### 不内置服务端模块

无论是 `nuxt` 还是 `next`, 它们都内置了非常简单的 `http server`, 用于生产环境的服务启动。但真实应用我们是不可能使用这些框架内置的 `http server` 而是会单独创建 `Node.js` 服务端框架来启动服务。而无论是 `nuxt` 还是 `next` 与 `Node.js` 框架的结合都非常不优雅无论是 `koa` 还是 `express`。你都必须要将请求经过它们提供的 `中间件` 或者 `handler` 来处理，这是非常黑盒并且 `dirty` 的开发者完全不知道它们干了什么。事实上绝大多数开发者的困惑都在此处。而 `ssr` 框架默认提供的示例就是与业界最优秀的两个 `Node.js` 框架的示例结合。无需开发者手动整合前端框架与服务端框架。且 `ssr` 框架仅抛出一个逻辑非常清晰的渲染函数供服务端框架调用，兼容 `koa`, `express` 系的所有框架

### 支持三种渲染模式

支持服务端渲染与客户端渲染两种模式任意切换。随时安全降级。同时支持生成 `html` 文件独立部署也是同类型框架中`唯一`同时实现了三种功能的方案

### 支持所有主流前端框架

支持任意主流前端框架。也是目前市面上 `唯一很好` 支持 `Vue3 SSR` 的框架，事实上 `Nuxt` 团队在经历一年左右的时间后仍没有 `Vue3` 的相关解决方案完成参考[issue](https://github.com/nuxt/nuxt.js/issues/5708)。而得益于 `ssr` 框架的优秀设计，实现 `Vue3` 插件只花了 10天。

### 没有新概念

没有新造任何概念没有 `next/head`, `next/link`, `next/router`, `vue-meta` 这些完全没有必要出现的库。在 `Next.js` 中，它自己实现了 `next/router` 以及 `link` 等路由能力并且其中内置了数据获取逻辑。我认为这是非常 `dirty` 的做法，这样的做法割裂了 `Next.js` 社区与 `React` 社区让内在的逻辑完全变成黑盒。事实上在 `ssr` 框架中我们的路由功能直接使用 `react-router` 来实现。

### 同时支持 Vite/Webpack

最轻量级的方式支持 [Vite](./features$vite), 得益于 `ssr` 框架的优秀设计，`ssr` 框架只花了两周时间便在所有框架场景都接入了 `Vite`，而 `Next`, `Nuxt` 团队至今无相关方案。

### 轻松 Debug

没有恶心的 `.next`, `.nuxt` 这种隐藏文件夹包含着几万行通过 `模版渲染/Webpack` 打包出来的可读性极差的代码，当你的应用出错时，你几乎无法从这些隐藏文件中获得任何有效信息，在 `ssr` 框架中我们可以通过 `sourcemap` 来定位 服务端/客户端 构建文件的错误。同时我们默认生成的 服务端构建文件非常的小，只包含业务组件代码，保留了一定的可读性

### 更优秀的数据获取方案

在静态方法的基础上更进一步抽象出 `fetch.ts` 文件定义数据获取逻辑。区分 `layout fetch` 与 `page fetch` 使得开发者更好的管理通用数据和页面独立数据。参见[文档](./features$fetch)

### 更加轻量的数据管理方案

支持 `vuex` 作为数据管理的同时提供了更加轻量级的 `provide/inject`, `props.fetchData` 等数据获取方案。参见[文档](./features$communication)

### 支持多种前端路由模式

我们同时支持约定式路由和声明式路由两种模式，可以任意选择
### 内置常见流行 UI 框架构建配置

接地气，`ssr` 框架契合实际业务开发。在服务端渲染场景使用 `UI 框架`是一件非常不简单的事情，我们内置对流行的 UI 框架 `ant-design` `vant` 的配置支持。无需用户做额外配置可直接安装使用

### 没有模版引擎

没有传统模版引擎，多数开发者是都十分厌恶使用传统模版引擎且需要引入额外的库和学习成本。我们没有使用类似于 `nunjucks` `ejs` 这种模版引擎，根据场景 `All in JSX` 或者 `Vue SFC` 来编写 html 布局

### 本地开发生产环境行为统一

在本地开发和生产环境我们的所有行为都是完全一致的。包括在样式处理方面我们没有 `style-loader`，不存在本地开发使用 `style` 标签，线上环境使用独立 css 文件这种开发体验割裂的情况。我们统一使用独立的 `css` 文件且支持 `HMR` 和动态加载

### 所有场景风格统一

风格统一，无论是 `React/Vue2/Vue3` 运行的本质始终都是 `js`，我们在这些场景的 SSR 实现思路一模一样，实现代码的高度复用，使用本框架无论是从 `React` 切换成 `Vue` 或者反过来都十分轻易

### 功能丰富

功能丰富，UI 框架、代码分割、HMR、TS、Serverless、SSR 降级 CSR 开发所需要的功能应有尽有
### 默认示例丰富

我们不提供 `hello world` 级别的示例。这对开发者没有任何帮助。默认创建的示例 cover 大多数真实线上应用场景，包含 服务端框架选择、前端调用 Node.js 接口的方式、前端页面路由跳转的数据获取，应用部署等所有功能用例在 `example` 中都有体现。我们拥有丰富的线上大规模 SSR 应用开发经验，用户使用过程中遇到的任何问题都有策略解决。

### 完备的问题解决方案

我们搜集了最常见的问题在 [FAQ](./features$faq) 中，开发者可以找到任何问题的答案

### 高性能

没有 [runInNewContext](http://nodejs.cn/api/vm.html#vm_script_runinnewcontext_contextobject_options)，我们不像其他框架的做法一样使用 vm 模块创建上下文来解析服务端 bundle，所以我们的性能是极高的。等于直接调用框架提供的原生 API 无任何中间层损耗

### 不基于 vue-server-renderer

目前业界几乎所有与 `VueSSR` 有关的框架底层本质都是使用了官方的[vue-server-renderer](https://www.npmjs.com/package/vue-server-renderer) 提供的 `createBundleRenderer` 来进行核心渲染逻辑。这会有很多问题

- `createBundleRenderer` 内部的逻辑对使用者和框架开发者来说完全是黑盒
- `createBundleRenderer` 强耦合 `vm` 模块。无论怎么配置 `runInNewContext` 选项都会使用 `vm` 模块来解析 `js`
- `createBundleRenderer` 内部的异步依赖收集逻辑过于复杂。且与 `vue-loader` 强耦合。并且 `Vue3` 版本官方的 `createBundleRenderer` 尚未出现。也就是在 `Vue3/React` 场景这块方案是用不了的
- 强耦合 `vue-server-renderer/client-plugin`, 异步依赖收集前必须首先使用该 `Webpack` 插件构建出模块信息资源清单

事实上在 `ssr` 框架内部我们实现了一个非常轻量级可以在所有前端框架场景适用的异步模块收集过程和渲染器。