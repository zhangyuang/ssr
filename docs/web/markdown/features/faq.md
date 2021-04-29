# FAQ

本章节记录开发者可能会遇到的常见问题。如果你的问题在这里没有描述，你可以直接去仓库地址提 [issue](https://github.com/ykfe/ssr/issues)

## Vue 全局注册组件

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

}
</script>

```

## Vue3 全局注册指令

由于 `Vue3` 创建 `app` 实例以及安装插件和注册自定义全局指令的方式与 `Vue2` 差别较大。

为了方便用户开发，我们会将框架底层创建的 `VueApp` 实例挂在 `window.__VUE_APP__` 上方，在服务端/客户端都能够访问该属性。但由于服务端和客户端环境有差异。我们不建议过度依赖该属性。例如自定义指令会在服务端被忽略。在注册的时候我们需要根据当前环境做判断。

```js
// 在 layout/App.vue 中做一些全局的任务
export default {
  created () {
    if (__isBrowser__) {
      const app = window.__VUE_APP__
      app.directive('focus', {
        // 当被绑定的元素挂载到 DOM 中时……
        mounted (el) {
          // 聚焦元素
          el.focus()
        }
      })
    }
  }
}
```

## Vue3 修改 Router 行为

在 `Vue3` 中我们同样将 `vue-router` 实例挂在了 `window.__VUE_ROUTER__` 上方，你也可以直接通过 [useRouter](https://next.router.vuejs.org/guide/advanced/composition-api.html#accessing-the-router-and-current-route-inside-setup) 来直接拿到 `Router` 实例。

通过 `Router.options.scrollBehavior` 来修改 `Router` 行为

## 使用Vue3国际化插件

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
    const app = window.__VUE_APP__
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

`React` 场景下我们已经对 [antd](https://ant.design/) 进行兼容，`Vue` 场景已经对 [vant](https://vant-contrib.gitee.io/vant/#/) 进行兼容，可以直接在组件中引用无需做任何额外配置。

若开发者需要使用其他 UI 框架不做额外配置是一定会报错的。这里以 [vant](https://vant-contrib.gitee.io/vant/#/) 举例子，讲述如何引入。

`注: 本框架底层已经支持直接使用 antd, vant UI 框架，下列代表只是讲述原理，无需重复配置`

```js
import Button from 'vant/lib/button';
import 'vant/lib/button/index.less'; // 手动导入的情况这里建议使用这种方式来导入样式文件而不是 import 'vant/lib/button/style' 这样导入的是一个 js 文件
```

使用手动按需引入的情况几乎不会出任何问题。但要注意

1. 必须使用 lib 目录下的文件，不要用 es，es 模块在服务端无法解析  
2. 如果是 import `css|less` 文件则不会有问题，但很多 UI 框架例如 `antd`, `vant` 这些都会都导出一个 `js` 文件去 `require` 要用到的 `css` 文件，这种情况不做额外配置是一定会出错的  

这里需要额外在 config.js 配置白名单，使得服务端打包的时候让 `Webpack` 去处理这种类型的 js 文件

```js
// config.js

module.exports = {
  cssModulesWhiteList: [],
  whiteList: [/vant.*?style/]
}

```

以 `vant` 为例，它导出的是 `lib/Button/style/index.js` 文件  
以 `antd` 为例，它导出的是 `lib/Button/style/css.js` 文件  

所以 antd 场景下我们需要这么写 `/antd.*?css/` (我们默认配置已包含)

若想要使用 `babel-plugin-import` 来进行按需导入除了上面提到的 `whiteList` 配置之外还需要创建 `babel.config.js`

```js
// babel.config.js

module.exports = {
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'lib', // 这里一定要用 lib
      style: true // vant 场景写 true 代表 style/index.js antd 场景写 css 代表 style/css.js
    }, 'vant']
  ]
};
```

## 前端组件加载图片

不建议图片资源放在 `web` 文件夹，对图片资源若非有小文件 `base64` 内联或者 `hash` 缓存的需求是不建议用 `Webpack` 去处理的，这样会使得 `Webpack` 的构建速度变慢。

建议放在默认的静态资源文件夹即 `build` 文件夹，即可通过 `<img src="/foo.jpg">` 即可引入。由于 [egg-static](https://github.com/eggjs/egg-static) 支持数组的形式，也可以自行在根目录下创建 `public` 文件夹用于存放图片等静态资源。但记住这里需要额外将 `public` 文件夹设置为[静态资源文件夹](https://github.com/ykfe/ssr/blob/dev/example/midway-vue3-ssr/src/config/config.default.ts#L15)

## 如何降级为客户端渲染

在本地开发测试时我们可以通过在请求 `url` 的 `query` 后面添加 `?csr=true` 来以客户端渲染模式进行渲染。

在正式的线上应用执行阶段。我们一般使用以下方式来进行降级

### 通过 config.js

发布的时候支持2种模式，默认是`mode: 'ssr'`模式，你也可以通过 config.js 中的 `mode: 'csr'` 将csr设置默认渲染模式。

### 通过 core 模块提供的 render 方法降级

`ssr-core-react` 和 `ssr-core-vue` 模块均支持该方式  

在应用执行出错 catch 到 error 的时候降级为客户端渲染。也可根据具体的业务逻辑，在适当的时候通过该方式降级 `csr` 模式

```js
import { render } from 'ssr-core-react'

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

