# Why Choose SSR Framework

<div align="center">
  <strong>A most advanced ssr framework on Earth that implemented serverless-side render specification for faas and traditional web server.</strong>
</div>
<br />
<div align="center">
<a href="https://github.com/zhangyuang/ssr/actions" target="_blank"><img src="https://github.com/zhangyuang/ssr/workflows/CI/badge.svg" style="width:90px;height: 20px" alt="githubActions"></a>
<a href="https://www.cypress.io/" target="_blank"><img src="https://img.shields.io/badge/cypress-dashboard-brightgreen.svg" style="width:90px;height: 20px" alt="cypress"></a>
<a href="https://npmcharts.com/compare/ssr" target="_blank"><img src="https://img.shields.io/npm/dt/ssr" style="width:90px;height: 20px" alt="download"></a>
<a href="https://standardjs.com" target="_blank"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" style="width:90px;height: 20px" alt="standardjs"></a>
<a href="https://github.com/zhangyuang/ssr" target="_blank"><img src="https://img.shields.io/npm/l/vue.svg" style="width:90px;height: 20px" alt="License"></a>
<a href="https://github.com/zhangyuang/ssr" target="_blank"><img src="https://img.shields.io/badge/node-%3E=12-green.svg?color=4dc71f" alt="Node"  style="width:90px;height: 20px"></a>
<a href="https://github.com/zhangyuang/ssr" target="_blank"><img src="https://img.shields.io/github/stars/zhangyuang/ssr.svg?color=4dc71f" alt="Node"  style="width:90px;height: 20px"></a>
</div>
<br />

The [ssr](https://github.com/zhangyuang/ssr) framework is an out-of-the-box server-side rendering framework built for frontend frameworks in server-side rendering scenarios.

This framework evolved from the [egg-react-ssr](https://github.com/zhangyuang/egg-react-ssr) project and `ssr` v4.3 version (midway-faas + react ssr). Based on previous foundations, it has made many improvements through plugin-based code organization, supporting the combination of any server-side framework with any frontend framework. Developers can choose to deploy via Serverless or deploy as traditional Node.js applications. We focus on improving the development experience of server-side rendering applications in Serverless scenarios, creating one-stop development and application deployment services. This maximizes developer experience while minimizing application development and deployment costs.

In the latest v5.0 version, it supports both `React` and `Vue2`, `Vue3` as server-side rendering frameworks. For build tools, we also support the most popular [Vite](https://vitejs.dev/guide/why.html) to improve application startup speed and HMR speed, and provide one-click deployment to cloud in Serverless form.

We can confidently say it is the `most advanced ssr framework on Earth`. If you want an out-of-the-box experience with one-click cloud deployment, choose the `ssr` framework.

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

## Features

- 🌱 Extremely customizable: Frontend supports modern Web frameworks like React/Vue2/Vue3;
- 🚀 Ready to use: Built-in 10+ scaffold extensions like [Pinia](https://pinia.vuejs.org/introduction.html#basic-example), [antd](https://ant.design/components/overview-cn/), [vant](https://github.com/youzan/vant), TypeScript, Hooks, etc.;
- 🧲 Plugin-driven: Based on plugin architecture, users focus more on business logic;
- 💯 Serverless-first: One-click deployment to various Serverless platforms, also supports traditional Web Servers like Egg, Midway, Nest, etc.
- 🛡 High availability scenarios, seamless degradation from SSR to CSR, best disaster recovery solution.
- 😄 Feature-rich, build tools support Webpack/Vite

## Implemented Features

🚀 indicates implemented features

| Milestone                                                                                                                                                                                                                                          | Status |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| Support combination of any server-side framework with any frontend framework. (Serverless/Midway/NestJS) + (React17/React18/Vue2/Vue3)                                                                                                                                                      | 🚀    |
| Smoothest [vite](https://vite-design.surge.sh/) [support](http://doc.ssr-fc.com/docs/features$vite)                                                                                                                                                 | 🚀    |
| Minimal and elegant server-side rendering implementation                                                                                                                                                                                                                    | 🚀    |
| Support [pre-rendering](http://doc.ssr-fc.com/docs/features$ssg) capability                                                                                                                                                                                                                   | 🚀    |
| Optimized production code bundle size for Serverless scenarios with strict code package size limitations                                                                                                                                                                     | 🚀    |
| Support both conventional frontend routing and declarative frontend routing                                                                                                                                                                                                          | 🚀    |
| Abandon traditional template engines, all page elements unified using frontend components as DSL                                                                                                                                                                                          | 🚀    |
| Support four rendering modes simultaneously, providing one-click degradation from server-side rendering to client-side rendering                                                                                                                                                                                  | 🚀    |
| Unify data fetching methods for different frameworks on server and client sides, achieving high reusability                                                                                                                                                                            | 🚀    |
| Type-friendly, fully embrace TypeScript                                                                                                                                                                                                                           | 🚀    |
| Support seamless integration with [antd](https://github.com/ant-design/ant-design) [vant](https://vant-contrib.gitee.io/vant/#/) without modifying any configuration                                                                                                                    | 🚀    |
| Support using less as CSS preprocessor                                                                                                                                                                                                                 | 🚀    |
| Seamless [usage](http://doc.ssr-fc.com/docs/features$faq#%E4%B8%8E%20micro-app%20%E7%BB%93%E5%90%88%E4%BD%BF%E7%94%A8) in micro-frontend scenarios                                                                                                                    | 🚀    |
| Support using context or [valtio](https://github.com/pmndrs/valtio) for minimalist [data management](http://doc.ssr-fc.com/docs/features$communication#React%20%E5%9C%BA%E6%99%AF) solutions, abandoning traditional redux/dva data management solutions                                                                                         | 🚀    |
| Vue3 scenarios provide [Pinia](https://pinia.vuejs.org/introduction.html#basic-example) and [Provide/Inject](http://doc.ssr-fc.com/docs/features$communication#Vue%20%E5%9C%BA%E6%99%AF%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88) to replace `Vuex` for cross-component communication | 🚀    |
| Support creation and usage on Alibaba Cloud [platform](https://zhuanlan.zhihu.com/p/139210473)                                                                                                                                                                           | 🚀    |
| ssr deploy one-click deployment to [Alibaba Cloud](https://www.aliyun.com/) platform                                                                                                                                                                                      | 🚀    |
| ssr deploy --tencent one-click deployment to [Tencent Cloud](https://cloud.tencent.com/) platform without modifying any configuration                                                                                                                                                         | 🚀    |

## Solution Comparison

For comparison with similar frameworks and why choose the `ssr` framework, please check the [documentation](http://doc.ssr-fc.com/docs/why).

## What companies are using

Companies (applications) currently using this project. If you are using it but not listed, please raise an [issue](https://github.com/zhangyuang/ssr/issues). We welcome promotion and sharing, and will provide technical support at any time.

We believe the SSR framework represents the future of server-side rendering solutions. Choose SSR for your next project and experience the difference!