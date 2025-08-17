# Component Communication

Data management is an important piece of knowledge in frontend development. When there are too many component levels, passing through `props` becomes very difficult, so we usually use additional data management libraries for data management. Similarly, data management has gone through countless changes from the initial `flux` architecture to the latest `context` thinking, and there are many, many solutions in the industry. This chapter will explain how we perform data management in the `ssr` framework.

> Before reading this chapter, please ensure you have read and are familiar with these two chapters: [Directory Structure](/docs/features$structure) and [Data Fetching](/docs/features$fetch).

## Development History

Data management solutions were proposed from the earliest `flux` architecture, which means `view layer components are not allowed to directly modify application state, they can only trigger actions. Application state must be separated and placed in store for unified management, executing specific state operations by listening to actions`. This is the well-known `unidirectional data flow`. Of course, in real applications, we can't put all states in `store`, components can still own and directly modify their own `private state`.

Implementing `unidirectional data flow` is divided into two major schools.

One is the `immutable` thinking: `react-redux`, `redux-(thunk|sage)`, `dva`, `redux-toolkit`, etc.

And the other is based on `observer` thinking: `mobx`, `vuex`, etc.

Some developers also think that `React+MobX` is a type-friendly clean version of `Vue`. Although the above solutions don't have absolute advantages or disadvantages, from the perspective of developer experience, solutions implemented based on `observer` thinking are superior in writing comfort.

Since data management doesn't have a single answer, in the `ssr` framework, we `may` provide multiple solutions at the framework level for users to choose from. But we always recommend using the framework's default supported solutions and not introducing external solutions on your own. We will also continuously improve this area.

## Vue Scenario Solutions