### 通过类似于 ActiveMQ、RabbitMQ、RocketMQ、Kafka 等消息中间件或者实时的接口请求来读取配置

代码修改很简单。

```js
const config = await http.get('xxx') // 通过接口|消息中间件拿到实时的config，可以做到应用不发版更新渲染模式
const htmlStr = await render(this.ctx, config)
```

此种场景多用于应急预案处理。

## 如何自定义页面标题, meta 等信息

由于我们 `All in jsx/Vue SFC`, 这块的实现也是非常简单的。`layout` 在服务端被渲染时可以拿到请求的 `ctx`，根据 `ctx` 上的信息来 `render` 不同的生成结果

`Vue` 使用方式如下

```html
<template>
  <!-- 注：Layout 只会在服务端被渲染，不要在此运行客户端有关逻辑 -->
  <!-- 页面初始化数据注入内容已经过 serialize-javascript 转义 防止 xss -->
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
      <!-- 初始化移动端 rem 设置，如不需要可自行删除 -->
      <slot name="remInitial" />
      <!-- 用于通过配置插入自定义的 script 为了避免影响期望功能这块内容不做 escape，为了避免 xss 需要保证插入脚本代码的安全性  -->
      <slot name="customeHeadScript" />
      <slot name="cssInject" />
    </head>
    <body>
      <slot name="children" />
      <slot name="initialData" />
      <slot name="jsInject" />
    </body>
  </html>
</template>

<script>
export default {
  props: ['ctx', 'config'],
  created () {
    console.log(this.ctx.request.path)
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
  const { state } = useContext(window.STORE_CONTEXT)
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
        {
          state && <script dangerouslySetInnerHTML={{
            __html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(state)}`
          }} />
        }
        { injectScript }
      </body>
    </html>
  )
}

```

## 如何解决服务端访问不可访问的对象的问题

`SSR` 是近几年才火热的话题，如果是新的项目且开发人员对 `SSR` 有较深的认知，那么在设计应用的过程中就会有意识的去避免在服务端访问客户端对象的情况。但在老项目或者老的第三方库/框架，或者是开发人员对SSR理解不深刻的情况下，会出现很多类似 `window is not defined` 的错误。  

先说前言，个人是不推荐用 `jsdom` 来在服务端模拟客户端环境，这样最多只能模拟最外层的对象例如 `window document` 但如果要访问更深层次的对象例如 `document.getElementById` 则还是会报错。且这种方式新增了一堆很 `dirty` 的代码且不利于 debug 容易造成未知的问题。  

自己的代码我们可以控制，那么如果有第三方模块犯了这种问题应该如何解决呢。在有能力给第三方模块提PR的时候还是建议以PR的形式进行修复。  

例如 `axios` 就会根据你当前的环境来决定到底是用 `xhr` 对象还是用 `http` 模块来发起请求。如果没办法改动第三方模块，我们可以在代码中延迟加载这些模块，让它在客户端执行的时候被调用。  

1. 使用本应用提供的 `__isBrowser__` 常量来判断，一些模块直接在顶层就使用浏览器元素直接 `import` 就会出错，例如引入 `jquery` 可以使用以下引入方式  
   
```js
import $ from 'jquery' // error
const $ = __isBrowser__ ? require('jquery') : {} // true
const $ = __isBrowser__ ? import('jquery') : {} // used in vite return a promise object
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

## 如何让某个组件只在客户端渲染

我们有时候会遇到某个组件强依赖了浏览器元素导致无法在服务端渲染，这时候需要针对该组件让其只在客户端进行渲染。  

`React` 场景下只需要用 `onlyCsr` 高阶组件包裹一下即可

```shell
$ yarn add ssr-hoc-react
```

```js
import { onlyCsr } from 'ssr-hoc-react'

export default onlyCsr(myComponent)
```

由于 `Vue` 对 `HOC` 的支持不友好写起来比较麻烦，这里建议有需要用户手动来实现该功能

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

## Proxy 转发 POST 请求失败

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