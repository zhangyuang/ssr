# 约定式路由

约定式路由即根据前端文件夹结构来自动的生成前端路由配置。  

本框架同时支持约定式路由和声明式路由，当检测到 `web/route.ts` 文件存在时会使用该文件来作为前端路由结构, 但我们默认不支持你这么做。因为框架会根据你当前的不同配置来生成不同的路由结构，例如在 `dynamic`， `vite` 这些模式下 `parse` 出的路由结构是有一定差异的。如果手动编写工作量过大且容易出错。在没有特殊需求的情况下建议直接使用约定式路由。

## 路由规则

下面来介绍我们详细的路由映射规则, 以下为一个基础的 `web` 文件夹的结构，我们主要关注 `web/pages` 文件夹，根据该文件夹来 `parse` 前端路由结构

```shell
$ tree ./ -I node_modules -L 3
├── pages
│   ├── detail
│   │   ├── fetch.ts
│   │   └── render$id.vue
│   └── index
│       ├── fetch.ts
│       └── render.vue
```

### 页面组件

`pages` 文件夹下的每个文件夹，我们都会认为它是一个页面。上述结构包含 `index`, `detail` 两个页面。

同样我们定义 `render` 文件代表一个页面的渲染组件。`render` 文件支持多种格式来应对不同类型的前端路由

### 普通路由

最常见的普通路由即 `/`, `/detail`, `/user` 这种我们只需要创建同名文件夹即可。这里我们特殊针对根路由，来将 `index` 文件夹进行映射

- `/index/render.vue` 映射为 `/`
- `/detail/render.vue` 映射为 `/detail`
- `/user/render.vue` 映射为 `/user`

### 动态路由

动态路由即携带参数的路由，例如 `/user/:id` 这种

- `/user/render$id.vue` 映射为 `/user/:id`
- `/user/render$foo$bar.vue` 多参数的情况下映射为 `/user/:foo/:bar`

### 可选参数路由

在 `React|Vue` 场景下均可使用。由于 `?` 符号无法作为文件名使用，所以这里我们需要用 `#` 号代替

- `/index/render$id#.vue` 映射为 `/:id?`

### 多级路由

尽管在大多数情况下我们用不到多级路由，但这里我们仍然提供了对应的解析策略。如果你的应用所有路由 `path` 前面都需要加上一个统一的前缀，那么你应该通过 `config.prefix` 来实现，而不是多级路由。参考[应用配置](./api$config#prefix)

- `/user/detail/render$id` 映射为 `/user/detail/:id`
- `/user/detail/render$foo$bar` 映射为 `/user/detail/:foo/:bar`

### 嵌套路由

约定式路由不支持生成嵌套路由也就是 `children` 子结构。虽然支持嵌套路由并不难，但这会让规范变得复杂。特别是获取数据这一块，且嵌套路由用业务代码实现是非常简单的事情。在 `React` 中直接手动引入 `Router` 来实现即可。在 `Vue` 中需要手动填写 `children` 字段。如果不支持嵌套路由的 `fetch`， 那么非常容易实现，但是意义不大开发者直接在业务代码中实现即可，如果要支持嵌套路由的 `fetch` 那么会让规范变得复杂。例如需要在框架层面让 `render$child$foo.vue` 对应 `fetch$child$foo.ts` 文件。这非常的 `dirty`，所以并不打算支持嵌套路由。

### 输出 parse 结构

在本地开发时可以通过框架内置的 `DEBUG` 模块的能力打印出 `parse` 后的前端路由结构

```shell
$ DEBUG=ssr:* npm start
```

也可以直接查看 `build/ssr-temporary-routes.js` 文件
### 实现代码

具体的实现代码可以查看该[文件](https://github.com/ykfe/ssr/blob/dev/packages/server-utils/src/parse.ts#L13)

## 手动编写路由结构

尽管我们不建议开发者来手动编写路由结构，但如果你一定要这么做的话，我们提供以下示例。

关于为什么要使用 `__isBrowser__` 常量做环境区分，一方面是为了客户端兼容 `vite` 场景需要 `All in ESM`, 一方面是为了实现最简单的[代码分割](./features$dynamic)功能。

### Vue 场景

在 Vue 场景我们按照如下规范编写前端路由结构

```js
import * as store from '@/store/index.ts' // 使用了 Vuex 则需要引入 store

export const FeRoutes = [
    {   
        "fetch": __isBrowser__ ? () => import(/* webpackChunkName: "detail-id-fetch" */ '@/pages/detail/fetch.ts') : require('@/pages/detail/fetch.ts').default,
        "path": "/detail/:id",
        "component": __isBrowser__ ? () => import(/* webpackChunkName: "detail-id" */ '@/pages/detail/render$id.vue') : require('@/pages/detail/render$id.vue').default,
        "webpackChunkName": "detail-id"
    },
    {
        "fetch": __isBrowser__ ? () => import(/* webpackChunkName: "index-fetch" */ '@/pages/index/fetch.ts') : require('@/pages/index/fetch.ts').default,
        "path": "/",
        "component": __isBrowser__ ? () => import(/* webpackChunkName: "index" */ '@/pages/index/render.vue') : require('@/pages/index/render.vue').default,
        "webpackChunkName": "index"
    }
]
export { default as Layout } from "@/components/layout/index.vue"
export { default as App } from "@/components/layout/App.vue"
export { store }
```

### React 场景

在 React 场景我们按照如下规范编写前端路由结构

```js
import React from "react"
import loadable from 'react-loadable'
export const FeRoutes = [
{
  "fetch": __isBrowser__ ? () => import(/* webpackChunkName: "detail-id-fetch" */ '@/pages/detail/fetch.ts') : require('@/pages/detail/fetch.ts').default,
  "path": "/detail/:id",
  "component": __isBrowser__ ? loadable({
    loader: () => import(/* webpackChunkName: "detail-id" */ '@/pages/detail/render$id.tsx'),
    loading: function Loading() {
      return React.createElement('div')
    }
  }) : require('@/pages/detail/render$id.tsx').default, "webpackChunkName": "detail-id"
}, 
{
  "fetch": __isBrowser__ ? () => import(/* webpackChunkName: "index-fetch" */ '@/pages/index/fetch.ts') : require('@/pages/index/fetch.ts').default,
  "path": "/",
  "component": __isBrowser__ ? loadable({
    loader: () => import(/* webpackChunkName: "index" */ '@/pages/index/render.tsx'),
    loading: function Loading() {
      return React.createElement('div')
    }
  }) : require('@/pages/index/render.tsx').default, "webpackChunkName": "index"
}]
export { default as App } from "@/components/layout/App.tsx"
```