In `Vue` scenarios, we provide multiple data management solutions, including the well-known [Vuex](https://vuex.vuejs.org/). Additionally, in `Vue3` scenarios, we provide an extra [Provide/Inject](https://v3.cn.vuejs.org/guide/composition-api-provide-inject.html#%E4%BF%AE%E6%94%B9%E5%93%8D%E5%BA%94%E5%BC%8F-property) solution to help simplify this functionality. If you still think the previous two solutions are too complex, we also provide the simplest `props` direct data output solution.

### Vuex

For specific usage of `Vuex`, developers can refer to its official documentation. We won't elaborate here. In the [Data Fetching](/docs/features$fetch) chapter, we proposed using `fetch.ts` for data fetching. In `fetch.ts`, we can get the `vuex` instance to perform related operations.

### Provide/Inject

In `Vue3`, we provide another more lightweight way for cross-component data sharing, which is `Provide/Inject`. The main difference between `Vuex` and `Provide/Inject` is that every modification of global state in `Vuex` can be traced back, while variable modifications in `provide/inject` are uncontrollable. In other words, you don't know which component modified this global state.

In small to medium applications, if you completely don't consider using `Vuex` for data management, you can delete all the default example `Vuex` related code and the `store` definition folder.

During the rendering process, we will combine the `return data` from `layout fetch` and `page fetch`, then inject it into `layout/index.vue` and `layout/App.vue` in the form of `props`. Developers can `provide` in these files as shown below.

`Note: Vue2 scenarios also provide this property, only used in layout components to get merged fetch data through props.asyncData for some logical processing, not including data management functionality.`

```html
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

Then you can get this data through `inject` in any component and can modify the data to automatically trigger updates. To prevent application data confusion, we recommend adding different `namespace` naming spaces for different components' return data. Similarly, when routes switch, we will automatically merge the data returned by `fetch.ts` into `asyncData`.

To prevent objects from losing reactivity, here we follow the rules of `ref objects`. We store the real data object in the `asyncData.value` field. And convert the entire `asyncData` to reactive. This way, we can later directly modify data through `asyncData.value = obj` or `asyncData.value.key = obj` and still keep the object `reactive`. When using this method, note that if used in `template`, you still need to add `.value` as the value won't automatically expand.

```html
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

### props Direct Data Output

This functionality requires dependency version `>5.5.43`.

In the `provide/inject` solution, to avoid losing reactivity, we need to use `.value` form to get specific data values, and we need to add different `namespace` for different pages' `fetch` return data to prevent property conflicts. These are all very necessary things. If developers think the current application doesn't need any data management solution, we provide the simplest `props direct data output` solution to allow components to get the data returned by `fetch`.

This solution is compatible with `Vue2/Vue3`. It also supports getting `fetchData` in `layout/index.vue`, `layout/App.vue`.

`Note: No longer recommend using props.fetchData, suggest uniformly replacing with props.asyncData.`

```html
// layout/App.vue
<template>
  <router-view :asyncData="asyncData"  />
</template>

<script lang="ts" setup>
import { defineProps, App } from 'vue'

const props = defineProps<{
  ssrApp: App,
  asyncData: { value: any }
}>()
</script>

```

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

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import Slider from '@/components/slider/index.vue'
import Rectangle from '@/components/rectangle/index.vue'
import Search from '@/components/search/index.vue'

export default defineComponent({
  props: ['asyncData'] // key 名固定为 asyncData 不可修改，前端路由跳转时将自动注入，服务端渲染时通过 App.vue 注入
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
})
</script>

<style>
</style>

```


## React 场景

在 `React` 场景中，我们没有使用上述的任何一种数据管理方案，我们采用了思想上与 `Provide/Inject` 类似的，同样也是 [react-hooks](https://reactjs.org/docs/hooks-intro.html) 出现后出现在大家视野的 [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext)


## valtio (推荐使用)

`注: ssr-plugin-react version >= 6.2.69`

最新支持的数据流管理工具。在 `react17|18` 中均支持。使用方式参考最新创建的 [example](https://github.com/zhangyuang/ssr/blob/dev/example/nestjs-react-ssr/web/pages/index/fetch.ts) 以及 [valtio文档](https://github.com/pmndrs/valtio)

### 使用 useContext + useReducer

随着 `hooks` 的流行以及 `useContext` 这个 API 的推出, 越来越多的开发者希望用它来代替 `Dva`, `Redux` 这些方案来实现数据管理，因为之前的数据管理方案写起来实在是太累了。

先说结论：`useContext + useReducer` 不能完全代替 `Redux` 的功能。但对于大多数应用来说它已足够够用。本框架没有使用 `任何` 基于 hooks 新造的第三方轮子来做数据通信，仅使用 `React` 提供的最原始的 `API` 来实现跨组件通信。如果你只是想进行跨组件通信，以及数据的自动订阅更新能力，你完全不需要 `Redux`。

通过使用 `useContext` 来获取全局的 `context`, `useContext` 返回两个值分别为

- state: 全局的状态，可在不同的组件/页面之间共享
- dispatch: 通过 `disptach` 来触发类型为 `updateContext` 的 `action` 来更新最顶层的 `context`

> 注: hooks 只能够在函数组件内部使用

```ts
import { useContext } from 'react'
import { IContext } from 'ssr-types'
import { useStoreContext } from 'ssr-common-utils'

// 通过 IData 指定模块自己的 data interface

const { state, dispatch } = useContext<IContext<IData>>(useStoreContext())
```

通过 `dispatch action` 来触发全局 `context` 的更新，并通知到所有的组件。在本地开发环境下我们会在控制台中输出每个修改 context 的 action 的详细信息。

> 注: dispatch 是异步的只能够在客户端渲染的阶段使用，服务端使用无效。context 更新会导致所有组件重新 render，我们需要使用 React.useMemo 来避免不必要的重新计算，且建议根据不同的模块使用不同的 namespace 防止数据覆盖

```js
import React, { useContext } from 'react'
import styles from './index.less'
import { useStoreContext } from 'ssr-common-utils'

function Search (props) {
  const { state, dispatch } = useContext<IContext<SearchState>>(useStoreContext())
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
      <input type="text" className={styles.input} value={state.search?.text ?? ''} onChange={handleChange} placeholder="该搜索框内容会在所有页面共享"/>
      <img src="https://img.alicdn.com/tfs/TB15zSoX21TBuNjy0FjXXajyXXa-48-48.png" alt="" className={styles.searchImg} onClick={toSearch}/>
    </div >
  )
}

