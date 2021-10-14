# 目录结构

在[快速开始](./features$started)中，大家对框架应该有了初步的印象，接下来我们简单了解下目录约定规范。

这里想先跟大家简单聊一下 Node.js + 前端 结合的应用的一个发展历程

## 目录结构变迁

随着不同的时间阶段，Node.js + 前端 结合的应用的目录结构组织也在不断的变化，这里大概分为三个阶段

### 前后端完全独立

在最早的实践中，一些团队只是单纯的将 Node.js 与 前端相关的代码文件夹强行放在了一个 `Repo` 当中维护。但是它们之间是互相独立的，包括 `package.json` 独立以及开发构建命令独立。
这样的做法其实可维护性和开发体验非常差。

这种结构的划分，在本地开发时我们往往需要开启两个终端 Shell，来运行双端各自的启动命令。或者使用类似于 [concurrently](https://www.npmjs.com/package/concurrently) 这样的模块来并行的运行两个命令。同样我们的安装依赖操作以及依赖构建的操作都需要以这样的模式来运行。非常的繁琐

### 前后端独立文件夹

还有一种做法是，前后端独立文件夹，但是 `package.json` 以及开发启动构建命令都是共享的。这也是本框架目前采用的组织结构。这样的优势是，开发者无需关注双端各自的细节，只需要执行一个 `ssr start` 命令即可启动所有服务。`ssr build` 命令构建所有用到的资源文件

### 前后端共享文件夹

现在有一些团队在探索前后端一体化的相关实践。就提出了将前后端代码放在一个文件夹当中维护的想法。

这样的优势在于前端组件可以迅速服用服务端定义的 `interface`。但是虽然语法都是 `ts|js` 但是它们实际的运行环境是完全不同的，这样的做法对使用者的心智要求非常高。一旦双端互相访问了对方环境的变量，在打包的时候就是灾难。

例如一个公共的 `utils` 同时包含了只能够运行在服务端，或者只能够运行在客户端的文件，在运行或者打包的时候不做特殊处理是一定会出问题的

```js
// utils/foo.ts
import * as fs from 'fs'

// utils/bar.ts
const bar = window.bar
export default bar

// utils/index.ts
export * from './foo'
export * from './bar'
```

但是这种思路是未来的发展趋势。我们后续也会考虑如何更好的组织目录结构以便于前后端能够共享环境无关的代码

## 目录结构

以下是 `ssr` 框架默认创建的应用目录结构，以下结构在 `React` `Vue2` `Vue3` 场景保持一致。唯一不同的只有文件后缀名是 `tsx|vue` 的区别。

```shell
.
├── build # web目录构建产物，与 public 文件夹一样会设置为静态资源文件夹，非应用构建产物静态资源文件如图片/字体等资源建议放在 public 文件夹前端代码通过绝对路径引入
│   ├── client # 存放前端静态资源文件
│   └── server # 存放 external 后的服务端 bundle，
├── public # 作为静态资源目录存放静态资源文件
├── config.js # 定义应用的配置 (框架层面使用，生产环境需要)
├── config.prod.js # (可选) 若存在则视为生产环境的应用配置
├── f.yml # (可选)，仅在 Serverless 场景下使用，若调用 ssr deploy 检测到无此文件会自动创建
├── package.json
├── src # 存放服务端 Node.js 相关代码
│   └── index.ts
├── tsconfig.json # 服务端 Node.js 编译配置文件
├── typings # 存放前后端公共类型文件
├── web # 存放前端组件相关代码
│   ├── components # 存放公共组件
│   │   └── header # 公共头部
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   └── layout # 页面 html 布局
│   │       └── index.tsx # 页面 html 布局，仅在服务端被渲染
│   │       └── App.tsx # 页面具体的组件内容，用于初始化公共配置
│   │       └── fetch.ts # layout 级别的 fetch，用于获取所有页面的公共数据，将会在每一个页面级别的fetch 调用之前调用
│   ├── pages # pages目录下的文件夹会映射为前端路由表，存放页面级别的组件
│   │   ├── index # index文件夹映射为根路由 /index => /
│   │   │   ├── fetch.ts # 定义fetch文件用来统一服务端/客户端获取数据的方式，通过 __isBrowser__ 变量区分环境，会在首页服务端渲染以及前端路由切换时被调用
│   │   │   ├── index.less
│   │   │   └── render.tsx # 定义render文件用来定义页面渲染逻辑
│   │   └── detail
│   │   │   ├── fetch.ts
│   │   │   ├── index.less
│   │   │   └── render$id.tsx # 映射为 /detail/:id
│   │   │   └── user
│   │   │        ├── fetch.ts
│   │   │        └── render$id.tsx # 多级路由按照规则映射为 /detail/user/:id
│   │   │        └── render$user$id.tsx # 多参数路由映射为 /detail/user/:user/:id
│   │   ├── bar 
│   │   │   ├── fetch.ts
│   │   │   └── render.tsx
│   │   │   ├── fetch$id.ts
│   │   │   └── render$id.tsx # 当存在多个 render 类型的文件时，每个 render 文件对应与其同名的 fetch 文件，例如 render$id 对应 fetch$id
│   ├── tsconfig.json # web 目录下的 tsconfig 仅用于编辑器ts语法检测
```

关于` 前端路由映射` 更加详细的了解可以阅读[约定式路由](./features$feRoutes)章节

关于 `fetch.ts` 文件更加详细的了解可以阅读[数据获取](./features$fetch)章节

关于 `config.js` 文件更加详细的了解可以阅读[应用配置](./api$config)章节

