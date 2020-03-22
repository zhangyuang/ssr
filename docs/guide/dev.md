# 本地开发

本章节将会讲述在本地开发模式时，我们需要专注于什么特性以及具体做了什么工作，来让我们的应用启动

## 本地开发/部署时我们需要什么

在本地开发环境以及生产环境部署时我们需要的环境是不一样的

### 本地开发环境

* hmr，本地开发时，我们需要 `hmr` 功能来实现热替换
* sourceMap，本地开发时，我们需要 `sourceMap` 功能来帮我们定位错误源代码

### 生产环境

* 稳定的前端静态资源代码，我们不需要hmr等功能，只需要minify之后的前端静态资源代码
* 进程的稳定性，保证进程崩溃时可以自动重启

我们在[部署章节](./publish.md)会详细介绍这些内容。

## npm start 到底干了什么

查看package.json

```bash
"start": "rimraf dist && concurrently \"npm run ssr\" \" npm run csr \"",
"ssr": "concurrently \"egg-bin dev\" \"cross-env NODE_ENV=development webpack --watch --config ./build/webpack.config.server.js\"",
"csr": "cross-env NODE_ENV=development ykcli dev",
```

可以看到，在执行 `npm start` 时，我们执行了 `npm run ssr` 以及 `npm run csr` 两个script，这里我们分别来介绍两个script分别干了什么

### npm run ssr

在 `npm run ssr` 时，我们使用开发环境的 `egg-bin` 模块，来启动我们的 `egg` 应用，同时使用 `webpack` 去编译服务端的 `js bundle` ，并开启 `watch` 模式，使得源码改变时，会自动重新build

1. 使用 egg-bin 启动egg应用
2. 使用webpack watch模式来将服务端bundle编译到本地磁盘，即 `dist/Page.server.js` 文件

### npm run csr

在 `npm run csr` 时，我们使用 `ykcli dev` ，其中内置了 `webpack-dev-server` , 我们做的事情其实只是用 `webpack-dev-server` 来编译前端静态资源文件，并托管到一个本地服务中使其具有 `hmr` 功能

### 代理前端静态资源

我们使用 `npm run csr` 启动的 `webpack-dev-server` 的服务监听的是 `8000` 端口，但我们的 `egg` 应用启动的是 `7001` 端口，为了让我们不需要手动给静态资源加上 `<script src="http://localhost:8000/static/js/Page.chunk.js"></script>` 这样的写法，我们使用了 `egg-proxy` , 来将指定路径的请求转发到 `8000` 端口

``` js
// config.local.js
module.exports = {
    proxy: {
        host: 'http://127.0.0.1:8000', // 本地开发的时候代理前端打包出来的资源地址
        match: /(\/static)|(\/sockjs-node)|(\/__webpack_dev_server__)|hot-update/
    }
}
```

