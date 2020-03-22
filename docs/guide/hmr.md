---
sidebarDepth: 3
---

# HMR

现在每个框架的脚手架新建的项目基本都会提供[HMR](https://webpack.docschina.org/guides/hot-module-replacement/)功能。
这里首先区分两个概念，hot-module-replacement 以及 hot-module-reloading。两者的缩写都是 HMR，但前者叫热替换，后者叫热重载。

## 概念区分

在与其他开发者沟通的时候，我们发现他们经常将两个概念弄混，我表达的 HMR 是热替换，他们表达的 HMR 是热重载。

### 热替换

热替换，即修改代码后，浏览器无需刷新，而是通过局部替换来更新你的应用，很明显这样的开发体验更加的友好，但实现起来较为复杂

### 热重载

热重载，即代码修改后，自动刷新你的浏览器，无需你手动刷新。这种方式的体验没有热替换那么友好，但实现起来较为容易

## 热替换实现

这里我们介绍两种方式来实现，一种是[webpack-dev-server](https://webpack.docschina.org/configuration/dev-server/), 一种是直接用中间件的方式
现在最火的构建工具 webpack, 提供了 webpack-dev-server 这个工具，来帮你隐藏其中细节快速来实现热替换

### webpack-dev-server

webpack-dev-server 中内置了 express,在你本地开发时，它其实是用 express 创建了一个 Node Server，然后加载了[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)这个中间件，该中间件提供以下功能(来自于官网的介绍)

- 将文件打包在内存中，而不是打包到本地硬盘中
- 当启动了 webpack wacth 选项时，该中间件将延迟请求直到新的文件编译完成
- 支持热重载

光使用该中间件还无法实现热替换，webpack-dev-server 还使用了 sockjs 来实现热替换
使用方式:

```js
cross-env NODE_ENV=development webpack-dev-server --port 8000 --hot --config ./build/webpack.config.client.js
```

开启 --hot 选项即可，很多教程都说需要配置 new webpack.HotModuleReplacementPlugin 插件，其实当你开启 hot 选项的时候，webpack 已经自动帮你注入了这个插件，当你再重复添加时，会报栈溢出的错误，所以我们记住这里无需再额外手动添加 HotModuleReplacementPlugin 插件。

### webpack-dev-server源码解析

这里我们来简单探究一下 webpack-dev-server 源码，来研究一下它是如何来实现热替换的
需要用到的库

```js
"sockjs": "0.3.19", // 其实应该叫sockjs-node, websocket的服务端实现
"sockjs-client": "1.3.0", // websocket的客户端实现
```

以流程图的形式展示
![](https://img.alicdn.com/tfs/TB1yAZLdEGF3KVjSZFvXXb_nXXa-1968-952.jpg)
这里我们只贴出关键部分代码，不贴出完整代码

```js
// webpack-dev-server/lib/Server.js

createSocketServer () {
// 这里利用sockjs这个库，来创建了一个socketServer
this.socketServer = new SocketServerImplementation(this)
this.socketServer.onConnection((connection) => {
        // onConnection实质上是sockjs的socket.on('connection')
        this.hot = this.options.hot || this.options.hotOnly
        if (this.hot) {
            // 如果开启了hot选项，这里向client发送一条message, client接收这条message在console中打印 Hot Module Replacement enabled.
            this.sockWrite([connection], 'hot')
        }
        // 这里调用了sockWrite设置当前文件的hash值为currentHash
        this._sendStats([connection], this.getStats(this._stats), true)
    })
}

sockWrite(sockets, type, data) {
    sockets.forEach((socket) => {
        // 这里封装了一个send方法，本质上是调用了sockjs的write方法
        this.socketServer.send(socket, JSON.stringify({ type, data }))
    })
}

setupHooks () {
    // 注册钩子
    const addHooks = (compiler) => {
        const { compile, invalid, done } = compiler.hooks
        done.tap('webpack-dev-server', (stats) => {
            // 通过开启webpack --watch选项，在webpack每次编译完新的文件时，触发这个钩子，向sockjs发送新的message，内容为新的静态资源的hash
            // 在_sendStats方法末尾会根据当前编译情况发送error/warning/ok三种类型的message给client
            this._sendStats(this.sockets, this.getStats(stats))
        })
    }

    if (this.compiler.compilers) {
        this.compiler.compilers.forEach(addHooks)
    } else {
        addHooks(this.compiler)
    }
}
```

接下来让我们看看 client 端干了什么

```js
// webpack-dev-server/client-src/default/index.js
const onSocketMsg = {
  // client端监听server端发送的message，调用不同的function
  hash(hash) {
    // 接受type为hash的socket message，将currentHash赋值为hash
    currentHash = hash;
  },

  ok() {
    reloadApp();
  },

  warnings(warnings) {
    reloadApp();
  },
};

function reloadApp() {
  if (hot) {
    log.info('[WDS] App hot update...');
    const hotEmitter = require('webpack/hot/emitter');
    // 如果开启了hot选项，此处通过EventEmitter发送了一个webpackHotUpdate事件, 这个事件在webpack/hot/entry.js中进行接收
    hotEmitter.emit('webpackHotUpdate', currentHash);
  }
}

```

reloadApp顾名思义用来重启App，让他刷新或者热更新，让我们来看看他到底调用了哪些方法

```js
// webpack/hot/entry.js
// 在开启了hot选项时，webpack-dev-server会在entry中加入webpack/hot/entry.js

if (module.hot) {
  var lastHash;
  var upToDate = function upToDate() {
    // hash值变化时，才进行更新操作
    return lastHash.indexOf(__webpack_hash__) >= 0;
  };
  var log = require('./log');
  var check = function check() {
    module.hot
      .check(true) // 调用module.hot.check方法来获取需要更新的模块
      .then(function(updatedModules) {
        if (!updatedModules) {
          // 如果找不到需要更新的模块，直接刷新页面，即当module.hot.accept()未传入参数的情况
          window.location.reload();
          return;
        }
        require('./log-apply-result')(updatedModules, updatedModules); // 打印日志
      });
  };
  var hotEmitter = require('./emitter');
  hotEmitter.on('webpackHotUpdate', function(currentHash) {
    lastHash = currentHash;
  });
}
```
接下来我们调用了HotModuleReplacement这个插件里面的方法，去生成hot-update.json以及hot-update.js两个文件
```js
// webpack/lib/HotModuleReplacement.runtime.js
function hotCheck(apply) {
  // module.hot.check 方法
  return hotDownloadManifest(hotRequestTimeout).then(function(update) {
    // 调用hotDownloadManifest方法，这里会下载一个[hash].hot-update.json文件，文件内容为
    // update = {
    //     c: {Page: true}, chunkName
    //     h: "d754e63a763de18ca841", hash
    // }
    hotRequestedFilesMap = {};
    hotWaitingFilesMap = {};
    hotAvailableFilesMap = update.c; // 这里记录我们当前更新的是哪一个chunkId的文件，比如本应用生成三个chunk，分别是vendor.chunk,runtime~page.chunk,page.chunk,此时我们要更新的是page.chunk.js这个文件。理论上另外两个文件都是属于第三方的，我们实际开发很少去更新它们
    hotUpdateNewHash = update.h;
    {
        /*globals chunkId */
        hotEnsureUpdateChunk(chunkId); // 该方法借助hotAvailableFilesMap主要用来下载hot-update.js,确定该文件应该去下载哪一个chunk的信息
    }
    var promise = new Promise(function(resolve, reject) {
        // 调用hotUpdateDownloaded方法，用下载的hot-update.js的文件内容来更新旧的模块
        hotUpdateDownloaded();
    });
    return promise;
}

function hotUpdateDownloaded() {
    if (hotApplyOnUpdate) {
        Promise.resolve()
            .then(function() {
                return hotApply(hotApplyOnUpdate); // 核心代码
            })
    }
}
```

hotApply就是webpack-dev-server的核心实现了，由于该方法代码过多，故只挑出关键部分讲解
```js
function hotApply () {
    for(let moduleId in hotUpdate) {
        // 首先该方法遍历了你修改了代码的模块(文件),此处我们以修改web/index/index.js为例
        // getAffectedStuff获取到你的模块的parent以及parent的parent这样递归，即加载了这个模块的模块，在此处是config/config.default.js以及web/entry.js
        result = getAffectedStuff(moduleId);
        // 最终我们得到的result对象是这样的
        // {
        //     moduleId: "./web/page/index/index.js"
        //     outdatedDependencies: {} // 该对象收集了该模块用module.hot.accept接收的依赖更新，当前并没有设置，故为空对象
        //     outdatedModules: (3) ["./web/page/index/index.js", "./config/config.default.js", "./web/entry.js"] module的所有parents
        //     type: "accepted"
        //     __proto__: Object
        // }

        // 接下来它移除了旧的模块的require缓存，包括其父级模块的缓存
        // remove module from cache
        for (let moduleId in result.outdatedModules) {
            delete installedModules[moduleId];

            // when disposing there is no need to call dispose handler
            // 移除在modue.hot.accept中注册的监听器，此时并没有注册，为空对象
            delete outdatedDependencies[moduleId];
        }

        // 接下来要做的事情，就是用新下载下来的模块文件去替换旧的
        // insert new code
 		for (moduleId in appliedUpdate) {
 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
                 modules[moduleId] = appliedUpdate[moduleId]; // modules包含了当前页面加载的所有模块内容，此时将新的模块内容挂在modules上
 			}
         }
        // call accept handlers
        for (moduleId in outdatedDependencies) {
            // 接下来调用了所有在module.hot.accept注册的handlers
        }
        // 到这差不多就结束了。。。核心代码就是hotApply这个方法，这个方法的代码行数也特别多，虽然没有做到逐行代码讲解，但详细程度应该也超过目前任何一篇分析文章了。毕竟webpack里面黑科技太多了。有兴趣的同学建议打断点来逐行看变量具体内容来慢慢分析其过程

    }

}
```

### 中间件

由于 webpack-hot-middleware 本质也是使用 EventSource(类似 websocket) 来实现 hmr，故这里只介绍用法，不深入到源码级别

```js
const devMiddleware = require('./devMiddleware') // 分别加载webpack-dev-middleware以及hot-middleware两个中间件，只是我们这里改造成了适合koa的中间件写法
const hotMiddleware = require('./hotMiddleware')
const compose = require('koa-compose')
const webpack = require('webpack')
const devConfig = require('/build/webpack.config.client.js')
const kwm = require('kwm')
const Koa = require('koa')
const app = new Koa()

const kwm =  (compile, devConf, hotConf) => {
    // 将两个中间件组合成一个中间件，简化代码，实际应用，kwm可以单独发布为第三方模块
  return compose([
    devMiddleware(compile, Object.assign({
      serverSideRender: true
    }, devConf)),
    hotMiddleware(compile, Object.assign({
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 2000
    }, hotConf))
  ])
}

const compile = webpack(devConfig)

app.use(kwm(compile, {
  logLevel: 'silent'
}))

const port = 3000
app.listen(port)

```

### CSS HMR 实现

大部分框架实现 css hmr 用的都是 style-loader,主要还是 style-loader 中使用了 module.hot.accept，在 CSS 依赖模块更新之后，会将其 patch(修补) 到 style 标签中。
但在该应用中，为了保持开发环境和生产环境的统一，因为在生产环境我们需要将 css 提取为单独文件，而不是以 style 标签的形式，所以这里我们没有用 style-loader,而是用 css-hot-loader
来实现 hmr。
参考 react-hot-loader 来实现一个 css-hot-loader 也不难。每次热加载都是一个 js 文件的修改，每个 css 文件在 webpack 中也是一个 js 模块，那么只需要在这个 css 文件对应的模块里面加一段代码就可以实现 css 文件的更新了。本质也是修改 css 的时候让浏览器去下载一个新的 css 文件

```js
let loaders = [
  {
    loader: require.resolve('css-hot-loader'),
  },
  {
    loader: MiniCssExtractPlugin.loader,
    options: Object.assign(
      {},
      shouldUseRelativeAssetPaths ? {publicPath: '../../'} : undefined
    ),
  },
  {
    loader: require.resolve('css-loader'),
    options: cssOptions,
  },
];
```
