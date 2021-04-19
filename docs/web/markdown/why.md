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

`ssr` 框架是为前端框架在服务端渲染的场景下所打造的开箱即用的服务端渲染框架。

此框架脱胎于 [egg-react-ssr](https://github.com/ykfe/egg-react-ssr) 项目和 `ssr` v4.3版本（midway-faas + react ssr），在之前的基础上做了诸多演进，通过插件化的代码组织形式，支持任意服务端框架与任意前端框架的组合使用。开发者可以选择通过 Serverless 方式部署或是以传统 Node.js 的应用形式部署，并且我们专注于提升 Serverless 场景下服务端渲染应用的开发体验，打造了一站式的开发，发布应用服务的功能。最大程度提升开发者的开发体验，将应用的开发，部署成本降到最低。

在最新的 v5.0 版本中，同时支持 React 和 Vue2/Vue3 作为服务端渲染框架且构建工具我们同样支持了最流行的 Vite 来提升应用的启动速度和 HMR 速度，且提供一键以 Serverless 的形式发布上云的功能。我们可以非常有自信说它是地球上最先进的ssr框架。如果你希望获得开箱即用的体验且能够一键部署上云，请选择 `ssr` 框架。


## 已实现的功能

🚀 表示已经实现的功能

| 里程碑                                                                 | 状态 |
| ---------------------------------------------------------------------- | ---- |
| 支持任意服务端框架与任意前端框架的组合使用。(Serverless/Midway/Nestjs) + (React/Vue2/Vue3)             | 🚀   |
| 支持 [vite](https://vite-design.surge.sh/) 作为构建工具在 SSR 场景下的组合[使用](#使用Vite作为构建工具) |  🚀    |
| 最小而美的实现服务端渲染功能                           | 🚀   |
| 针对Serverless 场景对代码包的大小的严格限制，将生产环境的代码包大小做到极致            | 🚀   |
| 同时支持约定式前端路由和声明式前端路由                            | 🚀   |
| React 场景下 All in JSX，Vue 场景 All in template，没有传统模版引擎，所有部分包括 html layout 布局皆使用 JSX/Vue 来编写生成            | 🚀   |
| 渲染模式切换：服务端渲染一键降级为客户端渲染                            | 🚀   |
| 统一不同框架服务端客户端的数据获取方式，做到高度复用                                 | 🚀   |
| 类型友好，全面拥抱 TS                                | 🚀   |
| 支持无缝接入 [antd](https://github.com/ant-design/ant-design) [vant](https://vant-contrib.gitee.io/vant/#/) 无需修改任何配置                             | 🚀   |
| 支持使用 less 作为 css 预处理器                                                | 🚀   |
| 实现 React/Vue SSR 场景下的[优秀代码分割方案](https://zhuanlan.zhihu.com/p/343743374) 首屏性能做到极致                  |    🚀  |
| React 场景下使用 useContext + useReducer 实现极简的[数据管理](#React跨组件通信)方案，摒弃传统的 redux/dva 等数据管理方案                         |    🚀  |
| Vue3 场景提供 [Provide/Inject](#provideinject代替vuex) 代替 Vuex 进行跨组件通信                     |    🚀  |
| 支持在阿里云 [云平台](https://zhuanlan.zhihu.com/p/139210473)创建使用          | 🚀     |
| ssr deploy 一键部署到[阿里云](https://www.aliyun.com/)平台           | 🚀   |
| ssr deploy --tencent 无需修改任何配置一键部署到[腾讯云](https://cloud.tencent.com/)平台                                   | 🚀                                |

## 哪些应用在使用

正在使用这个项目的公司(应用), 如果您正在使用但名单中没有列出来的话请提 [issue](https://github.com/ykfe/ssr/issues)，欢迎推广分享，我们将随时提供技术支持

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
</tr>
</table>

## 方案对比

与 Next.js/Nuxt.js 等框架的对比，详细的代码层面技术细节对比可以查看本人在2020年 [Node.js party 上所做的分享](https://github.com/zhangyuang/2020-NodeParty-PPT)，从以下 9 个技术细节方面与 Next/Nuxt/Easy-team 等等框架的做法进行对比。

以下简单介绍一下比较显著的优点

- 优先考虑 Serverless，我们为应用在 Serverless 场景使用做了诸多优化包括内置发布命令一键发布到多个平台，以及对 Serverless 场景下的代码包大小优化，事实上本文档的源代码便是直接用本框架进行开发以及部署的
- 轻量，核心源代码 2400 行 vs Next.js 18w 行 vs Nuxt.js 2w行，简洁的核心代码意味着更少的黑盒以及更少的性能损耗，事实上我们的性能等于直接调用框架提供的原生 API 无任何中间层
- 最轻量级的方式支持 [Vite](./)
- 没有恶心的 `.next`, `.nuxt` 这种隐藏文件夹包含着几万行通过 模版渲染/Webpack 打包出来的可读性极差的代码，当你的应用出错时，你几乎无法从这些隐藏文件中获得任何有效信息
- 接地气，在 SSR 场景使用 UI 框架是一件不简单的事情，我们内置对世界上最流行的 UI 框架 ant-design 的支持。无需用户做额外配置
- 没有传统模版引擎，多数开发者是都十分厌恶使用传统模版引擎且需要引入额外的库和学习成本。我们没有模版引擎，根据场景 `All in JSX` 或者 `Vue template` 来编写 html 布局
- 没有 `style-loader`，不存在本地开发使用 style 标签，线上环境使用独立 css 文件这种开发体验割裂的情况。我们统一使用独立的 css 文件且支持 HMR 和动态加载
- 风格统一，无论是 React/Vue 运行的本质始终都是 js，我们在两种框架的 SSR 实现思路一模一样，实现代码的高度复用，使用本框架无论是从 React 切换成 Vue 或者反过来都十分轻易
- 功能丰富，UI 框架、代码分割、HMR、TS、Serverless、SSR 降级 CSR 开发所需要的功能应有尽有
- 示例丰富，默认示例 cover 大多数真实线上应用场景，包含 服务端框架选择、前端调用 Node.js 接口的方式、前端页面路由跳转的数据获取，应用部署等所有功能用例在 example 中都有体现。我们拥有丰富的线上大规模 SSR 应用开发经验，用户使用过程中遇到的任何问题都有策略解决。
- 没有 runInNewContext，我们不像其他框架的做法一样使用 vm 模块创建上下文来解析服务端 bundle，所以我们的性能是极高的。