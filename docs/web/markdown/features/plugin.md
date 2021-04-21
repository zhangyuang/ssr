# 插件机制

插件机制是一种可以扩展框架能力的优秀机制。许多开发者在一些知名项目中都会看到它们各自的插件机制例如 `Webpack`, `Rollup`, `Vite`, `umi.js` 中。同样本框架之所以能够同时支持 `React`, `Vue2`, `Vue3` 同样也是基于插件机制扩展的

本框架的插件机制不像大家熟悉的 `Webpack` 插件。通常我们基于 `Webpack `开发一个大型应用需要组合十多个 `Webpack Plugin` 才能够正常工作。它将每一个插件的功能粒度分的很细。大概原理就是在 `compile code` 的每个阶段，通过抛出对应的钩子来使得插件可以修改该阶段的 `code` 代码来组合成一个完整的应用。

本框架的插件机制有点类似于 `Vite Plugin`, 目前我们提供了客户端插件 [plugin-react](https://github.com/ykfe/ssr/tree/dev/packages/plugin-react) [plugin-vue](https://github.com/ykfe/ssr/tree/dev/packages/plugin-vue) [plugin-vue3](https://github.com/ykfe/ssr/tree/dev/packages/plugin-vue3) 以及服务端插件 [plugin-midway](https://github.com/ykfe/ssr/tree/dev/packages/plugin-midway) [plugin-nestjs](https://github.com/ykfe/ssr/tree/dev/packages/plugin-nestjs)。它们所代表的含义是一个框架场景下的解决方案。

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

const { cliFun } = require('@midwayjs/cli/bin/cli')

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
    await cliFun(argv)
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