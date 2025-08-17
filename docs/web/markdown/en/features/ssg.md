# Pre-rendering

`SSG (Static Site Generation)` refers to pre-rendering pages during application compilation and build time, generating static HTML. After deploying the generated HTML static resources to the server, browsers can not only request HTML with page content on the first visit, but also don't need real-time server rendering and response, greatly saving server operation and maintenance costs and resources. This solution is suitable for static sites that don't depend on dynamic data, such as official websites, blogs, documentation, etc.

## How to Enable

```bash
$ npx ssr build --ssg
```

After enabling, the framework will render each frontend route file into corresponding complete `html` files that can be directly deployed.

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

## Usage Details

Since there's no dynamic environment at runtime, data is statically generated at build time. We still provide data to the application through `fetch.ts`. However, note that `fetch.ts` can only return static content at this time, and we cannot obtain any dynamic information in `fetch.ts`. For example, the `ctx` context from traditional `SSR` scenarios cannot be obtained at this time.

```js
// fetch.ts
import { Params } from '~/typings/data'

export default async ({ store, router }: Params) => {
  if (SSG) {
    // Judge whether current is SSG build environment based on this constant, this constant will be injected at build time and can be used directly
    const data = mockData || await axios.get('xxx') // Here you can only get data that doesn't depend on any request context
    await store.dispatch('indexStore/initialData', { payload: data }) // This still follows the framework-defined fetch.ts usage specification, data can be returned in any way vuex/pinia/props
  } else {
    // It's SSR environment
  }
}

```

## Notes

Here, it's equivalent to us simulating a request context to render pages at build time. Although the final result is an `html` file, it still needs to `follow` frontend routing specifications at runtime.

For example, our frontend file `detail/render$id.vue` is rendered into `detail-id.html`. At this time, its corresponding frontend route is `detail/:id`, which means when we open this `html` file in the browser, the browser `url` needs to match the frontend route.

That is, the following rules:

- `http://localhost:3000/detail-id.html` ❌
- `http://localhost:3000/detail/detail-id.html` ☑️
