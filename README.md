<div>
<a href="./README_Zh.md">简体中文</a> ｜ English
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
<a href="https://github.com/zhangyuang/ssr/actions" target="_blank"><img src="https://github.com/zhangyuang/ssr/workflows/CI/badge.svg" alt="githubActions" />
<a href="https://www.cypress.io/" target="_blank"><img src="https://img.shields.io/badge/cypress-dashboard-brightgreen.svg" alt="cypress" />
<a href="https://github.com/zhangyuang/ssr" target="_blank"><img src="https://img.shields.io/badge/node-%3E=20-green.svg?color=4dc71f" alt="Node" ></a>
<a href="https://github.com/zhangyuang/ssr" target="_blank"><img src="https://img.shields.io/github/stars/zhangyuang/ssr.svg?color=4dc71f" alt="Node" ></a>
</div>
<br />
 
 
## Version 7.x

The `ssr` framework version `7.x` has been released. Read the [documentation](http://doc.ssr-fc.com/docs/features$v7) for more detailed introduction and upgrade guide. Version 7 brings the following new features:

- Supports [Rspack](https://rspack.rs), [Rolldown-Vite](https://vite.dev/guide/rolldown), and `Webpack` build tools to greatly improve build performance.
- Supports any frontend framework combined with any build tool
- Brand new dependency design, streamlined dependencies required for initialization
- Progressive upgrade with almost no breaking changes, v6 projects can smoothly transition to v7

Version 7 has been tested to improve build speed by 5-10 times. Dependency size reduced by 2/3 (when using Rspack|Rolldown-Vite scenarios).

Use the latest `create-ssr-app` to initialize v7 (recommended) or v6 project templates according to prompts.

```bash
$ npm init ssr-app@latest my-ssr-project
```

## Introduction

The `ssr` framework is an out-of-the-box server-side rendering framework built for frontend frameworks in server-side rendering scenarios. To understand what server-side rendering is, please check the [documentation](http://doc.ssr-fc.com/docs/features$ssr).

This framework evolved from the [egg-react-ssr](https://github.com/zhangyuang/egg-react-ssr) project and `ssr` v4 version `(midway-faas + react ssr)`. Based on previous foundations, it has made many improvements through plugin-based code organization, supporting the combination of any server-side framework with any frontend framework. Developers can choose to deploy via `Serverless` or deploy as traditional `Node.js` applications. We focus on improving the development experience of server-side rendering applications in `Serverless` scenarios, creating one-stop development and application deployment services. This maximizes developer experience while minimizing application development and deployment costs.

In the latest version, it supports `React17/18/19` and `Vue2/Vue3` as frontend frameworks for server-side rendering. For development tools, we support both `Vite|Webpack|Rspack` to improve application startup speed, build speed, and HMR speed.

In the `Node.js` framework, the official default `example` provides integration examples based on `Nest.js` and `Midway.js`, two popular `Node.js` frameworks with the `ssr` framework. Of course, the `ssr` framework is designed not to be coupled with any `Node.js` framework, and developers can freely choose to use any `Node.js` framework.

If you choose `Midway.js` as your `Node.js` framework, you can directly use the built-in `ssr deploy` command to deploy applications to `Alibaba Cloud` or `Tencent Cloud` platforms with one click.

Read our [official documentation](http://doc.ssr-fc.com/) for more detailed understanding. In fact, the documentation itself is developed using the `ssr` framework and deployed to Alibaba Cloud `Serverless` service.

![](https://res.wx.qq.com/op_res/B9tJE-lFR3gCif92sM4BeeqAcoJSZbJK-auM7MACgomrWm58C1moA3BfatZ5gS-tgZHYyk57e0JQRtgdcgho-g)

## When Should You Choose the SSR Framework

- Need to use in scenarios combining `Node.js` with frontend frameworks. Unlike other pure frontend frameworks, the `ssr` framework is specifically built for server-side rendering scenarios or scenarios combining `Node.js` with frontend.
- Need an out-of-the-box server-side rendering capability without manually combining different frontend frameworks with server-side frameworks.
- Need framework-level rendering degradation capability that automatically degrades to client-side rendering when server-side rendering fails.
- Need a framework with simple configuration and clear logic. The `ssr` framework has the clearest rendering logic and application build logic among similar frameworks.
- May change technology stacks, such as upgrading from `Vue2` to `Vue3`, downgrading from `Vue3` to `Vue2`, or switching between `React/Vue`.
- Need out-of-the-box support for popular UI libraries like `antd` and `vant` in server-side rendering scenarios.
- Need to support both `Webpack` and `Vite` development tools to get fast startup speed, HMR speed, and stable production code.
- Need to use [pinia](https://pinia.vuejs.org/) as data management solution in `Vue3 SSR`.
- Simply need a faster and better `cra` or `vue-cli`. The `ssr` framework also provides excellent support in pure `csr` scenarios.

## Who's Using

Companies (applications) currently using this project. If you are using it but not listed, please raise an [issue](https://github.com/zhangyuang/ssr/issues). We welcome promotion and sharing, and will provide technical support at any time.

<table>
<tr>
<td align="center"><a target="_blank" href="http://youku.com/"><img src="https://img.alicdn.com/tfs/TB17DTuXkH0gK0jSZPiXXavapXa-680-133.svg" width="120"/><br />
 <sub><b>优酷视频
</b></td>
<td align="center" style="width: 120px; "><a target="_blank" href="#"><img src="https://wxa-shop-1258344707.cos.ap-shanghai.myqcloud.com/test/cdn/c8e49fda-d8ef-4332-a2c0-8c9e571883f5.jpeg?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDtb4HEuJSLyJNCk11kCNHvIPGp8AvQfdK%26q-sign-time%3D1653378495%3B4294967040%26q-key-time%3D1653378495%3B4294967040%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3D2d09dc5ceec264a030da16b747477adf0ae5b647
" width="120"/><br><sub><b>微信公众平台
</b></sub></a></td>
<td align="center" style="height: 100px"><a href="#" target="_blank"><img src="https://res.wx.qq.com/op_res/wy4vvtyfqW8HjIfBKjba6TNEFBHuAApjJ1FjSQ37OVIdIYtylmiBm2ZeJ79SRtmT4IipU69bDNDw0Rrdnjd9yg
" width="200px; margin: 20px 0" /><br />
<a href="#" target="_bvlank"><b>腾讯体育
</b></a></td>
<td align="center" style="height: 100px"><a href="#" target="_blank"><img src="https://res.wx.qq.com/op_res/qc0sXfbvOvZFKVaDy9OLsqHfwHg6U4AemN2MP6YUxEo0EWpK6RyRcj70bIf3GEg5y_WA1wuv4HcfYi2FP7Awkw
" width="200px; margin: 20px 0" /><br />
<a href="#" target="_bvlank"><b>QQ会员
</b></a></td>
<td align="center" style="height: 100px"><a href="https://m.film.qq.com/x/tva-vip-center/" target="_blank"><img src="https://res.wx.qq.com/op_res/x7sWI9AfUK1QwH0EDhKp4e_bGWxYOQ_1RlZqBFy9JntJzaE4aRzNhVgmxLNloAFpSQ-mBr9X9pux3QlV9QHHvQ" width="200px; margin: 20px 0" /><br />
<a href="https://m.film.qq.com/x/tva-vip-center/" target="_bvlank"><b>腾讯视频
</b></a></td>
<td align="center"><a href="https://www.niuniuda.com/mall" target="_blank"><img src="https://img.alicdn.com/tfs/TB1df_8pBr0gK0jSZFnXXbRRXXa-160-60.png" width="120" alt="牛牛搭"/><br />
<a href="https://www.niuniuda.com/mall" target="_blank"><sub><b>牛牛搭
</b></a></td>
<td align="center"><a href="https://www.gszq.com/" target="_blank"><img src="https://www.gszq.com/static/media/icon-slogan.4d1c7974.png
" width="120"/><br />
<a href="https://www.gszq.com/" target="_bvlank"><sub><b>国盛证券
</b></a></td>
<td align="center"><a href="https://m.isle.org.cn" target="_blank"><img src="https://res.wx.qq.com/op_res/qzBjcpT1AZDopDDkEJfj5gKFADotYHTgD33lz9xvZUIj7VJaIR_8HE4lfOxwaiYBgi4V2xXm0xLmAcdQxF4IrQ" width="120" alt="三易科技"/><br />
<a href="https://m.isle.org.cn" target="_bvlank"><sub><b>三易科技
</b></a></td>
<td align="center"><a href="https://wecard.qq.com/index/" target="_blank"><img src="https://img.alicdn.com/tfs/TB1pTZGrFT7gK0jSZFpXXaTkpXa-164-164.jpg" width="120"/><br />
<a href="https://wecard.qq.com/index/" target="_blank"><sub><b>腾讯微卡
</b></a></td>
</tr>
<tr>
<td align="center"><a href="https://syzs.qq.com/" target="_blank"><img src="images/syzs.png" width="120" alt="腾讯手游助手"/><br />
<a href="https://syzs.qq.com/" target="_bvlank"><sub><b>腾讯手游助手
</b></a></td>
<td align="center"><a href="https://kcmall.b2bwings.com/home" target="_blank"><img src="https://img.alicdn.com/imgextra/i1/O1CN01P7CAop1h7qQ3noefa_!!6000000004231-2-tps-211-79.png" width="120" alt="国家现代农业科技创新中心"/><br />
<a href="https://kcmall.b2bwings.com/home" target="_bvlank"><sub><b>国家现代农业科技创新中心
</b></a></td>
<td align="center"><a target="_blank" href="http://ssr-fc.com/"><img src="https://img.alicdn.com/tfs/TB13DzOjXP7gK0jSZFjXXc5aXXa-212-48.png" width="120"/><br><sub><b>部署于阿里云示例应用
</b></sub></a></td>
<td align="center"><a target="_blank" href="http://tx.ssr-fc.com/"><img src="http://s0.60logo.com/uploads/items/images/soft/180126/tengxunyun.svg" width="120"/><br><sub><b>部署于腾讯云示例应用
</b></sub></a></td>
<td align="center"><a href="https://www.100.com/" target="_blank"><img src="https://oss.bs2dl.100.com/hippo/config/f13ee98cfca7ce13888752c1261081b44bd356fd.png" width="120" /><br />
<a href="https://www.100.com/" target="_bvlank"><sub><b>100教育
</b></a></td>
<td align="center" style="height: 100px"><a href="https://blog.dreamer2q.wang/" target="_blank"><img src="https://res.wx.qq.com/op_res/MxxGgjPFRiTgjiReUefs2aMce-SgNvxxTB9U87YYhcOu6KPw9er7r2Lc0ne-b90nFstTUpc8REDwpxfUreKV1g" width="200px; margin: 20px 0" alt="Dream2qBlog"/><br />
<a href="https://blog.dreamer2q.wang/" target="_bvlank"><b>个人博客
</b></a></td>
<td align="center" style="height: 100px"><a href="https://jiawu.dewu.com" target="_blank"><img src="https://cdn.poizon.com/node-common/31116a45953ad8b468c6c832036aac88.png" width="200px; margin: 20px 0" alt="Dream2qBlog"/><br />
<a href="https://jiawu.dewu.com" target="_bvlank"><b>得物
</b></a></td>
<td align="center"><a href="https://www.myweimai.com/#sectionOne" target="_blank"><img src="https://img.alicdn.com/tfs/TB16i3VrQT2gK0jSZPcXXcKkpXa-400-400.jpg" width="120" alt="微脉"/><br />
<a href="https://www.myweimai.com/#sectionOne" target="_bvlank"><sub><b>微脉
</b></a></td>
<td align="center"><a href="hhttps://www.xdjy100.com/" target="_blank"><img src="https://res.wx.qq.com/shop/public/4a9526b5-0678-471a-bb98-d8545270f87f.png" width="120" alt="行动教育"/><br />
<a href="https://www.xdjy100.com/" target="_bvlank"><sub><b>行动教育
</b></a></td>
</tr>
<tr>
<td align="center" style="height: 100px"><a href="https://www.habisummercamp.com/" target="_blank"><img src="https://res.wx.qq.com/op_res/XXUpF56bDue53vZadoCSPSnqKF3bZqPOQnqsPa_ngEARa0OUIW22pX7eKsftPb6pc5ny62cR_wXM4g5xJ7G3DQ
" width="200px; margin: 20px 0" alt="Happy"/><br />
<a href="https://www.habisummercamp.com/" target="_bvlank"><b>HappyPC
</b></a></td>
<td align="center" style="height: 100px"><a href="https://m.habisummercamp.com/" target="_blank"><img src="https://res.wx.qq.com/op_res/XXUpF56bDue53vZadoCSPSnqKF3bZqPOQnqsPa_ngEARa0OUIW22pX7eKsftPb6pc5ny62cR_wXM4g5xJ7G3DQ
" width="200px; margin: 20px 0" alt="Happy"/><br />
<a href="https://m.habisummercamp.com/" target="_bvlank"><b>HappyMobile
</b></a></td>
<td align="center" style="width: 120px; "><a target="_blank" href="https://yulebao.alibaba.com/"><img src="https://gw.alicdn.com/tfs/TB1CmlIIFT7gK0jSZFpXXaTkpXa-190-46.png" width="120"/><br><sub><b>阿里影业娱乐宝
</b></sub></a></td>
<td align="center"><a target="_blank" href="https://campaign.vmate.com/vrbollywood"><img src="https://img.alicdn.com/tfs/TB17p6Vhbj1gK0jSZFOXXc7GpXa-512-512.png" width="120" alt="vmate 积分商城"/><br />
  <a target="_blank" href="https://job.alibaba.com/zhaopin/position_detail.htm?trace=qrcode_share&positionCode=GP524819"><sub><b>Vmate短视频
</b></a></td>
<td align="center"><a target="_blank" href="https://enjoysales.paat.com/"><img src="https://img.alicdn.com/tfs/TB1Ma0BiEY1gK0jSZFMXXaWcVXa-836-836.png" width="120" alt="火炽星原CRM"/><br />
<a target="_blank" href="https://enjoysales.paat.com/"><sub><b>火炽星原CRM
</b></a></td>
<td align="center" style="height: 100px"><a href="https://www.paixin.com/" target="_blank"><img src="https://www.paixin.com/favicon.ico" width="200px; margin: 20px 0" /><br />
<a href="https://www.paixin.com/" target="_bvlank"><b>拍信创意
</b></a></td>
<td align="center"><a href="https://www.66tools.com/" target="_blank"><img src="https://cdn.66tools.com/extension/chrome_qrcode_avatar.png" width="120" alt="极速二维码"/><br />
<a href="https://www.66tools.com/" target="_bvlank"><sub><b>极速二维码
</b></a></td>
<td align="center"><a href="https://help.seewo.com/" target="_blank"><img src="https://img.alicdn.com/tfs/TB11Xo3q4v1gK0jSZFFXXb0sXXa-350-55.png" width="120" alt="cvte"/><br /><a href="https://help.seewo.com/" target="_blank"><sub><b>希沃帮助中心
</b></a></td>
<td align="center"><a href="https://n8n8.cn/" target="_blank"><img src="https://static.jingzhuan.cn/static/portal/logo.png" width="120" alt="经传多赢股票网"/><br /><a href="https://n8n8.cn/" target="_blank"><sub><b>经传多赢股票网
</b></a></td>
</tr>
<tr>
<td align="center"><a href="https://www.sinovip.cn/home" target="_blank"><img src="https://res.wx.qq.com/shop/public/9e3d374e-5b54-4457-af2f-b457e544adc4.png" width="120" alt="中商全球图书采选平台
"/><br /><a href="https://www.sinovip.cn/home" target="_blank"><sub><b>中商全球图书采选平台
</b></a></td>
</tr>
</table>

## Features

- 🌱　Extremely customizable: Frontend supports modern Web frameworks like React17/React18/Vue2/Vue3;
- 🚀　Ready to use: Built-in 10+ scaffold extensions like [Pinia](https://pinia.vuejs.org/introduction.html#basic-example), [antd](https://ant.design/components/overview-cn/), [vant](https://github.com/youzan/vant), TypeScript, Hooks, etc.;
- 🧲　Plugin-driven: Based on plugin architecture, users focus more on business logic;
- 💯　Serverless-first: One-click deployment to various Serverless platforms, also supports traditional Web Servers like Egg, Midway, Nest, etc.
- 🛡　High availability scenarios, seamless degradation from SSR to CSR, best disaster recovery solution.
- 😄　Feature-rich, build tools support both Webpack/Vite, supports four rendering modes `SSR|CSR|SSG|Html`
- ✨ Supports [bun](https://bun.sh/) as js runtime

## Implemented Features

🚀 indicates implemented features

| Milestone                                                                                                                                                                                                                                                                        | Status |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Support combination of any server-side framework with any frontend framework. (Serverless/Midway/NestJS) + (React17/React18/Vue2/Vue3)                                                                                                                                           | 🚀     |
| Smoothest [vite](https://vite-design.surge.sh/) [support](http://doc.ssr-fc.com/docs/features$vite)                                                                                                                                                                              | 🚀     |
| Minimal and elegant server-side rendering implementation                                                                                                                                                                                                                         | 🚀     |
| Support [pre-rendering](http://doc.ssr-fc.com/docs/features$ssg) capability                                                                                                                                                                                                      | 🚀     |
| Optimized production code bundle size for Serverless scenarios with strict code package size limitations                                                                                                                                                                         | 🚀     |
| Support both conventional frontend routing and declarative frontend routing                                                                                                                                                                                                      | 🚀     |
| Abandon traditional template engines, all page elements unified using frontend components as DSL                                                                                                                                                                                 | 🚀     |
| Support four rendering modes simultaneously, providing one-click degradation from server-side rendering to client-side rendering                                                                                                                                                 | 🚀     |
| Unify data fetching methods for different frameworks on server and client sides, achieving high reusability                                                                                                                                                                      | 🚀     |
| Type-friendly, fully embrace TypeScript                                                                                                                                                                                                                                          | 🚀     |
| Support seamless integration with [antd](https://github.com/ant-design/ant-design) [vant](https://vant-contrib.gitee.io/vant/#/) without modifying any configuration                                                                                                             | 🚀     |
| Support using less as CSS preprocessor                                                                                                                                                                                                                                           | 🚀     |
| Seamless [usage](http://doc.ssr-fc.com/docs/features$faq#%E4%B8%8E%20micro-app%20%E7%BB%93%E5%90%88%E4%BD%BF%E7%94%A8) in micro-frontend scenarios                                                                                                                               | 🚀     |
| Support using context or [valtio](https://github.com/pmndrs/valtio) for minimalist [data management](http://doc.ssr-fc.com/docs/features$communication#React%20%E5%9C%BA%E6%99%AF) solutions, abandoning traditional redux/dva data management solutions                         | 🚀     |
| Vue3 scenarios provide [Pinia](https://pinia.vuejs.org/introduction.html#basic-example) and [Provide/Inject](http://doc.ssr-fc.com/docs/features$communication#Vue%20%E5%9C%BA%E6%99%AF%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88) to replace `Vuex` for cross-component communication | 🚀     |
| Support creation and usage on Alibaba Cloud [platform](https://zhuanlan.zhihu.com/p/139210473)                                                                                                                                                                                   | 🚀     |
| ssr deploy one-click deployment to [Alibaba Cloud](https://www.aliyun.com/) platform                                                                                                                                                                                             | 🚀     |
| ssr deploy --tencent one-click deployment to [Tencent Cloud](https://cloud.tencent.com/) platform without modifying any configuration                                                                                                                                            | 🚀     |

## Solution Comparison

Why choose the `ssr` framework and comparison with similar frameworks, please check the [documentation](http://doc.ssr-fc.com/docs/why)

## Quick Start

We provide the [create-ssr-app](https://github.com/zhangyuang/create-ssr-app) scaffold to let users quickly create different types of applications.

Currently, the official provides the following types of templates for developers to use directly. Users can choose different templates for development based on their actual technology stack.

Although the technology stacks are different, the development philosophy is consistent. In any technology stack combination, our development commands, build commands, and rendering principles are completely consistent.

Note: In `Midway.js` and `Nest.js` scenarios, we have implemented one-click deployment to `Serverless` platforms. However, the underlying implementations differ slightly. For more detailed introduction, please read the [Serverless](http://doc.ssr-fc.com/docs/features$serverless) chapter. If you need to extensively use capabilities provided by `Serverless` platforms, we recommend creating `Midway.js` type applications. We strongly recommend reading our [official documentation](http://doc.ssr-fc.com/) for more detailed understanding.

- [nestjs-react-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/nestjs-react-ssr)
- [nestjs-react18-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/nestjs-react18-ssr)
- [nestjs-vue-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/nestjs-vue-ssr)
- [nestjs-vue3-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/nestjs-vue3-ssr)
- [nestjs-vue3-ssr-pinia](https://github.com/zhangyuang/nestjs-vue3-ssr-pinia)
- [midway-react-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/midway-react-ssr)
- [midway-react18-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/midway-react18-ssr)
- [midway-vue-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/midway-vue-ssr)
- [midway-vue3-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/midway-vue3-ssr)

Developers can create different types of applications according to their actual technology stack needs to get started quickly.

### Create Project

Through the `npm init` command, we can create any of the above templates:

```bash
$ npm init ssr-app my-ssr-project
$ cd my-ssr-project
$ yarn # recommend using yarn, can also use npm install
$ yarn start
$ open http://localhost:3000 # access the application
$ yarn build # resource build, equivalent to npx ssr build
$ yarn start:vite # start in vite mode, equivalent to npx ssr start --tools vite
```

![](images/start-vite3.gif)

## Live Examples

Preview application details deployed to Alibaba Cloud/Tencent Cloud services through Serverless one-click deployment by visiting the following links.
Use queryParams `csr=true` to degrade SSR server-side rendering mode to CSR client-side rendering mode with one click, or configure through `config.js`.

- http://ssr-fc.com/ React SSR application deployed to Alibaba Cloud
- http://ssr-fc.com?csr=true React SSR application deployed to Alibaba Cloud, accessed in CSR mode
- http://tx.ssr-fc.com React SSR application deployed to Tencent Cloud
- http://tx.ssr-fc.com?csr=true React SSR application deployed to Tencent Cloud, accessed in CSR mode
- http://vue.ssr-fc.com Vue SSR application deployed to Alibaba Cloud
- http://vue3.ssr-fc.com Vue3 SSR application deployed to Alibaba Cloud
- http://vue.ssr-fc.com?csr=true Vue SSR application deployed to Alibaba Cloud, accessed in CSR mode
- http://vue3.ssr-fc.com?csr=true Vue3 SSR application deployed to Alibaba Cloud, accessed in CSR mode

## Ecosystem

| Project             | Status                                           | Description                                                             |
| ------------------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| [ssr]               | [![ssr-status]][ssr]                             | cli for ssr framework                                                   |
| [ssr-core]          | [![ssr-core-status]][ssr-core]                   | core render for all framwork                                            |
| [ssr-plugin-midway] | [![ssr-plugin-midway-status]][ssr-plugin-midway] | provide start and build fetature by [midway@2.0](https://midwayjs.org/) |
| [ssr-plugin-nestjs] | [![ssr-plugin-nestjs-status]][ssr-plugin-nestjs] | provide start and build feature by [NestJS](https://docs.nestjs.com/)   |
| [ssr-plugin-react]  | [![ssr-plugin-react-status]][ssr-plugin-react]   | develop react application only be used in development                   |
| [ssr-plugin-vue]    | [![ssr-plugin-vue-status]][ssr-plugin-vue]       | develop vue2 application only be used in development                    |
| [ssr-plugin-vue3]   | [![ssr-plugin-vue3-status]][ssr-plugin-vue3]     | develop vue3 application only be used in development                    |
| [ssr-common-utils]  | [![ssr-common-utils-status]][ssr-common-utils]   | common utils in Node.js environment and browser                         |
| [ssr-hoc-react]     | [![ssr-hoc-react-status]][ssr-hoc-react]         | provide hoc component for react                                         |
| [ssr-hoc-vue3]      | [![ssr-hoc-vue3-status]][ssr-hoc-vue3]           | provide hoc component for vue3                                          |
| [ssr-types]         | [![ssr-types-status]][ssr-types]                 | provide common types                                                    |
| [ssr-webpack]       | [![ssr-webpack-status]][ssr-webpack]             | start local server and build production bundle by webpack               |

[ssr-status]: https://img.shields.io/npm/v/ssr.svg
[ssr-core-status]: https://img.shields.io/npm/v/ssr-core.svg
[ssr-hoc-react-status]: https://img.shields.io/npm/v/ssr-hoc-react.svg
[ssr-hoc-vue3-status]: https://img.shields.io/npm/v/ssr-hoc-vue3.svg
[ssr-common-utils-status]: https://img.shields.io/npm/v/ssr-common-utils.svg
[ssr-plugin-midway-status]: https://img.shields.io/npm/v/ssr-plugin-midway.svg
[ssr-plugin-nestjs-status]: https://img.shields.io/npm/v/ssr-plugin-nestjs.svg
[ssr-plugin-react-status]: https://img.shields.io/npm/v/ssr-plugin-react.svg
[ssr-plugin-vue-status]: https://img.shields.io/npm/v/ssr-plugin-vue.svg
[ssr-plugin-vue3-status]: https://img.shields.io/npm/v/ssr-plugin-vue3.svg
[ssr-webpack-status]: https://img.shields.io/npm/v/ssr-webpack.svg
[ssr-types-status]: https://img.shields.io/npm/v/ssr-types.svg
[ssr]: https://github.com/zhangyuang/ssr/tree/dev/packages/cli
[ssr-core]: https://github.com/zhangyuang/ssr/tree/dev/packages/core
[ssr-hoc-react]: https://github.com/zhangyuang/ssr/tree/dev/packages/hoc-react
[ssr-hoc-vue3]: https://github.com/zhangyuang/ssr/tree/dev/packages/hoc-vue3
[ssr-plugin-midway]: https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-midway
[ssr-common-utils]: https://github.com/zhangyuang/ssr/tree/dev/packages/utils
[ssr-plugin-nestjs]: https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-nestjs
[ssr-plugin-react]: https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-react
[ssr-plugin-vue]: https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-vue
[ssr-plugin-vue3]: https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-vue3
[ssr-types]: https://github.com/zhangyuang/ssr/tree/dev/packages/types
[ssr-webpack]: https://github.com/zhangyuang/ssr/tree/dev/packages/webpack

## CONTRIBUTING

If you want to contribute code to this application, please read the [contributing documentation](./CONTRIBUTING.md). We have prepared rich scripts for bootstrapping.

## License

[MIT](LICENSE)

## Q&A Group

Although we have tried our best to check the application, there may still be omissions. If you find any problems or suggestions during use, welcome to raise [issues](https://github.com/zhangyuang/ssr/issues) or [PRs](https://github.com/zhangyuang/ssr/pulls).

`Note: Due to WeChat group size limitations, to join the group please add the personal QR code and note "join ssr communication group". Since it's a personal WeChat, friends will be deleted after being added to the group, please understand. We encourage communication through issues and discussions more.`

<div style="display:flex">
<!-- <img src="https://res.wx.qq.com/op_res/7F1t4Z8yCHWilehbcFGjAj0yVn0URMiWBGVJa-TVu_eqw5IwUXA2kPYBnfX6YRHy0FVBB-yC6l0IEL02QTJkLg" width="300"> -->
<img src="https://res.wx.qq.com/op_res/Nv12X2und927FEOvJ5iflzX-WBW07GSC22kumTCiShZnudKpG0jMuRs70ecHQb3Hy1QjjaASNzyOuMgHr43Wpw" width="300">
</div>

## Project Donation

If this project can help you, we hope to receive your donation ☕️ to contribute to the open source community.

<div style="display:flex">
<img src="https://doc.ssr-fc.com/images/wepay.jpg" width="150">
<img src="https://doc.ssr-fc.com/images/alipay.jpg" width="150">
</div>

## Lines of Code

```bash
$ cloc packages --include-ext=ts
     993 text files.
     679 unique files.
     829 files ignored.

github.com/AlDanial/cloc v 1.90  T=0.62 s (264.7 files/s, 9026.5 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
TypeScript                     164            471            195           4927
-------------------------------------------------------------------------------
SUM:                           164            471            195           4927
-------------------------------------------------------------------------------
```

## Frontend Development Manual

[How to Build a Comfortable and Efficient Frontend Development Environment](http://fe.ssr-fc.com/)

## Project Star Growth Trend

[![Stargazers over time](https://starchart.cc/zhangyuang/ssr.svg)](https://starchart.cc/zhangyuang/ssr)
