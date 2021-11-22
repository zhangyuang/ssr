# 插件机制

插件机制是一种可以扩展框架能力的优秀机制。许多开发者在一些知名项目中都会看到它们各自的插件机制例如 `Webpack`, `Rollup`, `Vite`, `umi.js` 中。同样本框架之所以能够同时支持 `React`, `Vue2`, `Vue3` 同样也是基于插件机制扩展的

本框架的插件机制不像大家熟悉的 `Webpack` 插件。通常我们基于 `Webpack `开发一个大型应用需要组合十多个 `Webpack Plugin` 才能够正常工作。它将每一个插件的功能粒度分的很细。大概原理就是在 `compile code` 的每个阶段，通过抛出对应的钩子来使得插件可以修改该阶段的 `code` 代码来组合成一个完整的应用。

本框架的插件机制有点类似于 `Vite Plugin`, 目前我们提供了客户端插件 [plugin-react](https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-react) [plugin-vue](https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-vue) [plugin-vue3](https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-vue3) 以及服务端插件 [plugin-midway](https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-midway) [plugin-nestjs](https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-nestjs)。它们所代表的含义是一个框架场景下的解决方案。

相比于 `Webpack Plugin` 我们的粒度要更大一些。开发者可以在客户端插件与服务端插件之间进行任意的组合。但是无法将多个客户端插件进行组合。那么下面我们来看看如何编写一个 `ssr` 框架需要的插件吧

## 插件类型

我们定义服务端插件与客户端插件各自的职责如下

- 服务端插件，负责本地开发时提供 `Node.js Server` 服务，提供服务端代码的构建功能例如 `ts -> js`。以及 `deploy` 发布功能 (可选)

- 客户端插件，负责提供前端组件静态资源的打包构建功能以及本地开发的 `HMR` 能力

注意：我们的插件只会在本地开发时使用。在生产环境我们不会使用到插件提供的功能，也不需要安装相关依赖。以此保证我们生产环境的 `node_modules` 文件夹的最小化

## 服务端插件

相比于客户端插件。其实一个服务端插件的开发是非常容易的。几乎十几行代码就可以完成。因为这一部分的功能，我们完全没有做任何的包装和附加。都是各自 Node.js 框架本身所提供的功能。

在 `package.json` 中我们提供了 `start` `build` `deploy(可选)` 命令供开发者在本地开发时使用。在执行 `ssr start` 命令时，我们本质上是调用了服务端插件和客户端插件提供的 `start` 方法。也就是说一个服务端插件的代码如下。

```js
// plugin-midway
import { start } from './start'
import { build } from './build'
import { deploy } from './deploy'

export function midwayPlugin () {
  return {
    name: 'plugin-midway',
    start,
    build,
    deploy
  }
}
```

同样这里的 `start` 方法我们调用的也是框架本身的功能。这里我们调用的直接是 `midway-bin` 提供的能力

```js
import { exec } from 'child_process'
import { loadConfig } from 'ssr-server-utils'
import { Argv } from 'ssr-types'

const { cli } = require('@midwayjs/cli/bin/cli')

const start = (argv: Argv) => {
  const config = loadConfig()
  exec('cross-env ets', async (err, stdout) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(stdout)
    // 透传参数给 midway-bin
    argv._[0] = 'dev'
    argv.ts = true
    argv.port = config.serverPort
    await cli(argv)
  })
}
export {
  start
}
```

`build` `deploy` 方法同理。

同样在 `Nest.js` 场景我们调用的也是 `Nest.js` 本身脚手架提供的命令

```js
const spinner = require('ora')('starting ')

const start = () => {
  const config = loadConfig()
  spinner.start()
  const { stdout, stderr } = exec('npx nest start --watch', {} /* options, [optional] */)
  stdout?.on('data', function (data) {
    console.log(data)
    if (data.match('Nest application successfully started')) {
      spinner.stop()
      const https = process.env.HTTPS
      logGreen(`Server is listening on ${https ? 'https' : 'http'}://localhost:${config.serverPort}`)
    }
  })
  stderr?.on('data', function (data) {
    console.error(`error: ${data}`)
  })
}

