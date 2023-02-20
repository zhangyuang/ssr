<div>
<a href="./README.md">简体中文</a> ｜ English
</div>
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
<a href="https://github.com/zhangyuang/ssr/actions" target="_blank"><img src="https://github.com/zhangyuang/ssr/workflows/CI/badge.svg" alt="githubActions"></a>
<a href="https://www.cypress.io/" target="_blank"><img src="https://img.shields.io/badge/cypress-dashboard-brightgreen.svg" alt="cypress"></a>
<a href="https://npmcharts.com/compare/ssr" target="_blank"><img src="https://img.shields.io/npm/dm/ssr" alt="download"></a>
<a href="https://standardjs.com" target="_blank"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="standardjs"></a>
<a href="https://github.com/zhangyuang/ssr" target="_blank"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>
<a href="https://github.com/zhangyuang/ssr" target="_blank"><img src="https://img.shields.io/badge/node-%3E=12-green.svg" alt="Node"></a>
</div>
<br />

`ssr` is an out-of-the-box server side rendering framework, building for frontend framework in Serverless scene. 


This framework originated from [egg-react-ssr](https://github.com/zhangyuang/egg-react-ssr) and `ssr` v4.3( midway-faas + react ssr), making a lot of evolution compared with the previous version. Through plugin-in code components, it supports the combination of any backend framework and any frontend framework. Developers can deploy applications through either  serverless or traditional Node.js. We focus on improving the development experiences of ssr applications and building a one-stop framework for development and deployment, which can also greatly reduce the costs for development and deployment. 


In the latest v5.0, the framkework supports `React` and `Vue2/Vue3` as server side rendering framework and `Vite` to improve the application's startup speed and HMR speed. It also provides one-click deployment to Serverless Cloud Function. With great confidence, we can say that it is the most advanced ssr framework on Earth. If you wish to get an out-of-the-box experience and on-click deployment, please use the `ssr` framework. 

Read out [Document](http://doc.ssr-fc.com/) to get a more detailed understanding. Actually the Document is developed with the `ssr` framework and deployed to AliCloud through `Serverless`. 

![](https://res.wx.qq.com/op_res/B9tJE-lFR3gCif92sM4BeeqAcoJSZbJK-auM7MACgomrWm58C1moA3BfatZ5gS-tgZHYyk57e0JQRtgdcgho-g)

## Used by

`ssr` is currently used by the following companies(applications). If you are using but not listed below, please have an [issue](https://github.com/zhangyuang/ssr/issues). Welcome to promote this framework, we will provide technical support at any time. 

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
</table>

## Features

- 🌱　Easy to customize: support modern frontend frameworks such as React/Vue2/Vue3. 
- 🚀　Out-of-the-box: 10+ built-in cli tools such as AntD、Vant、TS、Hooks. 
- 🧲　Plug-in components: based on plugin-in architecture, users are more focused on business logic. 
- 💯　Serverless first: one-click deployment to various Serverless platforms, also support traditional web server like Egg、Midway、Nest. 
- 🛡　High availability: seamless degradation from SSR to CSR, the best disaster recovery plan. 
- 😄　Rich functions: support building tools such as Webpack、Vite. 

## Already implemented

🚀 means functions already implemented

| milestone                                                                 | status |
| ---------------------------------------------------------------------- | ---- |
| Support the combination of any backend and frontend framework. (Serverless/Midway/NestJS) + (React/Vue2/Vue3)             | 🚀   |
| Support [vite](https://vite-design.surge.sh/) as building tool in SSR scene [how to use](#使用Vite作为构建工具) |  🚀    |
| Inplement server side rendering function lightly and beautifully                            | 🚀   |
| Restrict code package size in Serverless scene, minimize it of production environment            | 🚀   |
| support both conventional routing and declarative routing                             | 🚀   |
| React: All in JSX, Vue: All in template. No traditional template engine, All parts(including html layout) are generated using JSX / Vue            | 🚀   |
| Rendering mode switch: seamless degradation from SSR to CSR                        | 🚀   |
| Highly reusable: Unify the data acquisition methods of different frameworks                                 | 🚀   |
| Type friendly: Full use of TypeScript                                | 🚀   |
| Seamless access to [antd](https://github.com/ant-design/ant-design) [vant](https://vant-contrib.gitee.io/vant/#/) No configuration changes are required                             | 🚀   |
| Less is supported as CSS preprocessor                                                | 🚀   |
| Support [Code Segmentation scheme](https://zhuanlan.zhihu.com/p/343743374) in React/Vue SSR. Excellent first page perfomance                |    🚀  |
| Use useContext + useReducer in React to implement minimal [data management](#React跨组件通信), instead of traditional methods like redux/dva                         |    🚀  |
| Provide [Provide/Inject](#provideinject代替vuex) for cross component communication in Vue3, instead of Vuex                 |    🚀  |
| Support usage in [AliCloud](https://zhuanlan.zhihu.com/p/139210473)          | 🚀     |
| `ssr deploy` one-click deployment to [AliCloud](https://www.aliyun.com/)           | 🚀   |
| `ssr deploy --tencent` one-click deployment to[Tencent Cloud](https://cloud.tencent.com/) without any configuration                                   | 🚀                                |


## Quick start

We provide [create-ssr-app](https://github.com/zhangyuang/create-ssr-app) cli. Users can quickly create different types of applications. 

Now we provide the following templates to developers. You choose any one according to your own technology stack. 

Although the technologies are different, the development ideas are consistent. In any combination of technology stacks, our development commands, construction commands and rendering principles are completely consistent. 

Note: We provide one-click deployment to `Serverless` platform in both `Midway.js` and `Nest.js` but the underlying implementation is slightly different. For more details please read [Serverless](http://doc.ssr-fc.com/docs/features$serverless). If you need to make extensive use of the capabilities provided by the framework, we recommend creating an application of type 'middle.js'. Reading our [Document](http://doc.ssr-fc.com/) is strongly recommended to get a more detailed understanding. 

- [nestjs-react-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/nestjs-react-ssr)
- [nestjs-react18-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/nestjs-react18-ssr)
- [nestjs-vue-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/nestjs-vue-ssr)
- [nestjs-vue3-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/nestjs-vue3-ssr)
- [nestjs-vue3-ssr-pinia](https://github.com/zhangyuang/nestjs-vue3-ssr-pinia)
- [midway-react-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/midway-react-ssr)
- [midway-react18-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/midway-react18-ssr)
- [midway-vue-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/midway-vue-ssr)
- [midway-vue3-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/midway-vue3-ssr)

Developers can create different types of applications according to the actual technology stack to start quickly. 

### Create project

We can create any of the above templates using `npm init`

```bash
$ npm init ssr-app my-ssr-project
$ cd my-ssr-project
$ npm install # don't use cnpm
$ npm start
$ open http://localhost:3000 # Access the app
$ npm run build # Resource construction, equivalent to npx ssr build
$ npm run start:vite # Start in Vite mode，equivalent to npx ssr start --vite
```

![](http://doc.ssr-fc.com/images/resume3.svg)

## Online cases

Check the links below to preview Serverless applications which are deployed using this framework to AliCloud/TencentCloud. 
Use queryParams `csr=true` to degrade from SSR to CSR, also can be configured through `config.js`. 

- http://ssr-fc.com/ React SSR App in AliCloud
- http://ssr-fc.com?csr=true React SSR App in AliCloud, CSR mode
- http://tx.ssr-fc.com React SSR App in TencentCloud
- http://tx.ssr-fc.com?csr=true React SSR App in TencentCloud, CSR mode
- http://vue.ssr-fc.com Vue SSR App in AliCloud
- http://vue3.ssr-fc.com Vue3 SSR App in AliCloud
- http://vue.ssr-fc.com?csr=true Vue SSR App in AliCloud, CSR mode
- http://vue3.ssr-fc.com?csr=true Vue3 SSR App in AliCloud, CSR mode

## Ecosystem

| Project | Status | Description |
|---------|--------|-------------|
| [ssr]          | [![ssr-status]][ssr] | cli for ssr framework |
| [ssr-core]          | [![ssr-core-]][ssr-core] | core render for all framework |
| [ssr-plugin-midway]          | [![ssr-plugin-midway-status]][ssr-plugin-midway] | provide start and build fetature by [midway@2.0](https://midwayjs.org/) |
| [ssr-plugin-nestjs]          | [![ssr-plugin-nestjs-status]][ssr-plugin-nestjs] | provide start and build feature by [NestJS](https://docs.nestjs.com/) |
| [ssr-plugin-react]          | [![ssr-plugin-react-status]][ssr-plugin-react] | develop react application only be used in development |
| [ssr-plugin-vue]          | [![ssr-plugin-vue-status]][ssr-plugin-vue] | develop vue2 application only be used in development |
| [ssr-plugin-vue3]          | [![ssr-plugin-vue3-status]][ssr-plugin-vue3] | develop vue3 application only be used in development |
| [ssr-server-utils]          | [![ssr-server-utils-status]][ssr-server-utils] | server utils in Node.js environment |
| [ssr-client-utils]          | [![ssr-client-utils-status]][ssr-client-utils] | client utils in browser environment |
| [ssr-hoc-react]          | [![ssr-hoc-react-status]][ssr-hoc-react] | provide hoc component for react |
| [ssr-hoc-vue3]          | [![ssr-hoc-vue3-status]][ssr-hoc-vue3] | provide hoc component for vue3 |
| [ssr-types]          | [![ssr-types-status]][ssr-types] | provide common types |
| [ssr-webpack]          | [![ssr-webpack-status]][ssr-webpack] | start local server and build production bundle by webpack |


[ssr-status]: https://img.shields.io/npm/v/ssr.svg
[ssr-client-utils-status]: https://img.shields.io/npm/v/ssr-client-utils.svg
[ssr-core-status]: https://img.shields.io/npm/v/ssr-core.svg
[ssr-hoc-react-status]: https://img.shields.io/npm/v/ssr-hoc-react.svg
[ssr-hoc-vue3-status]: https://img.shields.io/npm/v/ssr-hoc-vue3.svg
[ssr-plugin-midway-status]: https://img.shields.io/npm/v/ssr-plugin-midway.svg
[ssr-plugin-nestjs-status]: https://img.shields.io/npm/v/ssr-plugin-nestjs.svg
[ssr-plugin-react-status]: https://img.shields.io/npm/v/ssr-plugin-react.svg
[ssr-plugin-vue-status]: https://img.shields.io/npm/v/ssr-plugin-vue.svg
[ssr-plugin-vue3-status]: https://img.shields.io/npm/v/ssr-plugin-vue3.svg
[ssr-server-utils-status]: https://img.shields.io/npm/v/ssr-server-utils.svg
[ssr-types-status]: https://img.shields.io/npm/v/ssr-types.svg
[ssr-webpack-status]: https://img.shields.io/npm/v/ssr-webpack.svg

[ssr]: https://github.com/zhangyuang/ssr/tree/dev/packages/cli
[ssr-client-utils]: https://github.com/zhangyuang/ssr/tree/dev/packages/client-utils
[ssr-core]: https://github.com/zhangyuang/ssr/tree/dev/packages/core
[ssr-hoc-react]: https://github.com/zhangyuang/ssr/tree/dev/packages/hoc-react
[ssr-hoc-vue3]: https://github.com/zhangyuang/ssr/tree/dev/packages/hoc-vue3
[ssr-plugin-midway]: https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-midway
[ssr-plugin-nestjs]: https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-nestjs
[ssr-plugin-react]: https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-react
[ssr-plugin-vue]: https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-vue
[ssr-plugin-vue3]: https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-vue3
[ssr-server-utils]: https://github.com/zhangyuang/ssr/tree/dev/packages/server-utils
[ssr-types]: https://github.com/zhangyuang/ssr/tree/dev/packages/types
[ssr-webpack]: https://github.com/zhangyuang/ssr/tree/dev/packages/webpack

## CONTRIBUTING

If you want to contribute code to this project, please read [contributing](./CONTRIBUTING.md), we have rich scripts for you to bootstrap. 

## License

[MIT](LICENSE)

## Q & A group

Although we have tried our best to check the application, there may still be some omissions. If you find any problems or suggestions during use, welcome to give [issue](https://github.com/zhangyuang/ssr/issues) or [PR](https://github.com/zhangyuang/ssr/pulls). 
Welcome to scan the code to join DingDing group or WeChat group

<div style="display:flex">
<img src="https://res.wx.qq.com/op_res/7F1t4Z8yCHWilehbcFGjAj0yVn0URMiWBGVJa-TVu_eqw5IwUXA2kPYBnfX6YRHy0FVBB-yC6l0IEL02QTJkLg" width="300">
<img src="https://res.wx.qq.com/op_res/HoE46nyluxRmnuShyOHY-qb62H29FUnwEEfThhkfkjKLHC45WQ8keUiFAia2vkmRj63gkc4rtiMr8k5pb3h3gQ" width="300">
</div>

## Stars

[![Stargazers over time](https://starchart.cc/zhangyuang/ssr.svg)](https://starchart.cc/zhangyuang/ssr)
