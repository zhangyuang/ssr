# Vite

### 5 分钟了解 Vite

> Vite (法语意为 "快速的"，发音  /vit/) 是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：
>
> - 一个开发服务器，它基于原生 ES 模块提供了丰富的内建功能，如速度快到惊人的   模块热更新（HMR）。
> - 一套构建指令，它使用  Rollup  打包你的代码，并且它是预配置的，可以输出用于生产环境的优化过的静态资源。

从上述来自官方文档的描述中，我们可以很清晰的知道，`Vite`本质上就是一种构建工具，它在开发环境里主要充当一个基于原生 esm 的开发服务器的角色，在生产环境则使用一套基于 rollup 的构建指令负责生产环境的打包工作。因此，vite 的大部分优势主要都体现在开发环境。

既然是构建工具，为啥不继续用 webpack 呢？

快！`Vite`能够在开发服务器启动时长和热更新响应速度上给你一个 surprise！一旦你体验到 Vite 有多快，我们十分怀疑你是否愿意再忍受像曾经那样使用打包器开发。

通过下面的命令，你可以快速的进行基于`Vite`的 vue 开发体验，想要更多了解有关 Vite 的内容，可以前往[Vite 官方文档](https://cn.vitejs.dev/)。

```bash
yarn create @vitejs/app my-vue-app --template vue
```

### 使用 Vite 作为构建工具

在 React/Vue2/Vue3 中我们都已接入 `Vite` 并且 将 `Vite` 作为一个可选配置，底层已做兼容，但默认不会安装 Vite 相关依赖。我们建议你阅读该[文章](https://zhuanlan.zhihu.com/p/362500516)以获得更加详细的了解避免出错, 具体使用方式如下

```bash
$ npm init ssr-app my-ssr-project --template=midway-vue3-ssr # 创建 Vue3 SSR 应用，同时支持 Serverless 形式一键发布或以传统 Node.js 应用的形式部署
$ cd my-ssr-project && npm i && npm i vite @vitejs/plugin-vue --save-dev # 根据实际技术栈安装需要的插件 例如 vue2 场景安装 vite-plugin-vue2
$ npx ssr start --vite # 建议在 package.json 中添加 "start:vite": "ssr start --vite"
```

即可使用 Vite 作为构建工具接管客户端文件，提升启动速度和 HMR 速度。

#### 老应用迁移

分为 React 应用和 Vue 应用有不同的迁移步骤

##### Vue 应用迁移

之前创建的模板应用只需以下三步便可接入 Vite

- 安装最新版本的插件依赖 version >= 5.5.1
- layout/index.vue 中添加 `<slot name="viteClient" />` 参考该[文件](https://github.com/ykfe/ssr/blob/dev/example/midway-vue3-ssr/web/components/layout/index.vue)
- 服务端应用启动时中间件初始化改为 `async await` 形式, 参考该[文件](https://github.com/ykfe/ssr/blob/dev/example/midway-vue3-ssr/src/app.ts#L11)

##### React 应用迁移

之前创建的模板应用只需以下四步便可接入 Vite

- 安装最新版本的插件依赖 version >= 5.5.16
- layout/index.tsx 中添加 `{props.viteReactScript}` 相关代码,参考该[文件](https://github.com/ykfe/ssr/blob/dev/example/midway-react-ssr/web/components/layout/index.tsx#L27)
- 服务端应用启动时中间件初始化改为 `async await` 形式, 参考该[文件](https://github.com/ykfe/ssr/blob/dev/example/midway-react-ssr/src/app.ts#L11)
- 修改 CSS 文件名后缀，由于本框架默认为所有类型的样式文件都使用 `css modules`，而 `Vite` 只会对 `.module.css` 结尾的文件使用 `css modules`， 为了保证样式正确展示，我们需要将原模版的 less 文件后缀名都改为 `.module.less` 引入。参考最新的[模版文件](https://github.com/ykfe/ssr/tree/dev/example/midway-react-ssr/web)代码。

`注: 切记，我们只会在本地开发阶段使用 Vite，生产环境仍然用 Webpack 进行构建。所以请不要依赖只能够在 Vite 场景生效的 vite.config.js 配置。建议只使用默认生成的 config 文件具备的功能来保持本地开发与生产环境行为一致`

### SSR + Vite 实现机制

`注：此章节内容，如果是之前未了解过服务端渲染原理的同学可能阅读起来会有一定障碍。`

通过阅读 Vite 官方给出的 [SSR Demo](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue) ，我们得知在[服务端打包入口](https://github.com/vitejs/vite/blob/main/packages/playground/ssr-vue/src/entry-server.js)与[客户端打包入口](https://github.com/vitejs/vite/blob/main/packages/playground/ssr-vue/src/entry-client.js)文件这一块，其实与原来的 Webpack 场景几乎没有任何区别可以直接移植。值得关注的点如下:

#### Vite MiddleWare

如下代码所示

```
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

Vite 在本地开发时，提供了中间件的形式可以在任何 Node.js 框架接入。默认的示例使用的是 `express`。此中间件的作用是接管客户端文件的请求。相比于 Webpack 构建出来的 bundle 执行流程的区别如下

- Webpack: 服务端渲染组件为 html 字符串或者流 -> 浏览器接受展示首屏内容 -> 浏览器加载 Webpack 根据 `entry-client` 构建出来的客户端 bundle 进行 `hydrate` 激活 dom。
- Vite: 服务端渲染组件为 html 字符串或者流 -> 浏览器接受展示首屏内容 -> 浏览器直接加载 `entry-client` 文件，再根据实际的业务以 http 请求的方式加载 entry-client 所依赖的文件，到这里也就是跟常规的 Vite 客户端应用一样会在浏览器中看到一排文件列表。

相比于使用 `Webpack` ,`Vite`少了构建 bundle 的操作，来提升应用的启动速度和 HMR 速度,而在生产环境时，Vite 则使用 Rollup 来将代码打包成一个 bundle 放在静态资源文件夹中加载，这种形式执行起来就跟 Webpack 没有任何区别了。因此只有在本地开发时才会感受到明显区别。

#### Vite LoadModule

此外，Vite 还提供了 `LoadModule` API 来解析 `entry-server`, 使得我们可以直接在 Node.js 环境执行 ESM 格式的代码，且支持 HMR

```
render = (await vite.ssrLoadModule('/src/entry-server.js')).render
```

分析完之后其实一个 Vite SSR 应用的执行流程就很容易看懂了。但是我们的框架并没有采用跟官方一样的方案思路。理由如下:

#### SSR 框架升级策略

下面介绍了一下本框架是如何最小成本化的接入 Vite 的，如果有不准确的地方可以提 issue 会及时的进行更正。

首先在 Vite 出现大部分类似的框架都是使用 `Webpack` 来作为构建工具，如果全量切换成 `Vite` 或者将 `Webpack` 与 `Vite` 完全隔离以插件的形式来让用户决定到底是用 `Webpack` 还是 `Vite` 进行构建，那么改动量我认为前者会非常大，后者的工作量也不小。但是其实在我们的框架完全分离其实也不难，因为我们的核心源码也就几千行，不像 Next, Nuxt 这种代码巨无霸级别的项目就算支持了 `Vite` 我认为 Bug 也会非常多。但是即使是这样，在这个版本中，我们仍没有打算完全的分离 `Webpack` 与 `Vite`，理由如下

- 本框架原 Webpack 构建逻辑非常成熟，包括 externals 逻辑以及接入第三方 UI 库 如 antd, vant 样式处理，以及各种 loader 逻辑。如果迁移成 Vite + Rollup 的形式在稳定性和一致性上需要花较多功夫调试。  

- 我们认为 Vite 最大的发挥场景还是在浏览器当中，`vite.ssrLoadModule` 方法虽然能够让我们在 Node.js 环境中直接使用 ESM 模块，但该方法目前还不够完善，使用起来会有很多问题。例如在使用`antd/vant`这样的依赖时，由于 `antd/vant` 在使用 `babel-plugin-import` 导入时会在一个 js 文件中去 require 样式文件。由于缺少了 bundle 的这个过程，对于 服务端入口这一块的处理会非常麻烦。但就算不使用 `babel-plugin-import` 直接去 import 具体的文件也会遇到一些问题。
- 开发环境下首屏样式闪烁。由于 Vite nobundle 的特性，只有在文件请求到达浏览器的时候，我们才知道该请求的依赖。所以就导致我们只有在加载完 `entry-client` 文件后再依次加载首屏需要用的文件，包括样式文件。这之后样式才能够正常展示，目前官方的 [playground demo](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue) 就存在这个问题。Webpack 场景下的常规的解决方案是在构建时我们能够知道首屏需要依赖的 css 文件，提前打包成独立文件或者 style 标签的形式在服务端注入到页面头部。不过由于 Vite 存在 optimize 预优化这个过程，这个过程中会分析文件的依赖链，所以我们认为要解决的话在 `ssrLoadModule` 中做一些逻辑应该也有对应的解决方案。  


由于上述原因，在这个版本中我定下的接入 Vite 方案如下

- 同时支持 `Webpack/Vite` 两种方案，当使用 `ssr start --vite` 进行本地开发时使用 Webpack 去打包 服务端 bundle，然后在 Node.js 框架中加载 Vite 提供的中间件，让 Vite 服务接管客户端文件请求。
- 生产环境仍使用 Webpack 去构建项目。

此方案的优劣势如下

##### 优势

- 稳定，只有本地开发才会用的 Vite，生产环境的行为仍和以前一致不需要担心，且本地开发时 Vite 我们只在客户端渲染的过程中使用，Vite 在这一过程是相当稳定的，这样我们几乎无需修改默认的任何配置即可得到稳定的服务端 bundle 构建服务以及 稳定的客户端文件渲染服务。
- 改动成本极低，对于框架层面的改动我们其实只需要在本地开发时砍掉原来的 Webpack 构建客户端 bundle 的步骤以及服务端新增接入 Vite 中间件的操作，再将本来的一些 `entry-client` 中的语法改成 ESM 即可完成迁移。统计了一下大概改动量在几十行代码左右。

##### 不足

- 由于我们在本地开发与生产环境使用了不同的工具，这就会导致我们不能过分依赖某一个工具的某一配置特性，这样需要在本地开发和生产环境都做对应配置的兼容。好在我们默认的 Webpack 配置以及 Vite 默认的配置已经足够 cover 绝大多数客户端应用执行过程所需要的功能无需额外配置。我们尽量会在框架层面抛出一个通用配置来让用户使用，而不是让用户去更改具体的构建配置。

### 性能对比

由于我们仍然使用了 Webpack 去构建服务端 bundle 所以注定我们的性能速度跟 All in Vite 的情况肯定还是存在一定差异的。但其实就如同上面提到的，Webpack 的最大问题从来不是性能并且本框架之前的 Webpack 配置性能已经足够使用了，特别是在打包服务端 bundle 这一块，由于我们开启了 externals 配置需要打包的文件体积非常小，所以我们的打包速度大概在 2s 内即可完成。

改造后使用 Vite 启动的构建步骤如下

1.  启动命令 `import` 一些 必要的模块，这里我们已经对 `Webpack` 的依赖做了细致的分离，例如在 `Vite` 场景下很多 `Webpack` 打包客户端 bundle 所需要的依赖我们是没有必要加载的，这样会拖慢我们的启动速度。
2.  `Webpack` 构建服务端 bundle (耗时在 2s 左右)
3.  `Midway/Nest.js` 服务启动，加载 Vite 中间件 (耗时在 3s 左右)

以图表的形式展示的话如下

![](https://pic1.zhimg.com/80/v2-d7797911d114bf6a27c6225de1f9c518_1440w.jpg)

跟之前版本的做法比起来。在启动速度上，我们少了构建客户端 `bundle` 这一步，时间大概能减少 2s 左右当应用变得庞大时这块的时间差距应该会更加明显, `HMR` 速度则提升的更加明显，主要是之前的 Webpack 版本构建速度已经足够快了。如果你之前使用的是 Nuxt, Next 这种项目稍微一大起来速度就慢的跟蜗牛一样的巨无霸框架那你应该能感受到明显的速度提升。

跟 `All in Vite` 的方式比起来，我们多了一个 `Webpack` 构建服务端 `bundle` 的耗时。至于 `Midway/Nest.js` 服务启动，加载 Vite 中间件这一步无论你使用什么方案这都是必经之路这块的速度可以让 Midway 的同学优化一下。

下面将在实际项目中进行最直观的速度对比。

#### 使用 Webpack 启动应用

以默认创建并发布到 Serverless 的 [example](http://ssr-fc.com/) 作为示例，该示例包含首页，详情页。使用了 `vue-router`, `vuex`, `swiper` 等基础组件，虽然复杂度比不上真实应用，但涉及到的功能和真实线上应用区别不大。使用 Webpack 构建

![](https://pic1.zhimg.com/80/v2-450881a68937e0fe315a7d69d18fc598_1440w.jpg)

可以看出完整启动时间大概在 6s 左右

#### 使用 Vite 启动应用

![](https://pic2.zhimg.com/80/v2-03988c00251f2bb4a39aa798c0bf20f5_1440w.jpg)

启动时间缩短到了 3 秒左右，并且此时我们的前端页面行为都被 Vite 接管。比如当我们修改前端组件时可以看到终端 Vite HMR 的提示。

![](https://pic1.zhimg.com/80/v2-85282ac7c19c0e29fc1793d5735ce648_1440w.jpg)

#### 性能总结

从上述对比中，我们可以看出在使用`vite`模式时的启动时间仅为原 webpack 模式的 50%左右，这样的提升是非常可观的。可以预见当应用足够大时，提升的效果会更加明显。
