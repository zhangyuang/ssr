# 为什么要选择 SSR 2


## 环境准备

```bash
$ node -v # 建议版本>=v10.15.0
v12.16.1
```




## create-ssr-app

我们提供了 [create-ssr-app](https://github.com/zhangyuang/create-ssr-app) 脚手架，可迅速创建不同类型的 example。如无特殊需求，我们推荐创建 `Serverless` 类型的应用，可享受一站式的应用开发，部署能力。

在最新的版本中，我们集成了 `midway-serverless 2.0` 的强大特性，使得开发者可以任意在传统 Node.js 应用与 Serverless 应用中切换。详情见该 [PR](https://github.com/ykfe/ssr/pull/24)
开发者可以调用 `npm run prod` 以传统 Node.js 应用的形式部署，也可以调用 `ssr deploy` 一键发布到云平台。

``` bash
# 创建 React SSR 应用，同时支持 Serverless 形式一键发布或以传统 Node.js 应用的形式部署
$ npm init ssr-app my-ssr-project --template=midway-react-ssr
# 创建 Vue2 SSR 应用，同时支持 Serverless 形式一键发布或以传统 Node.js 应用的形式部署 
$ npm init ssr-app my-ssr-project --template=midway-vue-ssr 
# 创建 Vue3 SSR 应用，同时支持 Serverless 形式一键发布或以传统 Node.js 应用的形式部署
$ npm init ssr-app my-ssr-project --template=midway-vue3-ssr 
# 创建 React SSR 应用，基于 Nestjs Node.js 框架提供的能力以传统 Node.js 应用的形式部署
$ npm init ssr-app my-ssr-project --template=nestjs-react-ssr 
# 创建 Vue2 SSR 应用，基于 Nestjs Node.js 框架提供的能力以传统 Node.js 应用的形式部署
$ npm init ssr-app my-ssr-project --template=nestjs-vue-ssr
# 创建 Vue3 SSR 应用，基于 Nestjs Node.js 框架提供的能力以传统 Node.js 应用的形式部署 
$ npm init ssr-app my-ssr-project --template=nestjs-vue3-ssr 
```

注：当 `Node.js version >=15 / npm version >= 7` 时，应使用 `npm init ssr-app my-ssr-project -- --template=midway-react-ssr` 来传递参数