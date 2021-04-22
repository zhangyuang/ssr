# 组件通信
众所周知，在组件式开发中，最大的痛点就在于组件之间的通信。本篇文章将会分别对`vue`和`react`讲述如何进行组件通信。

> 在阅读文档之前，你应该已经熟悉了这两个[目录结构](/docs/features$structure)和[数据获取](/docs/features$fetch)。

## Vue 场景
在 Vue 中，Vue 提供了各种各样的组件通信方式
- 父子组件通信的`props/$emit`
- 全局数据管理的`Vuex`。
- vue3新提供的`provide/inject`
### Vuex
在需要全局状态管理的场景下，可以使用`Vuex`，它可以：
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

随着 hooks 的流行以及 [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) 这个 API 的推出, 越来越多的开发者希望用它来代替 Dva, Redux-Toolkit 这些方案来实现数据管理，因为之前的数据管理方案写起来实在是太累了。  
先说结论：useContext + useReducer 不能完全代替 Dva 的功能。严格来说，它只实现了组件共享 store，以及触发 action 修改 store 的能力，对于异步操作的顺序性则需要开发者自行控制。本框架没有使用任何基于 hooks 新造的第三方轮子来做数据通信，仅使用 React 提供的最原始的 API 来实现跨组件通信。如果你只是想进行跨组件通信，以及数据的自动订阅能力，你完全不需要 Redux。    
此功能在中小型应用的开发过程中完全够用，大型应用可能需要考虑拆分成多个 Context.Provider 的组织形式。后续我们会继续跟进最佳实践  

通过使用 `useContext` 来获取全局的 `context`, `useContext` 返回两个值分别为

- state: 全局的状态，可在不同的组件/页面之间共享
- dispatch: 通过 `disptach` 来触发类型为 `updateContext` 的 `action` 来更新最顶层的 `context`

> 注: hooks 只能够在函数组件内部使用

```ts
import { useContext } from 'react'
import { IContext } from 'ssr-types'

// 通过 IData 指定模块自己的 data interface

const { state, dispatch } = useContext<IContext<IData>>(window.STORE_CONTEXT)
```

通过 `dispatch action` 来触发全局 `context` 的更新，并通知到所有的组件。在本地开发环境下我们会在控制台中输出每个修改 context 的 action 的详细信息。 

> 注: dispatch 是异步的只能够在客户端渲染的阶段使用，服务端使用无效。context 更新会导致所有组件重新 render，我们需要使用 React.useMemo 来避免不必要的重新计算，且建议根据不同的模块使用不同的 namespace 防止数据覆盖

```js
import React, { useContext } from 'react'
import styles from './index.less'

function Search (props) {
  const { state, dispatch } = useContext<IContext<SearchState>>(window.STORE_CONTEXT)
  const handleChange = e => {
    dispatch({
      type: 'updateContext',
      payload: {
        search: {
          // 搜索框模块的 namespace 为 search
          text: e.target.value
        }
      }
    })
  }
   return (
    <div className={styles.searchContainer}>
      {/* 这里需要给 value 一个兜底的状态 否则 context 改变 首次 render 的 text 值为 undefined 会导致 input 组件 unmount */}
      {/* ref: https://stackoverflow.com/questions/47012169/a-component-is-changing-an-uncontrolled-input-of-type-text-to-be-controlled-erro/47012342 */}
      <input type="text" className={styles.input} value={state.search?.text ?? ''} onChange={handleChange} placeholder="该搜索框内容会在所有页面共享"/>
      <img src="https://img.alicdn.com/tfs/TB15zSoX21TBuNjy0FjXXajyXXa-48-48.png" alt="" className={styles.searchImg} onClick={toSearch}/>
    </div >
  )
}

export default Search

```

> 注: 以上只为示例，实际开发中我们只推荐在跨组件通信时使用 dispatch，局部状态应该使用 useState 来实现，否则会导致函数内部状态过于复杂，难以追踪。

关于更多 hooks 使用的最佳实践可以参考该[文章](https://zhuanlan.zhihu.com/p/81752821)

我们只有一个最顶层的 store，以及一个 reducer 来修改这个 store。综上本方案的优点以及不足如下  

优势:
- 无需再编写繁琐的 store，也不需要拆分多个 provider
- 共享全局状态以及修改全局状态非常简单自然

不足
- 在大型应用状态复杂的情况下，比较难以管理
- 需要配合 useMemo 一起使用，否则容易导致性能问题 (只要是使用了 useContext 都会遇到该问题)