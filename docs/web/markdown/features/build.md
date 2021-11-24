# 构建产物

本章节将会分析默认示例执行 `ssr build` 命令后的构建产物来帮助开发者更好的理解应用。`ssr` 框架的构建产物都非常清晰且数量相比于同类型的框架非常少，从文件名中即可看出代表的含义

## 产物类型

相比于传统的 `SPA` 应用只会构建出纯客户端用到的文件。服务端渲染场景下我们会分别构建出服务端用到的产物和客户端用到的产物

```shell
$ tree build
build
├── client # 客户端构建产物文件夹
│   ├── asset-manifest.json # 客户端构建产物清单，包含源文件到生成后的文件的映射
│   └── static # 静态资源
│       ├── css
│       │   ├── Page.9b4ee7a2.chunk.css # 公共样式
│       │   ├── detail-id.802a30ee.chunk.css # render$id 页面样式
│       │   └── index.e0ee4d68.chunk.css # index/render 页面样式
│       └── js
│           ├── Page.bd84ae30.chunk.js # 公共业务 js 代码
│           ├── detail-id-fetch.88ffa1dd.chunk.js # fetch$id 文件
│           ├── detail-id.7718bdb4.chunk.js # render$id 文件
│           ├── index-fetch.07aa86b0.chunk.js # fetch 文件
│           ├── index.b76c09e5.chunk.js # render 文件
│           ├── runtime~Page.3f285250.js # 无需关注，提供 webpack 自身的一些 api，意义上等于老版本的 webpack 生成的 manifest.js
│           └── vendor.92dcc0b4.chunk.js # 第三方模块
└── server # 服务端构建产物文件夹
    ├── Page.server.js # 服务端 bundle，通过框架底层的 server-entry 方法构建而出
    └── static # 该文件夹非 Vite 本地开发场景用不到，无需关注
        └── css
            ├── Page.66b88dee.css
            └── Page.css
```

## 客户端产物类型分析详解

对于 `client` 文件夹构建出来的东西有经验的开发者会很熟悉。客户端构建产物通过 [client-entry](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue3/src/entry/client-entry.ts)生成， 唯一的区别就是在服务端渲染场景下我们调用的框架 API 为 `hydrate` 水合模式而不是 `render` 普通渲染模式

开发者可以通过 `GENERATE_ANALYSIS=true npm run build` 来可视化生成客户端构建产物，来判断 `tree shaking` 有没有生效有没有引入没有使用的文件

## 服务产物端类型分析详解

这里我们着重提一下服务端构建产物中的 `Page.server.js` 

该文件为 `commonjs` 格式在 `Node.js` 环境中被调用。由框架源码中的 [server-entry](https://github.com/zhangyuang/ssr/blob/dev/packages/plugin-vue3/src/entry/server-entry.ts) 文件构建而得到。该文件只会包含业务代码，也就是前端组件。由于 `Node.js` 环境无法直接使用 `ESM` 语法或识别 `JSX` 语法以及样式文件，所以我们需要做一层构建处理，保证构建后的产物能够在 `Node.js` 环境成功执行。

对于服务端文件的构建我们通常会开启 `externals` 选项，也就是将第三方模块的依赖外置。举个例子

```js
// 源码
import React from 'react'

// 构建后
const React = require('react')
```

在构建时并不会将 `react` 的源码一起打包进来，而是运行时动态的从 `node_modules` 文件夹中加载模块。这样保证了我们服务端构建产物的体积，只包含纯业务代码也能够让我们在出错时能够迅速定位问题。但这样的方式要求我们在部署环境需要存在 `node_modules` 文件夹并且包含生产环境中会动态加载的所有模块。

### 常见错误解决

由于我们开启了 `externals` 选项，这里在一些场景可能会出问题。例如我们加载的第三方模块在代码中写死了依赖的另外的模块是 `ESM` 格式的。例如一些第三方模块会使用 `lodash-es` 而不是 `lodash` 来运行。针对这样的依赖，我们没办法外置再去动态加载，这样会导致错误。针对这种模块格式错误的问题，或是依赖了样式文件的模块。我们仍需要处理它，将代码与服务端构建产物打包在一起。而不是运行时再去动态加载。这里我们可以通过框架提供的 [whiteList](./api$config#whiteList) 配置来设置需要特殊处理的模块