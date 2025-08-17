# 预渲染

`SSG (Static Site Generation)` 是指在应用编译构建时预先渲染页面，并生成静态的 HTML。把生成的 HTML 静态资源部署到服务器后，浏览器不仅首次能请求到带页面内容的 HTML ，而且不需要服务器实时渲染和响应，大大节约了服务器运维成本和资源。此方案适用于不依赖动态数据的静态站点，例如官网，博客，文档等。

## 如何开启

```bash
$ npx ssr build --ssg
```

开启后框架将会将每一个前端路由文件渲染为最终一一对应的完整 `html` 文件可直接用于部署。

```bash
$ tree build/client
build/client
├── Page.18a19313.chunk.css
├── Page.4546aa24.chunk.js
├── asset-manifest.json
├── detail-id-fetch.1824d98a.chunk.js
├── detail-id.f47d5eaa.chunk.js
├── detail-id.html
├── index-fetch.6c53d38c.chunk.js
├── index.d10576be.chunk.js
├── index.html
├── runtime~Page.e877f612.js
└── vendor.93a2efd8.chunk.js
```

## 使用细节

由于我们运行时不存在动态环境，所以数据是构建时静态生成的。我们同样通过 `fetch.ts` 来向应用提供数据。但要注意，此时 `fetch.ts` 只能够返回静态内容，同时我们也无法在 `fetch.ts` 中取得任何动态信息。例如传统 `SSR` 场景的 `ctx` 上下文，此时是无法获取的。

```js
// fetch.ts
import { Params } from '~/typings/data'

export default async ({ store, router }: Params) => {
  if (SSG) {
    // 根据该常量判断当前是否是 SSG 构建环境，此常量将会在构建时注入可直接使用
    const data = mockData || await axios.get('xxx') // 这里只能获取不依赖任何请求上下文就能够获得的数据
    await store.dispatch('indexStore/initialData', { payload: data }) // 这里依然 follow 框架定义的 fetch.ts 使用规范，可用任意方式返回数据 vuex/pinia/props
  } else {
    // 是 SSR 环境
  }
}

```

## 注意

这里相当于我们在构建时模拟了一个请求上下文去渲染页面。得到的最终结果虽然是 `html` 文件，但在运行时仍然要 `follow` 前端路由的规范。

例如我们的前端文件 `detail/render$id.vue` 渲染成 `detail-id.html`, 此时它对应前端路由是 `detail/:id` 这意味着我们在浏览器打开该 `html` 文件时浏览器 `url` 需要保持与前端路由匹配

也就是如下规则

- `http://localhost:3000/detail-id.html` ❌
- `http://localhost:3000/detail/detail-id.html` ☑️