export default Search

```

> 注: 以上只为示例，实际开发中我们只推荐在跨组件通信时使用 dispatch，局部状态应该使用 useState 来实现，否则会导致函数内部状态过于复杂，难以追踪。

### 扩展自定义 Reducer

`注：需要 version >= 5.5.80`

此功能还在不断探索中，如果你有更优秀的写法或者发现问题时可第一时间提 `issue` 进行反馈。

当应用庞大后，开发者可能需要将应用拆分为多个 `state` 和 `reducer` 的组合进行开发。

框架同样支持这种能力，我们支持用户去创建自定义的 `store` 来管理 `state` 和 `reducer`，使用方式如下

```js
// web/store/index.ts

const state = {
  searchState: {
    text: '
  }
}
function reducer (state: any, action: Action) {
  switch (action.type) {
    case 'updateSearchValue':
      return { ...state, ...action.payload }
  }
}

export {
  state,
  reducer
}
```

框架监测到这一文件后，便会将用户自定义的 `store` 与默认的 `store` 进行组合。
#### 创建多个 store

开发者可以组合多个自定义的 `store`

```js
// search.ts
const state = {
  searchState: {
    text: ''
  }
}
function reducer (state: any, action: any) {
  switch (action.type) {
    case 'updateSearchValue':
      return { ...state, ...action.payload }
  }
}
export {
  state,
  reducer
}
// count.ts
const state = {
  countState: {
    value: 0
  }
}
function reducer (state: any, action: any) {
  switch (action.type) {
    case 'updateCountValue':
      return { ...state, ...action.payload }
  }
}
export {
  state,
  reducer
}

// index.ts

import { state as countState, reducer as countReducer } from './count'
import { state as searchState, reducer as searchReducer } from './search'


const state = {
 ...countState,
 ...searchState
}

function reducer (state: any, action: any) {
  // 调用多个 reducer 并将新的 state 返回
  // 如果你有更好的写法，欢迎与我们讨论
  return countReducer(state, action) || searchReducer(state, action)

}

export {
  state,
  reducer
}
```

### 在组件中调用

```js
import { useStoreContext } from 'ssr-common-utils'

function Search () {
  const { state, dispatch } = useContext<IContext<SearchState>>(useStoreContext())
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch?.({
      type: 'updateSearchValue',
      payload: {
        searchState: {
          text: e.target.value
        }
      }
    })
  }
  return (
    <div className={styles.searchContainer}>
      <button onClick={() => {
        dispatch({
          type: 'updateCountValue',
          payload: {
            countState: {
              value: state.countState.value+1
            }
          }
        })
      }}>+1</button>
      <div>
        {state.countState.value}
      </div>
      <input type="text" className={styles.input} value={state.searchState.text ?? ''} onChange={handleChange} placeholder="该搜索框内容会在所有页面共享" />
      <img src="https://img.alicdn.com/tfs/TB15zSoX21TBuNjy0FjXXajyXXa-48-48.png" alt="" className={styles.searchImg} onClick={toSearch} />
    </div >
  )
}
```

### 注意事项

想要很好的使用上述功能，在平时开发中需要养成良好的习惯。开发者必须保证不同模块的 `namespace` 以及 `action type` 不能够重复，否则将会出现预期外的 `bug`。

关于更多 `hooks` 使用的最佳实践可以参考该[文章](https://zhuanlan.zhihu.com/p/81752821)
