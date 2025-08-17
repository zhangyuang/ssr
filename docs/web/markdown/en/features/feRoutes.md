# Conventional Routing

Conventional routing automatically generates frontend routing configuration based on the frontend folder structure.

This framework supports both conventional routing and declarative routing. When a `web/route.ts` file is detected, it will be used as the frontend routing structure, but we don't recommend you do this. Because the framework will generate different routing structures based on your current different configurations, and it also doesn't guarantee that these structures will remain unchanged in future versions. Manual writing is too much work and error-prone. In the absence of special requirements, it's recommended to directly use conventional routing.

`Note: In the latest version, we support the coexistence of conventional routing and declarative routing, with declarative routing having higher priority.`
## Routing Rules

Below we introduce our detailed routing mapping rules. The following is a basic `web` folder structure. We mainly focus on the `web/pages` folder and parse the frontend routing structure based on this folder.

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

### Page Components

Each folder under the `pages` folder, we consider it a page. The above structure contains two pages: `index` and `detail`.

Similarly, we define `render` files to represent a page's rendering component. `render` files support multiple formats to handle different types of frontend routes.

### Normal Routes

The most common normal routes are `/`, `/detail`, `/user` - we just need to create folders with the same names. Here we specially handle the root route by mapping the `index` folder.

- `/index/render.vue` maps to `/`
- `/detail/render.vue` maps to `/detail`
- `/user/render.vue` maps to `/user`

### Dynamic Routes

Dynamic routes are routes with parameters, such as `/user/:id`.

- `/user/render$id.vue` maps to `/user/:id`
- `/user/render$foo$bar.vue` maps to `/user/:foo/:bar` in multi-parameter cases

### Optional Parameter Routes

Can be used in both `React|Vue` scenarios. Since the `?` symbol cannot be used as a filename, we need to use the `#` symbol instead.

- `/index/render$id#.vue` maps to `/:id?`

### Wildcard Routes

Used to match all files that meet the requirements. Considering both [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) and [vue-router](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E6%8D%95%E8%8E%B7%E6%89%80%E6%9C%89%E8%B7%AF%E7%94%B1%E6%88%96-404-not-found-%E8%B7%AF%E7%94%B1) documentation, we use the following structure.

Since the `*` symbol cannot be used as a filename in `Windows`, we need to use the `&` symbol instead.

- `/detail/render$params&.vue` maps to `/detail/:params*`, essentially corresponding to all requests from `/detail/*`.

`React` scenarios work the same way.

### Multi-level Routes

Although we don't use multi-level routes in most cases, we still provide corresponding parsing strategies here. If all your application routes need a unified prefix before the `path`, you should implement it through `config.prefix` rather than multi-level routes. Reference [Application Configuration](./api$config#prefix).

- `/user/detail/render$id` maps to `/user/detail/:id`
- `/user/detail/render$foo$bar` maps to `/user/detail/:foo/:bar`

### Nested Routes

Conventional routing doesn't support generating nested routes, which are `children` sub-structures. Although supporting nested routes isn't difficult, it would make the specification complex. Especially for data fetching, implementing nested routes with business code is very simple. In `React`, you can directly manually import `Router` to implement it. In `Vue`, you need to manually fill in the `children` field. If nested route `fetch` isn't supported, it's very easy to implement, but it's not meaningful - developers can implement it directly in business code. If nested route `fetch` is supported, it would make the specification complex. For example, at the framework level, `render$child$foo.vue` would correspond to `fetch$child$foo.ts` files. This is very `dirty`, so we don't plan to support nested routes.

### Manually Writing Nested Routes

In `Vue2/3` scenarios, since the underlying `vue-router` supports nested route writing specifications, the `ssr` framework layer here also supports manually writing nested routes and can correctly match and render on the server side. The `children` field here is consistent with the official `vue-router` usage. The `webpackChunkName` writing specification is consistent with the manual route writing specification notes mentioned below.

```js
// web/route.ts
export const FeRoutes = [
  {
    fetch: async () => await import(/* webpackChunkName: "detail-id-fetch" */ '@/pages/detail/fetch'),
    path: '/detail',
    component: async () => await import(/* webpackChunkName: "detail-id" */ '@/pages/detail/detail.vue'),
    webpackChunkName: 'detail',
    children: [
      {
        path: 'foo', // Will match requests to /detail/foo
        fetch: async () => await import(/* webpackChunkName: "detail-foo-fetch" */ '@/pages/detail/detail-fetch'),
        component: async () => await import(/* webpackChunkName: "detail-foo" */ '@/pages/detail/foo.vue'),
        webpackChunkName: 'detail-foo'
      }
    ]
  }
]

```
### Implementation Code

For specific implementation code, you can view this [file](https://github.com/zhangyuang/ssr/blob/dev/packages/utils/server/src/parse.ts#L26).

## Manually Writing Route Structure

Although we don't recommend developers to manually write route structures, if you must do so, we provide the following examples.

Notes

- `web/route.ts` will be compiled to the build/ssr-manual-route.js file, so don't use relative paths to import other modules in route files, otherwise the paths won't be correctly recognized.
- The `webpackChunkName` field and `import(/* webpackChunkName: "detail-id" */)` are identifiers that must be used when `Webpack/Vite` build tools package. So when manually writing route structures, please make sure to fill them in correctly. Ensure that different page components' `webpackChunkName` don't duplicate.

```js
// web/route.ts
export const FeRoutes = [
    {   
        "fetch": () => import(/* webpackChunkName: "detail-id-fetch" */ '@/pages/detail/fetch'),
        "path": "/detail/:id",
        "component": () => import(/* webpackChunkName: "detail-id" */ '@/pages/detail/render$id'), // vue 场景用此写法
        "component": async function dynamicComponent () { return await import(/* webpackChunkName: "detail-id" */ '@/pages/detail/render$id') }, // react 场景需要固定函数名称为 dynamicComponent
        "webpackChunkName": "detail-id"
    },
    {
        "fetch": () => import(/* webpackChunkName: "index-fetch" */ '@/pages/index/fetch'),
        "path": "/",
        "component": () => import(/* webpackChunkName: "index" */ '@/pages/index/render'), // vue 场景用此写法
        "component": async function dynamicComponent () { return await import(/* webpackChunkName: "index" */ '@/pages/index/render') }, // react 场景需要固定函数名称为 dynamicComponent
        "webpackChunkName": "index"
    }
]
```

### Priority Override

The override rules are as follows:

- When `FeRoutes` has declarative routes with the same `path` as conventional routes, declarative route files take the highest priority to override default conventional route rules, and will additionally add new route configurations from declarative routes.