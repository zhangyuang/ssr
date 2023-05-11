# Vite

本章介绍如何在 `ssr` 框架中使用 `Vite` 作为开发工具 
## 5 分钟了解 Vite

> Vite (法语意为 "快速的"，发音  /vit/) 是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：
>
> - 一个开发服务器，它基于原生 ES 模块提供了丰富的内建功能，如速度快到惊人的   模块热更新（HMR）。
> - 一套构建指令，它使用  Rollup  打包你的代码，并且它是预配置的，可以输出用于生产环境的优化过的静态资源。

从上述来自官方文档的描述中，我们可以很清晰的知道，`Vite`本质上就是一种构建工具，它在开发环境里主要充当一个基于原生 [esm](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules) 的开发服务器的角色，在生产环境则使用一套基于 `rollup` 的构建指令负责生产环境的打包工作。因此，vite 的大部分优势主要都体现在开发环境。

既然是构建工具，为啥不继续用 `Webpack` 呢？

快！`Vite`能够在开发服务器启动时长和热更新响应速度上给你一个 surprise！一旦你体验到 `Vite` 有多快，我们十分怀疑你是否愿意再忍受像曾经那样使用打包器开发。

通过下面的命令，你可以快速的进行基于`Vite`的 vue 开发体验，想要更多了解有关 Vite 的内容，可以前往[Vite 官方文档](https://cn.vitejs.dev/)。

## SSRv6.0 + Vite

本章介绍 `ssr` 框架 `6.0` 版本全新的 `Vite SSR` 体验

### 快速开始 

在 `React/Vue3` 场景中我们都已经以最小化成本的方式接入 `Vite`。在 `Vue2` 场景中，由于 [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2/issues/31) 的限制，我们暂时无法使用 `vite ssr`。

```shell
$ npm init ssr-app my-ssr-project # 如需要使用 Vite 这里可以选择创建 React/Vue3 类型的应用
$ cd my-ssr-project && yarn
$ npx ssr start --vite # 等价于 npm run start:vite
$ npx ssr build --vite # 等价于 npm run build:vite
$ npm run prod:vite # 生产环境启动
```

也可以在 `config.ts` 中显式的添加 `isVite` 选项来固定启动模式

```js
// 添加后无需 ssr start/build 新增 --vite 参数
import type { UserConfig } from 'ssr-types'

const userConfig: UserConfig = {
    isVite: true
}

export { userConfig }
```

完成上述步骤即可使用 `Vite` 作为构建工具体验极快的开发速度
### 框架背景

关于[ssr](https://github.com/zhangyuang/ssr) 框架的介绍请查看[文章](http://doc.ssr-fc.com/docs/why)

### 前言

在 `5.x` 版本的 `ssr` 框架中，当时出于开发时间限制以及改动成本的关系，我们采用的方案是服务端 `bundle` 走 `Webpack` 编译，客户端文件走 `Vite` 服务的 `vite ssr` 这样的架构模式，来保证最小化代码的改动。现在看来当时的决定是非常正确的，确实 `vite ssr` 在那个时候有不少不成熟的地方也在这段期间中被 `Vite` 官方团队逐一的解决，并且本人也在这段开发期间深度阅读了 `vite ssrloadModule` 这块的源码对它的运行机制有了更深刻的了解。也在这个过程中尝试对 `Vite` 做了一些微小的[贡献](https://github.com/vitejs/vite/pulls?q=zhangyuang)。在这里感谢 `Vite` 团队的付出和及时的响应。

### 现状

那么，在 `6.0` 版本的 `ssr` 框架中，我们做到了 `All in Vite`，也就是提供了全套只使用 `Vite` 作为开发工具的开发链路来体验极快的启动速度。同时我们分离了 `Webpack` 与 `Vite`。也就是说开发者可以任意的选择喜欢的工具。

开发者可以选择 `ssr/csr + 本地开发 Webpack/Vite + 生产环境构建 Webpack/Vite + Midway/Nest.js` 这样的任意组合方式。同时我们在新增功能的保持对代码行数的克制，使得框架总代码量在没有刻意优化的情况下仍然保持在 `6000行` 左右单前端框架场景在 `2500` 行左右。

那么先让我们用动图看看分别用 `Webpack/Vite` 启动的速度差别吧。如果图片动不了，请使用 `Chrome` 浏览器打开网页


### Webpack 启动

启动时间 = 初始化模块加载 + 编译服务端/客户端 bundle 时间 + Midway 启动时间

![](http://doc.ssr-fc.com/images/start-webpack2.gif)

### Vite 启动

启动时间 = 更少的初始化模块加载 + Midway 启动时间

![](http://doc.ssr-fc.com/images/start-vite3.gif)

<!-- ### 应用结构

对于应用结构这里简单画了一个示意图如下。

![](http://doc.ssr-fc.com/images/vite1-1.png)

具体的 `vite ssr` 结构如下图

![](http://doc.ssr-fc.com/images/vite1-3.png)


在服务端我们用 `ssrLoadModule` 这个 `API` 来转换模块。客户端以中间件的形式让 `Vite` 接管请求。与 `Webpack SSR` 架构类似。在服务端和客户端我们有两套不同的 `vite.config` 配置，所以我们不会将 `vite.config.js` 直接暴露出来。而是通过框架统一的配置项抛出配置，请查看[viteConfig](./api$config#viteConfig)。 -->
### 开发建议

由于 `Vite/Rollup` 没有 `Webpack-Chain` 这样的模块来生成配置，目前只能用一些比较笨的方式来 `Merge` 用户自定义配置。所以容易造成用户配置覆盖框架默认配置的情况。所以目前框架只会开放少量配置让用户自定义配置。在之后我们会不断完善这一块。

正如上文所说的，开发者有多种开发构建组合方式。只要不使用只能够在特定平台运行的代码例如 `import.meta.env/module.hot` 这些代码，那么你的代码在 `Vite/Webpack` 模式下都能够本地运行，生产环境构建成功。所以不建议开发者使用只能在特定工具下运行成功的代码以及配置。框架将会在之后将不同的工具的配置进行打平，抛出一个共同使用的配置项供开发者使用。
<!-- 
综上所述，我们已经迈出了最困难的一步，接下来的做法就是抹平 `Vite/Webpack` 在本框架中的使用差异，配置差异，构建差异。做到 `Webpack/Vite` 无缝切换 -->

<!-- ### 踩坑记录

以下记录开发 `vite ssr` 时遇见的问题，给其他框架开发者作为参考

#### 干掉 CommonJS

`ssrLoadModule` 方法传入的文件中只能够使用 `es6 module` 语法，不能够出现 `require/module` 等 `commonjs` 关键字，如必须使用，可使用 [createRequire](http://nodejs.cn/api/module.html#modulecreaterequirefilename) 方法。

原因是因为 `ssrLoadModule` 采用 `new Function` 的形式执行入口文件。

```js
const AsyncFunction = async function () {}.constructor as typeof Function
const initModule = new AsyncFunction(
  `global`,
  ssrModuleExportsKey,
  ssrImportMetaKey,
  ssrImportKey,
  ssrDynamicImportKey,
  ssrExportAllKey,
  result.code + `\n//# sourceURL=${mod.url}`
)
await initModule(
  context.global,
  ssrModule,
  ssrImportMeta,
  ssrImport,
  ssrDynamicImport,
  ssrExportAll
)
```
函数内部只能够访问 `new Function` 传入的变量，并且这些变量都是被 `Vite` 替换过一遍的。换句话说 `import Vue from 'vue'` 实际执行的是 `const Vue = await __vite_ssr_import__('vue')`。操作都会被 `Vite` 定义的函数接管。`new Function` 中没有传入 `require` 所以自然在代码内部无法识别 `require` 关键字。

也就是说形如下面的代码是无法直接运行的

```js
const getConfig = () => require(resolve(process.cwd(), './config'))
```

#### 第三方模块必须显示添加到项目的 dependencies 或者 external

上面讲到了 `Vite` 使用  `new Function` 的形式来执行入口文件，对于入口文件中依赖的第三方模块或者是自身引用的相对路径模块 `Vite` 都有不同的处理方式。对于第三方模块一般是直接使用原生的 `const module = return import(file)` 的形式读取。

```js
const ssrImport = async (dep: string) => {
    if (dep[0] !== '.' && dep[0] !== '/') {
      // 原生的 import 方法处理第三方模块
      return nodeRequire(
        dep,
        mod.file,
        server.config.root,
        !!server.config.resolve.preserveSymlinks
      )
    }
    // 处理非第三方文件，会调用 vite 自身的 transform 逻辑进行代码转换以及 new Function 代码执行
    // xxx 省略
  }
```

这里有一个巨坑，就是 `ssrLoadModule` 里面执行的入口文件中依赖的第三方模块必须显示列在 `dependencies` 或者手动添加到配置中的 `ssr.external`，否则 `Vite` 这块的处理会有问题。举个🌰，当我们在 `server-entry` 中引用了 `semver` 这个只提供了 `CommonJS` 格式的模块

```js
import semver from 'semver'
```

如果你没有把它列在 `dependencies` 中将会被解析成

```js
// error
const __vite_ssr_import_0__ = await __vite_ssr_import__("/node_modules/semver/index.js?v=cea99eb4");
// true
const __vite_ssr_import_0__ = await __vite_ssr_import__("semver");
```

这样的错误路径在 `__vite_ssr_import__` 中不会被当作第三方模块进行处理，会继续以 `new Function` 的形式解析，导致错误。

这个问题我在 `Vite` 的源码中横跳了一天才发现。因为 `ssr-server-utils/serialize-javascript` 被 `ssr-core-vue3` 给依赖了，所以应用本身并没有列出它们在 `dependencies` 中，导致本地 `link` 能够正常运行，但是正式 `publish` 后死活也无法运行。

#### 分成两个 vite 配置

在官方的 `ssr-vue` 示例中前端服务端公用了一个 `vite.config` 文件，对于简单的应用来说这足够了，但对于大型应用来说这块最好是沿用 `Webpack` 场景下的思路，将服务端客户端的配置文件分离，优势在于我们可以通过 `define __isBrowser__` 这样的关键字在业务代码中区分当前环境。

尽管 `Vite` 也提供了 `import.meta.env.SSR` 这样的关键字来区分环境，但依赖只能够在在特定工具下运行的代码不是一个好的方案。特别是当我们做构建时要对服务端，客户端的代码做不同的构建配置

#### 缺少 manifest-plugin 以及 MagicComment

对于 `Rollup` 来说，官方原生没有提供 `manifest-plugin` 这样的插件来提供源文件与构建后的 `hash` 文件映射关系，需要开发者自己寻找第三方插件或者自行编写。

其次 `Rollup` 缺少 `import(/* webpackChunkName */)` 这样的 `MagicComment` 来定义 `chunkName`, 只能够通过 `manualChunks` 以及自行编写插件来实现对应的功能。对于开发者来说是一种挑战。

对于上面的两个问题尽管 `Vite` 官方提供了 `ssr-manifest` 这样的插件来生成一些映射关系做资源预加载，但在一些场景下仍然不够用。特别是当我们组建渲染返回的结果是 `stream` 时，这样的字符串动态替换插值的方式就用不了了。

## 升级步骤

对于之前使用 `5.x` 的开发者来说要如何进行升级呢？

我们在业务代码层面和应用配置层面没有任何破坏性变更所有的开发习惯跟之前一样。唯一的区别在于开发者不再需要 `5.0` 版本的 `vite.config` 文件

- 更新所有 `ssr-*` 相关依赖到 `^6.0.0` 或者直接 `npm init ssr-app` 创建最新的模版对比, 以 `midway-vue3` 为例
```json
"dependencies": {
    "ssr-core-vue3": "^5.0.0",
    "ssr-types": "^5.0.0",
    "swiper": "6.7.5",
    "vue": "^3.0.0",
    "vue-router": "^4.0.0",
    "vuex": "^4.0.0"
},
"devDependencies": {
  "ssr": "^5.0.0",
  "ssr-plugin-midway": "^5.0.0",
  "ssr-plugin-vue3": "^5.0.0",
  "typescript": "^4.0.0"
},
```
- 删除原有的 `vite.config.js` 文件，如之前没有创建，则不需要删除
- 服务端静态资源文件夹新增 `build/client` 文件夹
```js
// midway config.default.js
config.static = {
    prefix: '/',
    dir: [join(appInfo.appDir, './build'), join(appInfo.appDir, './public'), join(appInfo.appDir, './build/client')]
}
// nestjs main.ts
app.useStaticAssets(join(getCwd(), './build/client'))
```

- `package.json` 新增 `ssr build --vite` 相关脚本

```json
"scripts": {
  "start:vite": "ssr start --vite",
  "build:vite": "ssr build --vite"
}
```
## 以下为旧内容

以下为 `5.0` 版本的 vite ssr 实现原理，可以不阅读，也可以作为额外材料了解变迁历史进行阅读

### SSR + Vite 实现机制

`注：此章节内容，如果是之前未了解过服务端渲染原理的同学可能阅读起来会有一定障碍。`

通过阅读 `Vite` 官方给出的 [SSR Demo](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue) ，我们得知在[服务端打包入口](https://github.com/vitejs/vite/blob/main/packages/playground/ssr-vue/src/entry-server.js)与[客户端打包入口](https://github.com/vitejs/vite/blob/main/packages/playground/ssr-vue/src/entry-client.js)文件这一块，其实与原来的 `Webpack` 场景几乎没有任何区别可以直接移植。值得关注的点如下:

#### Vite MiddleWare

如下代码所示

```js
if (!isProd) {
    vite = await require('vite').createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true
      }
    })
    // use vite's connect instance as middleware    app.use(vite.middlewares)
  } else {
    app.use(require('compression')())
    app.use(
      require('serve-static')(resolve('dist/client'), {
        index: false
      })
    )
  }
```

`Vite` 在本地开发时，提供了中间件的形式可以在任何 `Node.js` 框架接入。默认的示例使用的是 `express`。此中间件的作用是接管客户端文件的请求。相比于 `Webpack` 构建出来的 `bundle` 执行流程的区别如下

- Webpack: 服务端渲染组件为 html 字符串或者流 -> 浏览器接受展示首屏内容 -> 浏览器加载 Webpack 根据 `entry-client` 构建出来的客户端 bundle 进行 `hydrate` 激活 dom。
- Vite: 服务端渲染组件为 html 字符串或者流 -> 浏览器接受展示首屏内容 -> 浏览器直接加载 `entry-client` 文件，再根据实际的业务以 http 请求的方式加载 `entry-client` 所依赖的文件，到这里也就是跟常规的 `Vite` 客户端应用一样会在浏览器中看到一排文件列表。

相比于使用 `Webpack` ,`Vite`少了构建 bundle 的操作，来提升应用的启动速度和 HMR 速度,而在生产环境时，`Vite` 则使用 `Rollup` 来将代码打包成一个 `bundle` 放在静态资源文件夹中加载，这种形式执行起来就跟 `Webpack` 没有任何区别了。因此只有在本地开发时才会感受到明显区别。

#### Vite LoadModule

此外，在本地开发阶段 `Vite` 还提供了 `LoadModule` API 来解析 `entry-server`, 使得我们可以直接在 `Node.js` 环境执行 `ESM` 格式的代码，且支持 `HMR`

```js
const render = (await vite.ssrLoadModule('/src/entry-server.js')).render
```

分析完之后其实一个 `Vite SSR` 应用的执行流程就很容易看懂了。但是我们的框架并没有采用跟官方一样的方案思路。理由如下:

#### SSR 框架升级策略

下面介绍了一下本框架是如何最小成本化的接入 `Vite` 的，如果有不准确的地方可以提 issue 会及时的进行更正。

首先在 Vite 出现大部分类似的框架都是使用 `Webpack` 来作为构建工具，如果全量切换成 `Vite` 或者将 `Webpack` 与 `Vite` 完全隔离以插件的形式来让用户决定到底是用 `Webpack` 还是 `Vite` 进行构建，那么改动量我认为前者会非常大，后者的工作量也不小。但是其实在我们的框架完全分离其实也不难，因为我们的核心源码也就几千行，不像 Next, Nuxt 这种代码巨无霸级别的项目就算支持了 `Vite` 我认为 Bug 也会非常多。但是即使是这样，在这个版本中，我们仍没有打算完全的分离 `Webpack` 与 `Vite`，理由如下

- 本框架原 `Webpack` 构建逻辑非常成熟，包括 `externals` 逻辑以及接入第三方 UI 库 如 `antd`, `vant` 样式处理，以及各种 `loader` 逻辑。如果完全迁移成 `Vite + Rollup` 的形式在稳定性和一致性上需要花较多功夫调试。  

- 我们认为 `Vite` 最大的发挥场景还是在浏览器当中，`vite.ssrLoadModule` 方法虽然能够让我们在本地开发时 `Node.js` 环境中直接使用 `ESM` 模块，但该方法目前还不够完善，使用起来会有很多问题。例如在使用`antd/vant`这样的依赖时，由于 `antd/vant` 在使用 `babel-plugin-import` 导入时会在一个 js 文件中去 require 样式文件。由于缺少了 `bundle` 的这个过程，对于 服务端入口这一块的处理会非常麻烦。但就算不使用 `babel-plugin-import` 直接去 `import` 具体的文件也会遇到一些问题。不过在生产环境并不会使用该方法
- 开发环境下首屏样式闪烁。由于 `Vite` `nobundle` 的特性，只有在文件请求到达浏览器的时候，我们才知道该请求的依赖。所以就导致我们只有在加载完 `entry-client` 文件后再依次加载首屏需要用的文件，包括样式文件。这之后样式才能够正常展示，目前官方的 [playground demo](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue) 就存在这个问题。Webpack 场景下的常规的解决方案是在构建时我们能够知道首屏需要依赖的 `css` 文件，提前打包成独立文件或者 `style` 标签的形式在服务端注入到页面头部。不过由于 `Vite` 存在 `optimize` 预优化这个过程，这个过程中会分析文件的依赖链，所以我们认为要解决的话在 `ssrLoadModule` 中做一些逻辑应该也有对应的解决方案。  


由于上述原因，在这个版本中我定下的接入 `Vite` 方案如下

- 同时支持 `Webpack/Vite` 两种方案，当使用 `ssr start --vite` 进行本地开发时使用 `Webpack` 去打包 服务端 `bundle`，然后在 Node.js 框架中加载 `Vite` 提供的中间件，让 `Vite` 服务接管客户端文件请求。
- 生产环境仍使用 `Webpack` 去构建项目。

此方案的优劣势如下

#### 优势

- 稳定，只有本地开发才会用的 `Vite`，生产环境的行为仍和以前一致不需要担心，且本地开发时 `Vite` 我们只在客户端渲染的过程中使用，`Vite` 在这一过程是相当稳定的，这样我们几乎无需修改默认的任何配置即可得到稳定的服务端 `bundle` 构建服务以及 稳定的客户端文件渲染服务。
- 改动成本极低，对于框架层面的改动我们其实只需要在本地开发时砍掉原来的 Webpack 构建客户端 bundle 的步骤以及服务端新增接入 `Vite` 中间件的操作，再将本来的一些 `entry-client` 中的语法改成 ESM 即可完成迁移。统计了一下大概改动量在几十行代码左右。

#### 不足

- 由于我们在本地开发与生产环境使用了不同的工具，这就会导致我们不能过分依赖某一个工具的某一配置特性，这样需要在本地开发和生产环境都做对应配置的兼容。好在我们默认的 Webpack 配置以及 `Vite` 默认的配置已经足够 cover 绝大多数客户端应用执行过程所需要的功能无需额外配置。我们尽量会在框架层面抛出一个通用配置来让用户使用，而不是让用户去更改具体的构建配置。

### 性能对比

由于我们仍然使用了 `Webpack` 去构建服务端 bundle 所以注定我们的性能速度跟 All in `Vite` 的情况肯定还是存在一定差异的。但其实就如同上面提到的，Webpack 的最大问题从来不是性能并且本框架之前的 `Webpack` 配置性能已经足够使用了，特别是在打包服务端 bundle 这一块，由于我们开启了 `externals` 配置需要打包的文件体积非常小，所以我们的打包速度大概在 2s 内即可完成。

改造后使用 `Vite` 启动的构建步骤如下

1.  启动命令 `import` 一些 必要的模块，这里我们已经对 `Webpack` 的依赖做了细致的分离，例如在 `Vite` 场景下很多 `Webpack` 打包客户端 bundle 所需要的依赖我们是没有必要加载的，这样会拖慢我们的启动速度。
2.  `Webpack` 构建服务端 bundle (耗时在 2s 左右)
3.  `Midway/Nest.js` 服务启动，加载 Vite 中间件 (耗时在 3s 左右)

以图表的形式展示的话如下

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8eb34864ad62452b89d72c8f934cfaf3~tplv-k3u1fbpfcp-zoom-1.image)

跟之前版本的做法比起来。在启动速度上，我们少了构建客户端 `bundle` 这一步，时间大概能减少 2s 左右当应用变得庞大时这块的时间差距应该会更加明显, `HMR` 速度则提升的更加明显，主要是之前的 Webpack 版本构建速度已经足够快了。如果你之前使用的是 Nuxt, Next 这种项目稍微一大起来速度就慢的跟蜗牛一样的巨无霸框架那你应该能感受到明显的速度提升。

跟 `All in Vite` 的方式比起来，我们多了一个 `Webpack` 构建服务端 `bundle` 的耗时。至于 `Midway/Nest.js` 服务启动，加载 Vite 中间件这一步无论你使用什么方案这都是必经之路这块的速度可以让 Midway 的同学优化一下。

下面将在实际项目中进行最直观的速度对比。

#### 使用 Webpack 启动应用

以默认创建并发布到 `Serverless` 的 [example](http://ssr-fc.com/) 作为示例，该示例包含首页，详情页。使用了 `vue-router`, `vuex`, `swiper` 等基础组件，虽然复杂度比不上真实应用，但涉及到的功能和真实线上应用区别不大。使用 `Webpack` 构建

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e2310613a9b40ac87c87eae3459e7b8~tplv-k3u1fbpfcp-zoom-1.image)

可以看出完整启动时间大概在 6s 左右
#### 使用 Vite 启动应用

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/198b345679894bb0992353dfaa9d440f~tplv-k3u1fbpfcp-zoom-1.image)

启动时间缩短到了 3 秒左右，并且此时我们的前端页面行为都被 Vite 接管。比如当我们修改前端组件时可以看到终端 Vite HMR 的提示。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa9d0ae2eeb24c8fbf5c300b1df5e375~tplv-k3u1fbpfcp-zoom-1.image)
#### 性能总结

从上述对比中，我们可以看出在使用 `Vite` 模式时的启动时间仅为原 `Webpack` 模式的 `50%` 左右，这样的提升是非常可观的。可以预见当应用足够大时，提升的效果会更加明显。

### 注意事项

注: 切记，我们只会在 `本地开发` 阶段使用 `Vite`，生产环境仍然用 `Webpack` 进行构建。所以请不要依赖只能够在 `Vite` 场景生效的 `vite.config.js` 配置。建议只使用默认生成的 config 文件具备的功能来保持本地开发与生产环境行为一致。否则你需要同时在 `Vite` `Webpack` 场景保持配置的一致性
### 未来展望

并不排除未来本框架会提供 `All in Vite` 的方案，来将 `Vite` 与 `Webpack` 完全分离供开发者使用 -->