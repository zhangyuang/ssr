<h1 align="center"> SSR </h1>
<div align="center">
  <img src="https://gw.alicdn.com/tfs/TB1ckATCGL7gK0jSZFBXXXZZpXa-540-540.jpg" width="300" />
</div>
<br />

<div align="center">
  <strong>A most advanced ssr framework on Earth that implemented serverless-side render specification for faas and traditional web server.</strong>
</div>
<br />
<div align="center">
<a href="https://github.com/ykfe/ssr/actions" target="_blank"><img src="https://github.com/ykfe/ssr/workflows/CI/badge.svg" alt="githubActions"></a>
<a href="https://www.cypress.io/" target="_blank"><img src="https://img.shields.io/badge/cypress-dashboard-brightgreen.svg" alt="cypress"></a>
<a href="https://npmcharts.com/compare/ssr" target="_blank"><img src="https://img.shields.io/npm/dt/ssr" alt="download"></a>
<a href="https://standardjs.com" target="_blank"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="standardjs"></a>
<a href="https://github.com/ykfe/ssr" target="_blank"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>
<a href="https://github.com/ykfe/ssr" target="_blank"><img src="https://img.shields.io/badge/node-%3E=12-green.svg" alt="Node"></a>
</div>
<br />

`ssr` 框架是为前端框架在服务端渲染的场景下所打造的开箱即用的服务端渲染框架。

此框架脱胎于 [egg-react-ssr](https://github.com/ykfe/egg-react-ssr) 项目和`ssr` v4.3版本（midway-faas + react ssr），在之前的基础上做了诸多演进，通过插件化的代码组织形式，支持任意服务端框架与任意前端框架的组合使用。开发者可以选择通过 Serverless 方式部署或是以传统 Node.js 的应用形式部署，并且我们专注于提升 Serverless 场景下服务端渲染应用的开发体验，打造了一站式的开发，发布应用服务的功能。最大程度提升开发者的开发体验，将应用的开发，部署成本降到最低。

在最新的 v5.0 版本中，同时支持 `React` 和 `Vue2/Vue3` 作为服务端渲染框架且构建工具我们同样支持了最流行的 Vite 来提升应用的启动速度和 HMR 速度，且提供一键以 Serverless 的形式发布上云的功能。我们可以非常有自信说它是地球上最先进的ssr框架。如果你希望获得开箱即用的体验且能够一键部署上云，请选择 `ssr` 框架。

阅读我们的 [官方文档](http://doc.ssr-fc.com/) 获得更加详细的了解

![](https://res.wx.qq.com/op_res/IPTwJ0ZUuJ_0XicnAcpUXIjFGjmggiw-LgZZfvHsxlRpdfgeWQ3yqZ0CqEA4Zs1WMcINsLSDT9zBXv1gYElYkg)

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
<td align="center"><a href="https://syzs.qq.com/" target="_blank"><img src="images/syzs.png" width="100px;" alt="腾讯手游助手"/><br />
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

## 线上案例

通过访问以下链接来预览该框架通过 Serverless 一键部署到阿里云/腾讯云服务的应用详情。  
通过使用 queryParams `csr=true` 来让 SSR 服务端渲染模式一键降级为 CSR 客户端渲染模式，也可以通过 `config.js` 来进行配置。

- http://ssr-fc.com/ 部署到阿里云的 React SSR 应用
- http://ssr-fc.com?csr=true 部署到阿里云的 React SSR 应用, 以 CSR 模式访问
- http://tx.ssr-fc.com 部署到腾讯云的 React SSR 应用
- http://tx.ssr-fc.com?csr=true 部署到腾讯云的 React SSR 应用, 以 CSR 模式访问
- http://vue.ssr-fc.com 部署到阿里云的 Vue SSR 应用
- http://vue3.ssr-fc.com 部署到阿里云的 Vue3 SSR 应用
- http://vue.ssr-fc.com?csr=true 部署到阿里云的 Vue SSR 应用, 以 CSR 模式访问
- http://vue3.ssr-fc.com?csr=true 部署到阿里云的 Vue3 SSR 应用, 以 CSR 模式访问

## CONTRIBUTING

如果你想为本应用贡献代码，请阅读[贡献文档](./CONTRIBUTING.md)，我们为你准备了丰富的脚本用于 bootstrap

## License

[MIT](LICENSE)

## 答疑群

虽然我们已经尽力检查了一遍应用，但仍有可能有疏漏的地方，如果你在使用过程中发现任何问题或者建议，欢迎提[issue](https://github.com/ykfe/ssr/issues)或者[PR](https://github.com/ykfe/ssr/pulls)
欢迎直接扫码加入钉钉群
<img src="https://res.wx.qq.com/op_res/rrhdxU0o2yUdgTjwgkAgO-CSFV-lArvMYzWzxl2SuvnKkcWECv7SXswEYjk2pPcDcL43r0kz_MIp_fsxPPqQ2Q" width="300">

## 项目 Star 数增长趋势

[![Stargazers over time](https://starchart.cc/ykfe/ssr.svg)](https://starchart.cc/ykfe/ssr)
