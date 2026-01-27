# Plugin Mechanism

The plugin mechanism is an excellent mechanism that can extend framework capabilities. Many developers will see their respective plugin mechanisms in some well-known projects such as `Webpack`, `Rollup`, `Vite`, `umi.js`. Similarly, the reason why this framework can simultaneously support `React`, `Vue2`, `Vue3` is also based on plugin mechanism extensions.

This framework's plugin mechanism is not like the familiar `Webpack` plugins. Usually, when we develop a large application based on `Webpack`, we need to combine more than ten `Webpack Plugin`s to work properly. It divides the functionality granularity of each plugin very finely. The general principle is that at each stage of `compile code`, by throwing corresponding hooks, plugins can modify the `code` at that stage to combine into a complete application.

This framework's plugin mechanism is somewhat similar to `Vite Plugin`. Currently, we provide client-side plugins [plugin-react](https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-react) [plugin-vue](https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-vue) [plugin-vue3](https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-vue3) and server-side plugins [plugin-midway](https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-midway) [plugin-nestjs](https://github.com/zhangyuang/ssr/tree/dev/packages/plugin-nestjs). What they represent is a solution for a framework scenario.

Compared to `Webpack Plugin`, our granularity is larger. Developers can combine client-side plugins and server-side plugins arbitrarily. However, multiple client-side plugins cannot be combined. So let's see how to write a plugin needed by the `ssr` framework.

## Plugin Types

We define the respective responsibilities of server-side plugins and client-side plugins as follows:

- Server-side plugins are responsible for providing `Node.js Server` services during local development, providing server-side code build functionality such as `ts -> js`, and `deploy` publishing functionality (optional).

- Client-side plugins are responsible for providing frontend component static resource packaging and build functionality, as well as local development `HMR` capabilities.

Note: Our plugins are only used during local development. In production environments, we don't use the functionality provided by plugins, nor do we need to install related dependencies. This ensures the minimization of our production environment's `node_modules` folder.

## Server-Side Plugins

Compared to client-side plugins, developing a server-side plugin is actually very easy. It can be completed in just a dozen lines of code. Because for this part of functionality, we haven't done any packaging or additions. They are all functionalities provided by the respective Node.js frameworks themselves.

In `package.json`, we provide `start`, `build`, `deploy(optional)` commands for developers to use during local development. When executing the `ssr start` command, we essentially call the `start` methods provided by server-side plugins and client-side plugins. That is to say, a server-side plugin's code is as follows.

```js
// plugin-midway
import { start } from "./start";
import { build } from "./build";
import { deploy } from "./deploy";

export function midwayPlugin() {
  return {
    name: "plugin-midway",
    start,
    build,
    deploy,
  };
}
```

同样这里的 `start` 方法我们调用的也是框架本身的功能。这里我们调用的直接是 `midway-bin` 提供的能力

```js
import { exec } from 'child_process'
import { loadConfig } from 'ssr-common-utils'
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
const spinner = require("ora")("starting ");

const start = () => {
  const config = loadConfig();
  spinner.start();
  const { stdout, stderr } = exec("npx nest start --watch", {} /* options, [optional] */);
  stdout?.on("data", function (data) {
    console.log(data);
    if (data.match("Nest application successfully started")) {
      spinner.stop();
      const https = process.env.HTTPS;
      logGreen(
        `Server is listening on ${https ? "https" : "http"}://localhost:${config.serverPort}`,
      );
    }
  });
  stderr?.on("data", function (data) {
    console.error(`error: ${data}`);
  });
};

export { start };
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
│   └── tools
│   │   ├── vite.d.ts
│   │   ├── vite.js
│   │   ├── webpack.d.ts
│   │   └── webpack.js
│   ├── global.d.ts
│   └── index.ts
├── tsconfig.cjs.json
└── tsconfig.esm.json
```

同样在 `index.ts` 中，我们也是暴露 `start` `build` 方法让上层调用

```js
import { loadConfig } from "ssr-common-utils";

const { isVite } = loadConfig();

export function vuePlugin() {
  return {
    name: "plugin-vue",
    start: async () => {
      if (isVite) {
        const { viteStart } = await import("./tools/vite");
        await viteStart();
      } else {
        const { webpackStart } = await import("./tools/webpack");
        await webpackStart();
      }
    },
    build: async () => {
      if (isVite) {
        const { viteBuild } = await import("./tools/vite");
        await viteBuild();
      } else {
        const { webpackBuild } = await import("./tools/webpack");
        await webpackBuild();
      }
    },
  };
}

export * from "./tools/vite";
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
