# FAQ

本章节记录开发者可能会遇到的常见问题。如果你的问题在这里没有描述，你可以直接去仓库地址提 [issue](https://github.com/zhangyuang/ssr/issues)

## 异常处理问题

### 404 500 异常处理

本章节讲述如何特殊自定义处理 `404`, `500` 等异常情况。

以 `404` 为例，我们在中间件中处理异常情况，以下代码以服务端使用 [Midway.js](https://midwayjs.org/en/docs/middleware#%E7%BC%96%E5%86%99%E4%B8%AD%E9%97%B4%E4%BB%B6) 为例讲述如何使用

```js
// /src/middleware/NotFound.ts
import { Middleware } from '@midwayjs/decorator';
import type { IMiddleware } from '@midwayjs/core';
import type { NextFunction, Context } from '@midwayjs/koa';

@Middleware()
export class NotFoundMiddleware implements IMiddleware<Context, NextFunction> {
  resolve () {
    return async (ctx: Context, next: NextFunction) => {
      try {
        await next()
      } catch (error) {
        if (ctx.status === 404) {
          // 手动建立 /web/pages/404 相关文件 
          ctx.redirect('/404')
        }
      }
    }
  }
}

// /src/configuration.ts
export class ContainerLifeCycle {
  async onReady() {

    this.app.useMiddleware(NotFoundMiddleware);

    await initialSSRDevProxy(this.app);
  }
}

```

在检测到 `status` 异常后，我们有两种处理方案。

- 通过 `ctx.body` 渲染一些简单的提示

```js
if (ctx.status === 404) {
  ctx.body = "404 Not Found"
}
```

也可以服务端使用模版引擎来渲染一些内容丰富的错误界面。此方案在传统场景使用较多。但在 `ssr` 场景我们可以有更加优秀的处理方案

- 重定向到错误路由，且创建路由对应的前端页面

```js
if (ctx.status === 404) {
  ctx.redirect('/404')
}

// controller
@Get('/404')
async handler (): Promise<void> {
  try {
    this.ctx.apiService = this.apiService
    this.ctx.apiDeatilservice = this.apiDeatilservice
    const stream = await render<Readable>(this.ctx, {
      stream: true
    })
    this.ctx.body = stream
  } catch (error) {
    console.log(error)
    this.ctx.body = error
  }
}

```

在检测到错误发生后，我们重定向到 `/404` 路由, 且 `controller` 中定义对该 `path` 的处理逻辑，进行服务端渲染的页面逻辑处理。此时我们可以创建 `web/pages/404` 文件夹。这样我们便可以使用前端组件来开发我们的错误提示页面。可以进行非常丰富的页面内容提示

`500` 错误及其他状态码错误处理方式同上

### 解决服务端代码加载 ESM 格式的模块

这种问题相比于代码调用了浏览器对象导致的错误好解决很多。在 `Node.js` 环境中我们无法直接的运行 `ESM` 格式的代码, 开发者可以通过 [whiteList](./api$config#whiteList) 配置，来将这部分第三方模块的代码进行 `Webpack` 处理后再给到服务端去调用。但这会导致服务端构建后的文件体积增大，会稍稍拖慢构建运行速度。

### 如何解决服务端访问不可访问的对象的问题

`SSR` 是近几年才火热的话题，如果是新的项目且开发人员对 `SSR` 有较深的认知，那么在设计应用的过程中就会有意识的去避免在服务端访问客户端对象的情况。但在老项目或者老的第三方库/框架，或者是开发人员对SSR理解不深刻的情况下，会出现很多类似 `window is not defined` 的错误。

先说前言，个人是不推荐用 `jsdom` 来在服务端模拟客户端环境，这样最多只能模拟最外层的对象例如 `window document` 但如果要访问更深层次的对象例如 `document.getElementById` 则还是会报错。且这种方式新增了一堆很 `dirty` 的代码且不利于 debug 容易造成未知的问题。  

自己的代码我们可以控制，那么如果有第三方模块犯了这种问题应该如何解决呢。在有能力给第三方模块提PR的时候还是建议以PR的形式进行修复。否则情况基本无解，只能够将这部分代码降级到客户端去运行。例如 `antd-pro` 的代码中就存在非常多的这种问题导致无法在服务端运行

比较好的做法，`axios` 就会根据你当前的环境来决定到底是用 `xhr` 对象还是用 `http` 模块来发起请求。如果没办法改动第三方模块，我们可以在代码中延迟加载这些模块，让它在客户端执行的时候被调用。  

#### 解决方式

1. 使用本应用提供的 `__isBrowser__` 常量来判断，一些模块直接在顶层就使用浏览器元素直接 `import` 就会出错，例如引入 `jquery` 可以使用以下引入方式  
   
```js
import $ from 'jquery' // error
const $ = __isBrowser__ ? require('jquery') : {} // true

// vue + vite
async created () {
  // import syntax used in vite scene will return a promise object
  const $ = __isBrowser__ ? await import('jquery') : {}
  this.$ = $
}
// react + vite
let $ = {}
export default  (props: SProps) => {
  useEffect(() => {
    initJquery()
  }, [])
  const initJquery = async () =>{
    $ = await import('jquery')
  }
}
```

2. 在 `didMount` 生命周期加载模块

```js
class Page {
    this.state = {
        $: {}
    }
    componentDidMount () {
        this.setState({
            $: require('jquery')
        })
    }
}
```

3. 如果某个组件调用的方法一定要使用浏览器对象才能得到结果，那么只能将该组件放到客户端进行render了，参考下文的 `onlyCsr`

`__isBrowser__` 结合 `onlyCsr` 可以解决所有遇到的问题  

`注: 不要想着在服务端去访问客户端对象，这意味着你 or 开发第三方模块的人对React SSR的理解不够, 虽然这一开始会导致一定的错误，但对于你去理解SSR的执行机制以及分清楚Server/Client两端的区别帮助很大`



### 如何降级为客户端渲染

在本地开发测试时我们可以通过在请求 `url` 的 `query` 后面添加 `?csr=true` 来以客户端渲染模式进行渲染。

在正式的线上应用执行阶段。我们有多种降级方式。参考 [渲染降级](./features$csr) 章节。
#### 指定页面 ssr

开发者或许需要针对某些页面进行服务端渲染，某些页面不需要。得益于 `ssr` 的强大设计，此功能完全不需要框架底层支持，直接在业务代码实现即可。

```js
import { render } from 'ssr-core'
// 开发者可以在 controller 中根据不同的 path 使用不同的运行配置来决定当前的渲染模式

@Controller('/detail')
const stream = await render<Readable>(this.ctx, {
  // 对 /detail 路由使用 csr 渲染模式
  mode: 'csr'
})
```

#### 通过 config.js

发布的时候支持2种模式，默认是`mode: 'ssr'`模式，你也可以通过 config.js 中的 `mode: 'csr'` 将csr设置默认渲染模式。

#### 通过 core 模块提供的 render 方法降级

在应用执行出错 catch 到 error 的时候降级为客户端渲染。也可根据具体的业务逻辑，在适当的时候通过该方式降级 `csr` 模式

```js
import { render } from 'ssr-core'

try {
  const htmlStr = await render(this.ctx)
  return htmlStr
} catch (error) {
  const htmlStr = await render(this.ctx, {
    mode: 'csr'
  })
  return htmlStr
}
```

当 `server` 出现问题的时候，这样的容灾做法是比较好的。更好的做法是网关层面，配置容灾，将请求打到cdn上。

#### 通过类似于 ActiveMQ、RabbitMQ、RocketMQ、Kafka 等消息中间件或者实时的接口请求来读取配置

代码修改很简单。

```js
const config = await http.get('xxx') // 通过接口|消息中间件拿到实时的config，可以做到应用不发版更新渲染模式
const htmlStr = await render(this.ctx, config)
```

此种场景多用于应急预案处理。

### Vue3 场景使用 teleport 问题

Ref [#5126](https://github.com/vuejs/vue-next/issues/5126) 在 Vue3 SSR 场景下使用 `teleport` 需要注意几点

- to props 不能是 `body`, 可以自己在 `App.vue` 中自定义新的根结点
- `teleport node` 必须被 `div` 包裹起来不能裸写

### Proxy 转发 POST 请求失败

某些用户反馈使用 `config.proxy` 转发 `POST` 请求时会失败，可能是因为 `Midway.js` 底层使用的 `egg` 自带的 `bodyParser` 导致的。如果你遇到了该问题可以尝试以下解决方案。

1. 关闭 `bodyParser`

```js
// config.default.ts

config.bodyParser = {
  enable: false
}
```

2. 发起请求时指定正确的 `content-type`。以 `axios` 为例子

```js
axios({
  url: 'xxx',
  method: 'POST',
  headers: { 'content-type': 'text/json' },
  data: {
    foo: 'bar'
  }
}).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
```

### 页面刷新 404 问题

如果你仔细阅读了 [本地开发](./features$develop) 那么你应该知道该问题为什么会出现。

很明显你只注册了前端路由而没有对应的服务端路由。解决方式，`controller` 注册对应的服务端路由

```js
// controller/xxx.ts
@Get('/')
@Get('/detail/:id')
async handler (): Promise<void> {
  try {
    this.ctx.apiService = this.apiService
    this.ctx.apiDeatilservice = this.apiDeatilservice
    const stream = await render<Readable>(this.ctx, {
      stream: true
    })
    this.ctx.body = stream
  } catch (error) {
    console.log(error)
    this.ctx.body = error
  }
}
```

### Serverless 发布失败

`Serverless` 场景下发布失败有两种情况

- 发布超时
- 包大小压缩后超过 50MB

#### 发布超时

参考[文档](https://www.yuque.com/midwayjs/midway_v2/deploy_aliyun_faq),在 `Mac` 环境通过修改家目录下的阿里云配置文件修改超时时间 `~/.fcli/config.yaml` ，`~` 代表家目录即 `/Users/${userName}`, `Windows` 环境同理，在对应目录找到该文件

#### 包大小超出

由于 `ssr` 场景我们需要开启 `external` 选项，我们需要将 `node_modules` 上传到云服务上。但我们在发布时只会安装 `dependencies` 依赖。绝大部分情况下包大小不会超过 `50MB`，如果确实是因为 `dependencies` 依赖大小超出，可以配置 [whiteList](./api$config#whiteList) 来将该依赖与服务端 `bundle` 打在一起。若能正常运行，则可以将该依赖移除 `dependencies` 加入 `devDependencies`，在发布时则不会安装该依赖。

- `whiteList` 有 `string[]` 和 `RegExp[]` 两种形式，代表不同的含义。在 `Serverless` 发布场景下一般使用` string[]`, 详细解释请查看[whiteList](./api$config#whiteList)字段

下面附上需要将 `antd` 打包进来的配置作为参考，

```js
module.exports = {
  whiteList: ['antd'] // 这里会自动的进行依赖遍历收集
}
```

#### 如何验证本地依赖移动到 dev 后能正常运行

```shell
$ yarn build && rm -rf node_modules && yarn --product && npx xxx # 这里为各自框架的生产环境服务端启动脚本参考 run prod
```


## Vue 场景使用问题

### Vue2 全局注册组件

之前传统 SPA 客户端应用写在 `main.js` 中的全局注册组件方法可以无缝搬迁到 `layout/App.vue` 当中

```html
// layout/App.vue

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// 在这里可以进行一些全局组件的注册逻辑
export default {
   props: ['asyncData']
}
</script>

```
### Vue3 全局注册组件

最新更新： 在之后的版本中我们将移除 `window.__VUE_APP__` 的挂载逻辑，请使用旧写法的开发者按照下面的写法改造。

```html
// layout/App.vue
<template>
  <router-view :asyncData="asyncData" />
</template>

<script lang="ts" setup>
  // 在这里我们可以通过 props.ssrApp 获取 Vue3 App 实例，也可以通过 getCurrentInstance(不建议) 来获取
import { defineProps, App, getCurrentInstance } from 'vue'
import { Button } from 'vant'

const props = defineProps<{
  ssrApp: App,
  asyncData: { value: any }
}>()

const app = props.ssrApp

// const app = getCurrentInstance()?.appContext.app 写法 2
app?.use(Button)
app?.component('xxx')
</script>

```

### Vue 场景使用自定义指令

自定义指令的处理比较特殊，我们需要在服务端定义自定义指令的转换规则，使得可以正常渲染。否则在生产环境构建时会提示错误并且不会生成最终的 `bundle` 文件。

参考讨论 [issue](https://github.com/vuejs/vitepress/issues/92) 以及 [issue](https://github.com/vuejs/vue-next/issues/3298)

我们了解到，需要在服务端 `render` 时定义自定义指令的转换规则。但其实我们大部分的自定义指令我们实际只希望它在客户端渲染过程中生效即可。

所以我们有两种解决方案分别是

- 通过 [ssrVueLoaderOptions](./api$config#ssrVueLoaderOptions) 选项自定义服务端自定义指令的转换规则
- 将使用到自定义指令的元素延迟渲染，使得其只在客户端渲染过程中进行

#### 方案一

`config.js` 中修改 `ssrVueLoaderOptions`

```js
// config.js
const ssrTransformCustomDir = (dir, node, context) => {
  return {
    // do nothing
    props: []
  }
}

module.exports = {
  ssrVueLoaderOptions: {
    compilerOptions: {
      directiveTransforms: {
        focus: ssrTransformCustomDir
      }
    }
  }
}
```

#### 方案二

参考 [如何让某个组件只在客户端渲染](./features$faq#如何让某个组件只在客户端渲染)

### Vue 修改路由钩子

可以直接在组件中通过 `this.$router` 来获取。额外的在 `Vue3` 中你也可以直接通过 [useRouter](https://next.router.vuejs.org/guide/advanced/composition-api.html#accessing-the-router-and-current-route-inside-setup) 来直接拿到 `Router` 实例。

### Vue 添加路由行为

无需在创建路由时传入配置，可后续通过路由实例来修改路由行为。例如注册滚动行为，推荐在 `layout/App.vue` 中设置

```js
this.$router.options.scrollBehavior = (to, from, savedPosition) {
  // always scroll to top
  return { top: 0 }
}
```

### Vue 任意文件获取 Vuex 实例

为了方便开发者在任意地方都能够使用 `Vuex` 实例，这里框架提供了 `useStore` api 可以在任意文件调用

```js
import { useStore } from 'ssr-common-utils'

const store = useStore()

```

### Vue3 任意文件获取 Pinia 实例

在服务端渲染过程中，当我们在非 `setup` 环境调用 `Pinia` 时，其自身并不一定能够准确的判断出当前的实例。在高并发场景可能会导致数据混乱，所以针对这种情况，我们需要手动调用 `api` 时传入当前正确的 `Pinia Instance` ，为了方便开发者在任意地方都能够使用 `Pinia` 实例，这里框架提供了 `usePinia` api 可以在任意文件调用


```js
import { usePinia } from 'ssr-common-utils'

const pinia = usePinia()

const data = usePiniaStore(pinia) // 非 setup 上下文调用时需要手动传入实例

```
### Vue3 任意文件获取 App 实例

为了方便开发者获取 `App` 实例，这里框架提供了 `useApp` api 可以在任意前端组件作用域范围内文件调用(不包括 fetch.ts 的作用域范围内)

```js
import { useApp } from 'ssr-common-utils'

const app = useApp()

app.use('Plugin')
```

### 使用Vue3国际化插件

在 `plugin-vue3` 中，我们已在底层对国际化所需要的 `Webpack-loader` 进行支持。详细见官方文档：https://vue-i18n.intlify.dev/guide/advanced/composition.html

安装最新版本的 `vue-i18n`

```shell
$ npm i vue-i18n@^9.0.0 --save
$ npm i @intlify/vue-i18n-loader@^2.0.3 --save-dev
```

在配置中启用

```js
// config.js
// 启用后构建时会使用相应 loader 进行构建
module.exports = {
  locale: {
    enable: true
  }
}
```

在 `layout/App.vue` 做配置初始化

```js
import { getCurrentInstance } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  // 默认配置
  locale: 'en',
  messages: {},
  globalInjection: true,
  // 模式锁定，传统模式SSR有bug
  legacy: false
})

export default {
  created () {
    const app = getCurrentInstance()?.appContext.app
    app.use(i18n)
  }
}
```

组件中使用

```html

<template>
  <div>
    <select v-model="$i18n.locale">
      <option value="en">
        en
      </option>
      <option value="ja">
        ja
      </option>
    </select>
    <p>{{ t('named', { msg }) }}</p>
    <p>{{ t('list', [msg]) }}</p>
    <p>{{ t('literal') }}</p>
    <p>{{ t('linked') }}</p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
export default {
  setup () {
    const { t } = useI18n({
      messages: {
        useScope: 'local',
        en: {
          msg: 'hello',
          named: '{msg} world!',
          list: '{0} world!',
          literal: "{'hello'} world!",
          the_world: 'the world',
          dio: 'DIO:',
          linked: '@:dio @:the_world !!!!'
        },
        ja: {
          msg: 'こんにちは',
          named: '{msg} 世界！',
          list: '{0} 世界！',
          literal: "{'こんにちは'} 世界！",
          the_world: 'ザ・ワールド！',
          dio: 'ディオ:',
          linked: '@:dio @:the_world ！！！！'
        }
      }
    })

    const msg = computed(() => t('msg'))

    return { t, msg }
  }
}
</script>

<style>

</style>

```

## 使用 UI 框架

默认已经使用 [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)集成按需语法引入的 `UI` 框架

在 `Webpack` 场景可直接使用以下 `UI` 框架按需引入语法

- `React`: [antd](https://ant.design/)
- `Vue`: [vant](https://vant-contrib.gitee.io/vant/#/), [ant-design-vue](https://antdv.com/docs/vue/introduce-cn/)

在 `Vite` 场景可直接使用以下 `UI` 框架按需引入语法。若发现问题请及时提 `issue`, 我们将会尽快修复

- `React`: [antd](https://ant.design/)
- `Vue`: [vant](https://vant-contrib.gitee.io/vant/#/),[element-plus](https://element-plus.org/zh-CN/),[ant-design-vue](https://antdv.com/docs/vue/introduce-cn/)

`注：(暂不推荐 Vue + ant-design-vue，似乎在 SSR 场景会出现样式闪烁问题, 待 antv 官方修复)`

```js
// 注意: 使用了按需引入的框架无法再使用全量引入的语法
import vant from 'vant' // 将会报错
import { Button } from 'vant' // 使用按需引入语法

// Vue3 场景使用
const props = defineProps<{
  ssrApp: App,
  asyncData: { value: any }
}>()
props.ssrApp.use(Button)
```

### 接入其他 UI 框架

下面讲述如何按需引入的语法接入其他未默认集成的 `UI` 框架。若使用全量引入的语法，在大部分情况下无需做任何配置即可使用。  
下方讲述的解决方案在 `Webpack` 场景下适用。`Vite` 场景请参考 [vite-plugin-style-import](https://www.npmjs.com/package/vite-plugin-style-import)
#### antd-mobile

```js
// config.ts
const userConfig: UserConfig = {
  babelOptions: {
    plugins: [
      ["import", {
        "libraryName": "antd-mobile",
        "libraryDirectory": 'cjs/components',
        "style": false
      }, 'antd-mobile']
    ] // 通常使用该配置新增 plugin
  },
  whiteList: [/antd-mobile/]
}
export { userConfig }

// 在组件中使用
import { Button } from 'antd-mobile'

render () {
  return <Button>btn<Button>
}
```
#### element-ui


```js
// config.ts
const userConfig = {
  babelOptions: {
   plugins: [
        [
            "import",
            {
               "libraryName": "element-ui",
              "styleLibraryDirectory": "lib/theme-chalk",
            }
        ]
    ]
  }
}
export { userConfig }
```

#### element-plus

- webpack

`webpack` 场景下支持[按需导入](https://element-plus.gitee.io/zh-CN/guide/quickstart.html#%E6%8C%89%E9%9C%80%E5%AF%BC%E5%85%A5) `element-plus`，开发者无需手动配置任何插件，也不需要在代码中 `import` 相关代码，可以直接在 `template` 中使用 `el-button` 等组件。

- vite

`vite` 场景下支持[手动导入](https://element-plus.gitee.io/zh-CN/guide/quickstart.html#%E6%89%8B%E5%8A%A8%E5%AF%BC%E5%85%A5)方案，按需导入方案由于插件自身的问题暂时无法接入。

## 引入其他 css 处理器


### 如何支持 Sass|SCSS

框架默认使用 `less`，同样框架并不建议使用 `Sass|SCSS`，若需要使用可直接添加以下配置开启，使用框架提供的 `setStyle` 方法来快速的添加样式处理规则

需 `version >= 5.5.48`

```shell
$ yarn add sass sass-loader@^10.0.0 -D # 必须安装 ^10.0.0 版本的 sass-loader
```

```js
import { setStyle } from 'ssr-common-utils'
import type { UserConfig } from 'ssr-types'

const userConfig: UserConfig = {
  chainBaseConfig: (chain, isServer) => {
    // setStyle 的详细入参类型可查看  https://github.com/zhangyuang/ssr/blob/dev/packages/server-utils/src/webpack/setStyle.ts
    setStyle(chain, /\.s[ac]ss$/i, {
      rule: 'sass',
      loader: 'sass-loader',
      isServer,
      importLoaders: 2 // 参考 https://www.npmjs.com/package/css-loader#importloaders
    })
  }
}

export { userConfig }

```

如何配置 `sass-loader` 请参考[文档](./api$config#css) 

### Sass 场景使用 Vite 构建报错

若遇到 `Sass` + `Vite` 报 `URI.base` is not supported 的错误，参考该 [issue](https://github.com/vitejs/vite/issues/2240)

`layout/index.vue` 中加入该代码即可

```js
export default {
  props: ['ctx'],
  created () {
    global.location = {
      href: this.ctx.request.url
    }
  }
}
```

### tailwind.css

使用 `tailwind.css` 与框架无关，具体方案查看对应文档即可。下面贴出一种方案。配套使用 `VSCode Tailwind CSS IntelliSense` 对应插件一起使用更佳

```shell
$ yarn add tailwindcss@^3.0.0 autoprefixer@latest
```

```js
// 创建 tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./web/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
// config.ts 加入  postcss 相关配置，vite 场景需要用此方式传入，webpack 场景也可以单独创建 postcss.config.js 加载配置
import type { UserConfig } from 'ssr-types'
const userConfig: UserConfig = {
  css: () => {
    const tailwindcss = require('tailwindcss')
    const autoprefixer = require('autoprefixer')
    return {
      loaderOptions: {
        postcss: {
          plugins: [
            tailwindcss,
            autoprefixer
          ]
        }
      }
    }
  }
}

export { userConfig }

// web/common.less
// 引入 tailwind 代码即可在 class 中使用对应类名
@tailwind components;
@tailwind utilities;

```

## 是否考虑支持 SSG 静态渲染

参考该 [issue](https://github.com/zhangyuang/ssr/issues/75) 目前没有支持 `SSG` 的打算。个人认为这是一个伪需求。若后来的开发者仍然有支持 `SSG `的需求。可以回复该 `issue`,后续将会根据人数决定是否框架原生支持。

## 在微前端场景下使用(Beta)

得益于框架底层代码的简单，我们不需要做很多改动就可以在微前端场景下集成。此功能尚在实验中，欢迎开发者与我们共同探寻最佳实践。

### 与 micro-app 结合使用

官方提供结合 [micro-app](https://zeroing.jd.com/micro-app/) 使用的[示例](https://github.com/zhangyuang/micro-app-ssr)。目前看起来对应用的侵入性很小。个人非常喜欢这种方式。同样也可以在创建项目时选择微前端类型的模版。我们已经在线上业务启用了该方案。

### 与 qiankun 结合使用

没有尝试过接入 `qiankun` 建议使用 `micro-app` 作为微前端方案。

## 生产环境生成 sourcemap

生产环境默认不开启 `sourcemap` 能力，有源码泄露的风险。可通过下列任意一种方式开启

```bash
$ GENERATE_SOURCEMAP=1 npm run build
$ npx ssr build --sourcemap
```


## 实际业务问题

### 定义环境变量

这里的环境变量我们分为 `Node.js` 环境和 `浏览器` 环境。分别对应着 `src` 和 `web` 目录下的代码

我们可以通过启动或构建时的命令行参数注入环境变量 `MYENV=1 ssr start` 如果是 `Windows` 系统则是 `set MYENV ssr start`。推荐使用[cross-env](https://www.npmjs.com/package/cross-env) 兼容所有系统环境

在 `Node.js` 环境可直接使用读取 `process.env.MYENV` 读取。

在 `浏览器环境` 框架会将环境变量注入构建上下文中，通过 `MYENV` 直接读取。此时效果等同于 `config.define` 配置提供的能力


### 如何自定义页面标题, meta 等信息

开发者需要想清楚修改 `meta` 等 `head` 信息的目的是什么。如果只是单纯的前端页面展示，那么只需要在客户端通过 `document.title = xxx` 形式来修改即可。如果是为了满足 `SEO` 爬虫需求，则需要在服务端支出时渲染正确的信息。

本框架不需要也不会提供类似 `next/head`, `react-helment` 之类的解决方案，这是完全没有必要的。 

由于我们 `All in jsx/Vue SFC`, 这块的实现也是非常简单的。`layout` 在服务端被渲染时可以拿到请求的 `ctx`，根据 `ctx` 上的信息来 `render` 不同的生成结果

`Vue` 使用方式如下

```html
<template>
  <!-- 注：Layout 只会在服务端被渲染，不要在此运行客户端有关逻辑 -->
 
  <html>
    <head>
      <meta charSet="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <title v-if="ctx.request.path === '/'">
        首页
      </title>
      <title v-if="ctx.request.path.match('/detail')">
        详情页
      </title>
      <!-- 这里可以用 map 来简化代码 -->
       <title>
        {{ pathToTitle(ctx.request.path) }}
      </title>
      <slot name="remInitial" />
      <slot name="injectHeader" />
    </head>
   <body>
      <slot name="content" />
    </body>
  </html>
</template>

<script>
export default {
  props: ['ctx', 'config'],
  data() {
    return {
      pathMap: {
        '/': "首页",
        '/detail': "详情页",
      }
    }
  },
  created () {
    console.log(this.ctx.request.path)
  },
  methods: {
    pathToTitle(path) {
      // 需要模糊匹配的话可以采用 path-to-regexp 之类的方式
      return this.pathMap[path]
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>

```

`React` 使用则更简单 

```js
const Layout = (props: LayoutProps) => {
  // 注：Layout 只会在服务端被渲染，不要在此运行客户端有关逻辑
  const { injectState } = props
  const { injectCss, injectScript } = props.staticList!
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <meta name='theme-color' content='#000000' />
        <title>{props.ctx.request.path === '/' ? '首页' : '其他页面'}</title>
        <script dangerouslySetInnerHTML={{ __html: "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'" }} />
        { injectCss }
      </head>
      <body className={styles.body}>
        <div id='app'>{ props.children }</div>
        { injectState }
        { injectScript }
      </body>
    </html>
  )
}

```

上述的 `html` 基础信息设置。是发生在请求到达服务器时的逻辑。当前端页面通过前端路由跳转时此时并不会向服务器发起请求。如果你需要在这种场景修改 `title` 那么你应该需要使用 `document.title`，我们推荐你在 `layout fetch` 中进行该操作。该文件将会在每个页面渲染时都被调用。根据 `pathname` 判断当前页面并且设置 `title`

### 前端组件如何加载图片

不建议图片资源放在 `web` 文件夹，对图片资源若非有小文件 `base64` 内联或者 `hash` 缓存的需求是不建议用 `Webpack` 去处理的，这样会使得 `Webpack` 的构建速度变慢。

建议放在默认的静态资源文件夹即 `build|public` 文件夹，即可通过 `<img src="/foo.jpg">` 即可引入。或者使用单独的 `CDN` 图片服务(推荐)

`注：针对绝对路径开头的图片地址框架底层将不会使用 css-loader 等 loader 进行处理，故若有图片资源的 publicPath 需求请自行通过 webpack-chain 添加额外规则处理`

### 如何让某个组件只在客户端渲染

我们有时候会遇到某个组件强依赖了浏览器元素导致无法在服务端渲染，这时候需要针对该组件让其只在客户端进行渲染。  

`React` 场景下只需要用 `onlyCsr` 高阶组件包裹一下即可

```shell
$ yarn add ssr-hoc-react
```

```js
import { onlyCsr } from 'ssr-hoc-react'

export default onlyCsr(myComponent)
```

由于 `Vue2` 对 `HOC` 的支持不友好写起来比较麻烦，这里建议有需要用户手动来实现该功能

1. 组件新增 `data` 选项 `isClient`  
2. 在 `mounted` 生命周期设置 `isClient` 为 `true`  
3. 当 `isClient` 为 `true` 时，渲染真正的组件内容，否则只需要渲染一个空的 div  

```js
<template>
  <div v-if="isClient">{xxx}</div>
  <div v-else></div>
</template>

export default {
  data () {
    return {
      isClient: false
    }
  }
  mounted () {
    this.isClient = true
  }
}
```

### Vue3 只在客户端渲染

在 `Vue3` 中我们可以通过 `setup` 来方便的编写一个 `onlyCsr` 

```js
import { onlyCsr } from 'ssr-hoc-vue3'

<template>
  <onlyCsr>
    <myComponent>
  </onlyCsr>
</template>

<script>
// 在这里可以进行一些全局组件的注册逻辑
export default {
  components: {
    onlyCsr
  }
}
</script>
```

`onlyCsr` 的实现原理同样很简单如下

```js
import { ref, onMounted, defineComponent } from 'vue'

export const onlyCsr = defineComponent({
  setup (_, { slots }) {
    const show = ref(false)
    onMounted(() => {
      show.value = true
    })
    return () => (show.value && slots.default ? slots.default() : null)
  }
})

```

### 如何添加前端文件类型检查

默认 `Webpack` 构建前端文件时不会进行类型检查，原因如下

- `type check` 很慢，`esbuild`, `swc` 都不带 `type check`
- 开发时可借助 `VS Code` 的 `type check` 功能
- 服务端代码会强制检查类型 `Nest.js/Midway.js`，前端代码多变需要大量使用 `nocheck/ignore`
- 有需要可以单独跑一遍 `tsc` 或者 `fork-ts-checker-plugin`

若需要进行检查参考如下代码

```js
module.exports = {
  chainClientConfig: chain => {
    const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin') // npm i fork-ts-checker-webpack-plugin -D
    chain.plugin('typecheck').use(new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: './web/tsconfig.json' // 指定 tsconfig 文件
      }
    }))
  }
}
```


### 如何对所有类型的文件使用 css modules

主要用于 `React` 场景。默认规范只对 `.module.less` 格式的文件使用 `css-modules`, 如需要配置所有后缀类型的样式文件都使用 `css modules`

```js
module.exports = {
  css: () => {
    return {
      loaderOptions: {
        cssOptions: {
          modules: {
            auto: (resourcePath) => {
              return !/node_modules/.test(resourcePath) // 这里要排除第三方模块，不要用 css modules 处理它
            }
          }
        }
      }
    }
  }
}

```

### 不同页面使用不同的 Layout

主要在 `React` 场景使用， `Vue` 场景原理相同更加简单。

```js
// 需依赖版本 >= 5.6.21, 注意如果 example 是之前创建的不是最新的，layout/index.tsx 的这块内容需改为 <div id="app"><App {...props} /></div>
// App.tsx 
import React from 'react'

export default (props: LayoutProps) => {
  const path = __isBrowser__ ? location.pathname: props.ctx?.request.path
  if (/detail/.test(path)) {
    return props.children!
  } else {
    return <div style={{backgroundColor:'red'}}>
     { props.children!}
    </div>
  }
}
```

```html
// App.vue
<template>
  <div id="app">
    <div v-if="showDetailLayout" style="background-color: red">
      <router-view />
    </div>
    <router-view v-else />
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      showDetailLayout: /detail/.test(this.$route.path),
    };
  },
  watch: {
    "$route.path": function (newVal, oldVal) {
      this.showDetailLayout = /detail/.test(newVal);
    }
  }
};
</script>

```

### 动态路由前缀

在某些场景下我们希望 `/zh`, `/en` 的请求都能够打到当前应用。使用默认的 [prefix](./api$config#prefix) 配置无法满足需求。此时可以通过动态 `prefix` 设置来满足需求。代码如下

```js
  // controller 文件
  @Get('/zh')
  async handlerZh (): Promise<void> {
    try {
      this.ctx.apiService = this.apiService
      this.ctx.apiDeatilservice = this.apiDeatilservice
      const stream = await render<Readable>(this.ctx, {
        stream: true,
        prefix: '/zh'
      })
      this.ctx.body = stream
    } catch (error) {
      console.log(error)
      this.ctx.body = error
    }
  }

  @Get('/en')
  async handlerEn (): Promise<void> {
    try {
      this.ctx.apiService = this.apiService
      this.ctx.apiDeatilservice = this.apiDeatilservice
      const stream = await render<Readable>(this.ctx, {
        stream: true,
        prefix: '/en'
      })
      this.ctx.body = stream
    } catch (error) {
      console.log(error)
      this.ctx.body = error
    }
  }
```

我们会将当前请求对应的 `prefix` 注入到 `window.prefix` 中，框架将会读取这个值并做适配逻辑。

### 如何使用 svg-sprite-loader (不推荐使用)

`注：如果下面的方式直接 Copy 无法正常使用那么请自行查看 svg-sprite-loader 的文档或不推荐使用此 loader`

参考下方代码

```js

const { resolve } = require('path')
module.exports = {
  chainBaseConfig: chain => {
    chain.module
      .rule('images')
      .exclude
      .add(resolve(process.cwd(), './web/assets/icon'))
      .end()

    chain.module
      .rule('svg')
      .test(/\.(svg)(\?.*)?$/)
      .include
      .add(resolve(process.cwd(), './web/assets/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: '[name]' })
  }
}

```

## 兼容低端浏览器

默认构建出来的结果已经能够在大部分浏览器运行，如果报错，可根据报错首先定位错误来源是第三方模块还是业务代码。如果属于第三方模块，优先考虑使用 [babelExtraModule](./api$config#babelExtraModule) 选项来设置第三方模块。

若仍然无法成功，则考虑以下方案

参考 [corejs](./api$config#corejs) 选项

## 如何从传统 React|Vue 项目迁移

请开发者先阅读[文档](./why#什么情况下你应该选择%20ssr%20框架)后明确迁移的目的和背景，本框架相比于 `vue-cli`, `create-react-app` 创建的项目对开发者的心智要求更高。不建议迁移代码量庞大的旧应用除非项目主导者精通服务端渲染的每一个细节，若明确迁移目的后可按照以下方式迁移。

### 路由结构迁移

本框架默认推荐使用约定式路由，虽然也可以支持约定式路由但这并不是我们推荐的做法。若旧应用使用约定式路由则需要首先按照本框架的[规范](./features$feRoutes)生成对应的约定式路由

### fetch 逻辑迁移

传统 `spa` 应用的数据获取逻辑大多数是写在组件的生命周期当中。若你需要在服务端渲染的过程中或者是路由跳转的过程中自动的进行数据逻辑的获取。那开发者应该将这部分逻辑搬迁到 `fetch.ts` 文件当中并区分当前运行环境，参考[文档](./features$fetch)。若当前开发者技术栈是 `React` 并且之前使用了 `mobx`, `redux` 等数据管理库，则需要修正为 `context` 来实现。

### 构建逻辑迁移

本框架的应用构建逻辑相比于 `vue-cli` 的配置而言显得无比清晰。若旧应用在使用这些脚手架时没有进行自定义的构建逻辑则可以直接迁移。若使用了自定义的构建逻辑则需要兼容。本框架支持直接兼容 `vue-cli` 的部分构建配置。参考[文档](./api$config)

### 模块加载逻辑迁移

开发者在迁移过程中遇到的绝大多数问题都是第三方模块无法在服务端渲染中运行导致的错误。参考[文档](./features$faq#如何解决服务端访问不可访问的对象的问题)

### 样式迁移

框架默认支持 `less` 作为样式预处理器，若需要使用 `sass` 参考[文档](./features$faq#如何支持%20Sass|SCSS)。`React` 场景只支持 `css modules` 的形式，若需要使用全局样式，则需要使用 `:global` 的语法
### 封装双端通用的请求

推荐用 [axios](https://www.npmjs.com/package/axios) 来发起 `http` 请求会自动根据当前环境判断应该使用 `xhr` 还是 `http` 模块发起。针对 `cookie` 的携带，客户端请求时同源请求会自动带上 `cookie` 当跨域请求时需要通过 `withCredentials` 配置来带上 `cookie`。服务端请求时可以通过 `ctx.req.cookies` 具体查看对应服务端框架文档拿到当前请求 `cookie`

## 如何自定义启动逻辑，构建逻辑

```js
import { startFunc, buildFunc, deployFunc } from 'ssr'

await startFunc(options)
```
## 启动参数透传

`ssr start|build` 命令将会透传所有参数到底层的 `nest-cli`, `midway-bin`

```shell
$ ssr start --debug 8001 # 等价于 nest start --debug 8001
$ ssr start --port 7001 # 等价于 midway-bin dev --port 7001
```

`build` 同理，参考当前服务端框架对应的文档即可。也可以执行 `npx ssr start|build --help` 查看框架支持的其他能力

## 其他问题

### 动态路由切换组件不重新渲染

针对动态路由例如 `/user/:id` 之类的 `path`, 一些前端框架为了性能考虑，在路由跳转时将会复用组件实例造成组件不重新渲染的现象。

例如在本框架中从 `/user/1` 跳转到 `/user/2` 时，`fetch` 方法被调用但组件并没有更新。解决方案有很多种，下面列出一些方案，根据实际情况选择

#### Vue 场景

通过添加 `router-view` 组件的 `key` 属性来防止组件被缓存

```js
// layout/App.vue
<router-view :key="$route.fullPath" />
```

或者抽象 `fetch` 方法中的逻辑在 `watch route` 改变时调用

或者通过 `fetchData` 的方式。来通过 `props` 获取数据来触发重新渲染

```js
// fetch.ts
export default async ({ store, router, ctx }: Params) => {
  return {
    data: Math.random()
  }
}
// render.vue
import { defineProps } from 'vue'

const props = defineProps<{data: string}>()
```

#### React 场景

`React` 场景使用 `context` 理论上不会出现此问题，若遇到类似问题, 请提 `issue`

### class IssueWebpackError 报错

错误原因：`Webpack` 多版本冲突查询依赖逻辑错误

解决方法：使用 `pnpm|yarn|npm@version >= 7` 来安装依赖

或在应用 `package.json` 中添加

```json
{
  "scripts": {
    "postinstall:": "node ./node_modules/ssr-common-utils/postinstall.js"
  }
}
```

## wasm(Webassembly) 支持

在 `ssr` 框架中使用 [wasm](https://webassembly.org/) 以 [color-thief-wasm](https://github.com/zhangyuang/color-thief-wasm) 为例。

这里讲述的是在浏览器中调用 `wasm`, 如果是在 `Node.js` 环境中调用则更加的简单

`In Webpack`
```bash
$ yarn add color-thief-wasm-bundler
```

```js
if (__isBrowser__) {
  const foo = require('color-thief-wasm-bundler')
  console.log(foo.get_color_thief([1,2,3,4], 64*64, 9,5))
}
```

`In Vite`

```bash
$ yarn add color-thief-wasm-web
```

```js
// config.ts

export const userConfig = {
  whiteList: [/color-thief-wasm-web/],
  viteConfig: () => ({
    clientConfig: {
      otherConfig: {
        optimizeDeps: {
          exclude: ['color-thief-wasm-web']
        }
      }
    }
  })
}

// render.vue

import init, { get_color_thief } from 'color-thief-wasm-web'

if (__isBrowser__) {
  init().then(() => {
    console.log(get_color_thief([1,2,3,4], 64*64, 9,5))
  })
}
```

## 分析构建产物

在 `Webpack` 模式下通过 `ssr build -a` 来分析产物构成。

在 `Vite` 模式下通过查看 `build/generateMap.json` 文件查看每一个源文件将会被构建到哪一个最终的产物 `chunk` 中

## 高性能产物构建

在 `Vite` 模式下，框架实现了一种高性能的产物构建策略，来保证开发者只会加载到当前页面所必需的文件不会加载多余的文件，同时也不会在不同文件中构建重复的内容来保证 `bundle` 体积最小。

在 `Webpack` 模式下，框架提供了 `ssr start|build --optimize` 选项来开启这一构建策略。这个过程中会借助 `Vite|Rollup` 的一些模块依赖分析的能力。所以会增加一些构建时间，开发者可只在构建生产环境产物时使用此配置。如果你使用过程中发现了什么问题，请提 [issue](https://github.com/zhangyuang/ssr/issues)。

为了保证构建的性能最高，分析结果最准确。请尽量使用 `ESM Module(import / export)` 语法而不是 `CommonJS(require / module.exports)` 语法来导入导出模块。

## Vite 生产环境构建样式闪烁

尽管我们已经对 `Vite` 在生产环境的构建体验做了非常多的优化，包括实现了理论上的最佳构建策略来保证构建出来的文件体积最小，每个页面只会加载用到的代码不会加载任何额外内容。但目前发现仍有一些极端场景我们无法覆盖。目前我们只发现在以下场景下可能会出现样式闪烁的问题，如果你在其他场景下也出现了问题欢迎提交 `issue`

### 禁止在 style 里面引用公共样式

如果你有公共页面的样式需要加载，我们推荐你放在 `common.less` 中并在 `App.vue` 中加载。

例如像下面的写法将会产生样式闪烁

```js
// foo.less
.foo {
  color: red
}

// a.vue
<template>
  <div class="foo">a</div> 
</template>

<script>

</script>

<style>
@import "./foo.less";
</style>

// b.vue
<template>
  <div class="foo">b</div> 
</template>

<script>

</script>

<style>
@import "./foo.less";
</style>

```

上面的代码中，框架在构建时没有足够多的信息去判断出 `a`, `b` 两个组件引用了同一份样式文件，所以尽量不要用这种写法来实现功能。

- 修改方法1：将公共样式放在 `common.less` 中

- 修改方法2: 使用下面的代码写法, 在 `script` 中引入文件，此时框架可以正确的解析出引用关系。

```js
// foo.less
.foo {
  color: red
}

// a.vue
<template>
  <div class="foo">a</div> 
</template>
<script>
import './foo.less';
</script>

// b.vue
<template>
  <div class="foo">b</div> 
</template>

<script>
import './foo.less';
</script>
```