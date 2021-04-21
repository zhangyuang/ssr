# 组件通信
众所周知，在组件式开发中，最大的痛点就在于组件之间的通信。本篇文章将会对`vue、react`分别讲述如何进行组件通信。

> 在阅读文档之前，你应该已经熟悉了这两个[目录结构](/docs/features$structure)和[数据获取](/docs/features$fetch)。

## Vue 场景
在 Vue 中，Vue 提供了各种各样的组件通信方式
- 父子组件通信的`props/$emit`
- 兄弟组件通信的`EventBus`
- 全局数据管理的`Vuex`。
- vue3新提供的`provide/inject`
### Vuex
在需要全局状态管理的场景下，可以使用Vuex，它可以：
- 集中式存储管理应用的所有组件的状态
- 保证状态以可预测的方式发生变化
- 与调试工具集成，提供功能：time-travel、状态快照导入导出

下面以[示例](https://github.com/ykfe/ssr/tree/dev/example/midway-vue3-ssr)为例介绍如何本框架中使用Vuex。

1.创建`store/index.tx`文件，用于整体导出`store`
```javascript
// web/store/index.tx
import { indexStore } from './modules/index'

const modules = {
  indexStore,
}
export {
  modules
}
```

2.创建`store/modules/index.ts`文件，作为首页对应`store`
```javascript
// web/store/modules/index.ts
const indexStore = {
  namespaced: true,
  state: {
    data: {}
  },
  mutations: {
    setData (state, payload) {
      state.data = payload.data
    }
  },
  actions: {
    initialData ({ commit }, { payload }) {
      commit('setData', payload)
    }
  }
}

export {
  indexStore
}
```

3.获取并同步数据到`store`中
在页面对应的`fetch.ts`文件中获取到数据后，可以通过调用`store.dispatch()`方法，将数据同步到`store`中。

```javascript
// web/pages/index/fetch.ts
import { ISSRContext } from 'ssr-types'
import { IndexData } from '@/interface'
interface IApiService {
  index: () => Promise<IndexData>
}

export default async ({ store, router }, ctx?: ISSRContext<{
  apiService?: IApiService
}>) => {
  const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx?.apiService?.index()
  await store.dispatch('indexStore/initialData', { payload: data })
}
```

4.组件通过`store`获取数据
在组件中加入`Vuex`相关方法，可获取到`store`中的数据

```javascript
// web/pages/index/render.ts
<template>
  <div>
    .....
    <Slider :data="indexData[0].components" />
    .....
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Slider from '@/components/slider'

export default {
  components: {
    Slider,
  },
  computed: {
    ...mapState({
      indexData: state => state.indexStore?.data
    })
  }
}
</script>
```

### provide/inject
Vue也给我们提供了更加轻量的通信方式`provide/inject`。`Vuex`和`provide/inject`最大的区别在于，`Vuex`中的全局状态的每次修改是可以追踪回溯的，而`provide/inject`中变量的修改是无法控制的，换句话说，你不知道是哪个组件修改了这个全局状态。

## React 场景

### Mobx

### Hooks