export {
  start
}
```

## 客户端插件

相比于服务端插件，我们的主要逻辑还是在客户端插件当中。编写一个客户端插件略复杂，好在常见的前端框架官方已经帮大家都提供了对应的插件实现服务端渲染功能。无需自己重新实现

下面让我们来看看一个客户端插件的目录结构

```shell
$ tree ./ -I node_modules -L 2
./
├── CHANGELOG.md
├── package.json
├── src
│   ├── config # Webpack 构建配置
│   │   ├── base.ts # 通用 Webpack 构建配置
│   │   ├── client.ts # 客户端文件 Webpack 构建配置
│   │   ├── index.ts
│   │   ├── server.ts # 服务端文件 Webpack 构建配置
│   │   └── vite.config.tpl
│   ├── entry
│   │   ├── client-entry.ts # 客户端文件打包入口
│   │   ├── interface.ts
│   │   ├── router.ts
│   │   ├── server-entry.ts # 服务端文件打包入口
│   │   └── store.ts
│   ├── global.d.ts
│   └── index.ts
├── tsconfig.cjs.json
└── tsconfig.esm.json
```

同样在 `index.ts` 中，我们也是暴露 `start` `build` 方法让上层调用

```js
import * as WebpackChain from 'webpack-chain'

export function vuePlugin () {
  return {
    name: 'plugin-vue3',
    start: async () => {
      // 本地开发的时候要做细致的依赖分离， Vite 场景不需要去加载 Webpack 构建客户端应用所需的模块
      const { startServerBuild } = await import('ssr-webpack/cjs/server/server')
      const { getServerWebpack } = await import('./config/server')
      const serverConfigChain = new WebpackChain()
      await startServerBuild(getServerWebpack(serverConfigChain))
      if (process.env.BUILD_TOOL === 'vite') {
        return
      }
      const { startClientServer } = await import('ssr-webpack')
      const { getClientWebpack } = await import('./config')
      const clientConfigChain = new WebpackChain()
      await startClientServer(getClientWebpack(clientConfigChain))
    },
    build: async () => {
      const { startServerBuild, startClientBuild } = await import('ssr-webpack')
      const { getClientWebpack, getServerWebpack } = await import('./config')
      const serverConfigChain = new WebpackChain()
      await startServerBuild(getServerWebpack(serverConfigChain))
      const clientConfigChain = new WebpackChain()
      await startClientBuild(getClientWebpack(clientConfigChain))
    }
  }
}

```

上面的代码可能无法直观的看出具体的作用，下面让我们来慢慢分析客户端插件干了什么

首先我们需要在客户端插件定义 `server-entry` `client-entry` 分别代表服务端 `bundle` 的打包入口以及客户端 `bundle` 的打包入口

同样 `start` 命令的逻辑其实很简单，只干了两件事情

- 启动 `Webpack` 以 `config/server` 为配置文件(通常开启 externals 选项)以 `watch` 模式构建服务端 `bundle`
- 启动 `Webpack-dev-server` 以 `config/client` 为配置文件构建客户端 `bundle` 提供 `HMR` 功能

`build` 命令的逻辑则更简单，直接以 `Webpack` 来生产环境模式构建双端文件

## 注意事项

- 在本地开发的 `start` 命令我们需要对 `Vite` 场景进行区分判断，使得本地开发启动的时候我们需要加载的模块体积最小，提升启动速度。详情见 [使用 Vite](./features$vite) 章节
- 构建服务端文件时，我们会开启 [externals](https://webpack.docschina.org/configuration/externals/) 选项，来将 `node_modules` 中的依赖外置，使得服务端文件体积尽可能小，提升启动速度。