# 学习准备

本文档将会基于我们团队开源的[Egg + React + SSR](https://github.com/ykfe/egg-react-ssr)应用骨架进行讲解, 你可以先将该项目clone到本地，并运行一下，简单熟悉一下目录结构以及文件。

## 创建应用

我们提供了一个脚手架来让你快速创建应用

```bash
$ npm install yk-cli -g
$ ykcli init <Your Project Name>
$ cd <Your Project Name>
$ npm i
$ npm start
$ open http://localhost:7001
```

## 启动脚本

我们的应用提供多种启动方式供你选择，但本地开发最佳使用方式还是使用npm start来同时启动服务端渲染和客户端hydrate

```bash
$ npm start
$ npm run ssr // 启动监听7001端口，只启动服务端渲染，此时仅服务端直出html，没有与客户端混合的步骤
$ npm run csr // 启动监听8000端口，只启动客户端渲染，相当于传统的cra脚手架开发模式
$ npm run prod // 模拟SSR应用生产环境
$ npm run build // 打包服务端以及客户端资源文件
$ npm run analyze // 可视化分析客户端打包的资源详情
```

## 目录结构

以下是该应用的目录结果遵循egg的目录约定，同时新增web目录存放我们的前端组件代码

```js
├── README.md
├── app // egg核心目录
│   ├── controller
│   ├── extend
│   ├── middleware
│   └── router.js // egg路由文件，无特殊需求不需要修改内容
├── app.js // egg 启动入口文件
├── build // webpack配置目录
│   ├── env.js
│   ├── jest
│   ├── paths.js
│   ├── util.js
│   ├── webpack.config.base.js // 通用的webpack配置
│   ├── webpack.config.client.js // webpack客户端打包配置
│   └── webpack.config.server.js // webpack服务端打包配置
├── config // egg 配置文件目录
│   ├── config.daily.js
│   ├── config.default.js
│   ├── config.local.js
│   ├── config.prod.js
│   ├── config.staging.js
│   ├── plugin.js
│   └── plugin.local.js
├── dist // build生成静态资源文件目录
│   ├── Page.server.js // 服务端打包后文件(即打包后的serverRender方法)
│   └── static // 前端打包后静态资源目录
└── web // 前端文件目录
    ├── assets
    │   └── common.less
    ├── entry.js // webpack打包入口文件，分环境导出不同配置
    ├── layout
    │   ├── index.js // 页面布局
    │   └── index.less
    └── page
        ├── index
        └── news
```