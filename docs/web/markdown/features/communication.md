# 组件通信
众所周知，在组件式开发中，最大的痛点就在于组件之间的通信。本篇文章将会分别对`vue`和`react`讲述如何进行组件通信。

> 在阅读文档之前，你应该已经熟悉了这两个[目录结构](/docs/features$structure)和[数据获取](/docs/features$fetch)。

## Vue 场景
在 Vue 中，Vue 提供了各种各样的组件通信方式
- 父子组件通信的`props/$emit`
- 全局数据管理的`Vuex`。
- vue3新提供的`provide/inject`
### Vuex
在需要全局状态管理的场景下，可以使用Vuex，它可以：
- 集中式存储管理应用的所有组件的状态
- 保证状态以可预测的方式发生变化
- 与调试工具集成，提供功能：time-travel、状态快照导入导出

下面用[示例](https://github.com/ykfe/ssr/tree/dev/example/midway-vue3-ssr)介绍在本框架中使用Vuex。

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
在`Vue3`中我们提供了另一种更加轻量级的跨组件数据共享的方式，也就是`Provide/Inject`，`Vuex`和`provide/inject`主要的区别在于，`Vuex`中的全局状态的每次修改是可以追踪回溯的，而`provide/inject`中变量的修改是无法控制的，换句话说，你不知道是哪个组件修改了这个全局状态。若你完全不考虑使用`Vuex`来做数据管理的话，那么你可以不使用默认的示例`Vuex`全部有关代码，但暂时不要删除`store`的入口文件，后续会底层兼容不存在`store`文件的情况。

在渲染的过程中，我们会将`layout fetch`与`page fetch`的`返回数据`组合后以`props`的形式注入到`layout/App.vue`当中，开发者可以在该文件中`provide`如下所示。便可以在任意组件中通过`inject`拿到该数据并且可以修改数据自动触发更新，为了防止应用数据混乱，我们建议为不同的组件返回数据添加不同的`namespace`命名空间。同样当路由切换时我们也会自动的将`fetch.ts`返回的数据合并进`asyncData`。

为了防止对象失去响应性，这里我们 follow `ref`对象的规则。将真正的数据对象存放在`asyncData.value`字段中。并且将整个`asyncData`转换为响应式。这样我们后续可以直接通过修改 `asyncData.value = obj`或者`asyncData.value.key = obj`的方式来修改数据仍然可以让对象保持响应式。使用这种方式需要注意的是如果在`template`中使用的话仍然需要添加`.value `取值不会自动展开。

```javascript
// fetch.ts
export default () => {
  return {
    indexData: {}
  }
}
```

```javascript
// layout/App.vue
<script>
import { reactive, provide } from 'vue'
export default {
  props: ['asyncData'],
  setup (props) {
    const reactiveAsyncData = reactive(props.asyncData) // asyncData.value 是 fetch.ts 的返回值，将 provide 的数据变为响应式
    const changeAsyncData = (data) => {
      reactiveAsyncData.value = data
    }
    provide('asyncData', reactiveAsyncData)
    provide('changeAsyncData', changeAsyncData)
  }

}
</script>
```

```javascript
// 任意组件
<template>
  {{ asyncData.value }}
</template>

<script>
export default {
 setup () {
    const asyncData = inject('asyncData')
    const changeAsyncData = inject('changeAsyncData')
    return {
      asyncData,
      changeAsyncData
    }
  },
  mounted () {
    // 通过 changeAsyncData 修改响应式数据
    this.changeAsyncData({
      namespace: 'foo'
    })
  }
}
</script>
```

## React 场景

### Mobx

### Hooks
