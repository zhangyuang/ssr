# 技术选型

本章将介绍 `ssr` 框架在不同场景的一些技术选型, 建议各位阅读 [蚂蚁前端研发最佳实践](https://github.com/sorrycc/blog/issues/90)。我们始终认为，固定一套最佳的技术选型方案远比支持多种多样的技术方案要优秀的多。

## 服务端框架技术选型

由于我们是通过插件的机制来进行扩展。所以理论上我们可以支持任何服务端框架。目前官方提供了 `Midway.js` `Nest.js` 的实现方案可以直接使用。如果你想基于其他的 Node.js 框架封装一个插件也是非常容易的。详见 [插件机制](./features$plugin)

## 前端框架技术选型

这里我们支持常见的流行前端框架 `React` `Vue2` `Vue3`。用户可直接使用

### React 技术选型

- 前端框架: React v17, 实时跟进 React17的新特性
- 开发语言: TypeScript
- 代码风格(可选): 默认[eslint-config-standard-react-ts](https://github.com/zhangyuang/standardjs-react)
- 样式处理: less + css modules(根据后缀名自动识别)
- UI 组件: 默认已对 `antd` 的使用做打包配置无需额外配置
- 前端路由: 约定式路由/声明式路由
- 数据管理: 使用 Hooks 提供的 `useContext` 实现极简的跨组件通信方案, 摒弃传统的 redux/dva 等数据管理方案, 详见 [组件通信](./features$communication)
- 构建工具: [Webpack](https://webpack.docschina.org/)/[Vite](http://vitejs.dev/)

### Vue 技术选型

- 前端框架: Vue2.0, Vue3.0
- 开发语言: TypeScript
- 代码风格(可选): [eslint-config-standard-vue-ts](https://github.com/zhangyuang/standardjs-vue)
- 样式处理: less + vue scoped
- UI 组件: 默认已对 `vant` 的使用做打包配置无需额外配置
- 前端路由: 约定式路由/声明式路由
- 数据管理: [Vuex](https://vuex.vuejs.org/)/[Provide/Inject](./features$communication#Provide/Inject)
- 构建工具: [Webpack](https://webpack.docschina.org/)/[Vite](http://vitejs.dev/)

#### Vue3 + TSX(可选)

在 Vue3 场景下我们默认在底层已加载 [@vue/babel-plugin-jsx](https://github.com/vuejs/jsx-next#installation) 插件，开发者可根据个人喜好决定使用 template 的方式抑或是 tsx 的方式进行开发。例如想使用 tsx 的话，只需要将 .vue 文件改为 .tsx 文件即可。如果你打算大量使用 TypeScript 来开发应用，我们更加推荐使用 tsx 文件的形式而不是传统 Vue 文件。如下 vue 组件

```html
<template>
  <div>
    <Search />
    <template v-if="indexData">
      <Slider :data="indexData[0].components" />
      <Rectangle :data="indexData[1].components" />
    </template>
    <template v-else>
      <img src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif" class="loading">
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Slider from '@/components/slider'
import Rectangle from '@/components/rectangle'
import Search from '@/components/search'

export default {
  components: {
    Slider,
    Rectangle,
    Search
  },
  computed: {
    ...mapState({
      indexData: state => state.indexStore?.data
    })
  }
}
</script>

```

对应的 tsx 写法为

```jsx
// render.tsx
import { mapState } from 'vuex'
import Slider from '@/components/slider'
import Rectangle from '@/components/rectangle'
import Search from '@/components/search'

export default {
  computed: {
    ...mapState({
      indexData: state => state.indexStore?.data
    })
  },

  render () {
    const { indexData } = this
    return <div>
      <Search />
      {
        indexData ? <div>
          <Slider data={indexData[0].components} />
          <Rectangle data={indexData[1].components} />
        </div> : <img src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif" className="loading"/>
      }
    </div>
  }
}

```

## 注意

上述选型是我们经过深思熟虑后总结出来的一套优秀方案。如果开发者一定要用其他方案，例如下面介绍的

- `sass` ，参考[文档](./features$faq#)可通过 `chainBaseConfig` 的方式来修改默认的 `Webpack` 配置支持。但我们不推荐这么做。 `90%` 框架的 `issue` 类型都是由于使用者修改了默认的配置引起的。
- `koa` ，开发一个 `ssr` 框架的 `koa` 插件只需要两分钟，但我们仍然不推荐这么做。如果你一定需要选择其他的服务端 Node.js 框架，请选择相对成熟的
- `redux`， 默认不支持 `redux` 作为数据管理，同样在未来也并不打算支持。`redux-saga`, `dva` 同理，未来也并不打算支持。 `useContext` 已足够优秀，若一定要选择其他的数据管理方案，在未来我们或许会考虑框架层提供 `Mobx` 或 `redux-toolkit` 来作为相对复杂的数据管理方案