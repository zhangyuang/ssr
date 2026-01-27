# Render Degradation

Compared to other framework features, this framework additionally has the capability to degrade from `Server-Side Rendering` to `Client-Side Rendering` with one click.

## Server-Side and Client-Side Rendering

Let's see what the differences are between `Server-Side Rendering` and `Client-Side Rendering`.

### Differences

`Client-Side Rendering`, `HTML` serves merely as a static skeleton. When the client makes a request, the server does no processing and returns the original file directly to the client. Then, based on the `JavaScript` in the `HTML`, DOM is generated and inserted into the HTML.

`Server-Side Rendering (SSR)`: When the browser requests a page URL, the server assembles the `HTML` text we need and returns it to the browser. After this `HTML` text is parsed by the browser, it can directly build the desired DOM tree and display it on the page without executing `JavaScript` scripts.

The most important difference between client-side rendering and server-side rendering is who completes the complete assembly of the `HTML` file. If it's completed on the server side and then returned to the client, it's server-side rendering. If the client does more work to complete the `HTML` assembly, then it's client-side rendering.

![](/images/ssr&csr.png)

> Note: In different multi-rendering modes, the timing of data acquisition by this framework's rendering methods is different. For details, see [Data Fetching](./docs/features$fetch)

### Server-Side Rendering Advantages

- SEO

It's beneficial for crawlers to crawl your pages. When searching for related content on search engines, your web pages can rank higher, thus increasing your traffic.

- Shorter White Screen Time

Compared to client-side rendering, server-side rendering has already obtained an HTML text with data after the browser requests the URL. The browser only needs to parse the HTML and directly build the DOM tree. With client-side rendering, you need to first get an empty HTML page, at which point the page has already entered a white screen state. Then it needs to go through several processes including loading and executing JavaScript, requesting the backend server for data, and JavaScript rendering the page before the final page can be seen. Especially in complex applications, because JavaScript scripts need to be loaded, the more complex the application, the more and larger JavaScript scripts need to be loaded, which can cause the application's first screen loading time to be very long, thereby reducing the user experience.

### Client-Side Rendering Advantages

- Less Server Load

Since the server only needs to return the simplest page skeleton, the server pressure will be smaller and can handle more `QPS`.

- Less Mental Burden

Writing a mature server-side rendering application undoubtedly requires higher mental and capability requirements from developers.

## How to Degrade to Client-Side Rendering

In the `ssr` framework, we provide multiple solutions for degrading to client-side rendering.

### URL Query Parameters

The framework uses server-side rendering by default when started. If you want to enable render degradation, simply add the `query` parameter `?csr=xxx` after the request `URL`.

For example, the [http://ssr-fc.com](http://ssr-fc.com/) website has server-side rendering enabled by default. You can clearly feel that the page opens instantly with no white screen waiting time. After adding the parameter [http://ssr-fc.com?csr=true](http://ssr-fc.com?csr=true), which is enabling client-side rendering and then opening the website, you can clearly feel there's a certain amount of white screen time, specifically manifested as a page flickering process.

This solution is suitable for developers to test locally.

### config.js Configuration

When publishing services, two modes are supported. The default is `mode: 'ssr'` mode. You can also set `csr` as the default rendering mode through `mode: 'csr'` in [Application Configuration](./api$config#mode).

### Degradation Through the render Method Provided by the core Module

Both [ssr-core-react](https://github.com/zhangyuang/ssr/blob/dev/packages/core-react/src/render.ts) and [ssr-core-vue](https://github.com/zhangyuang/ssr/blob/dev/packages/core-vue3/src/index.ts) (vue3) modules support this method.

Degrade to client-side rendering when the application execution encounters an error and `catches` the `error`. You can also decide to degrade to `csr` mode at appropriate times based on specific business logic. You can also integrate with a publish-subscribe mechanism to set the current rendering mode in real-time through a publishing platform.

Below you can see an example of the `ssr-core-react` module. If you have better approaches, welcome to give us feedback.

#### Handling String Return Form Degradation

String degradation handling is simple. We only need to `try catch` the error and then directly modify the rendering mode to get new results. Because at this time, component rendering is executed when the `render` method is called.

```js
import { render } from "ssr-core";

try {
  const htmlStr = await render(this.ctx);
  return htmlStr;
} catch (error) {
  const htmlStr = await render(this.ctx, {
    mode: "csr",
  });
  return htmlStr;
}
```

When the `server` has problems, this disaster recovery approach is better. An even better approach is to configure disaster recovery at the gateway level and redirect requests to `cdn`.

#### Handling Stream Return Form Degradation

Stream return form degradation handling is slightly more complicated. In `Nest.js` or `express`-based frameworks, we can use the following approach for degradation.

Here we additionally divide into `Vue3` and non-`Vue3` cases.

In `Vue3`'s `renderToNodeStream` method, when rendering errors occur, errors are thrown synchronously. Developers can directly use `try catch` at the upper level to capture them.

```js
try {
  const stream =
    (await render) <
    Readable >
    (ctx,
    {
      stream: true,
    });
  stream.pipe(res, { end: false });
  stream.on("end", () => {
    res.end();
  });
} catch (error) {
  const stream =
    (await render) <
    Readable >
    (ctx,
    {
      stream: true,
      mode: "csr",
    });
  stream.pipe(res, { end: false });
  stream.on("end", () => {
    res.end();
  });
}
```

In `Vue2/React`, they trigger `error` through `stream.emit` at the underlying level. In this case, developers need to manually listen to events.

```js
const stream =
  (await render) <
  Readable >
  (ctx,
  {
    stream: true,
  });
stream.pipe(res, { end: false });
stream.on("error", async () => {
  stream.destroy(); // Destroy the old error stream
  const newStream =
    (await render) <
    Readable >
    (ctx,
    {
      stream: true,
      mode: "csr",
    });
  newStream.pipe(res, { end: false });
  newStream.on("end", () => {
    res.end();
  });
});
stream.on("end", () => {
  res.end();
});
```

In `Midway.js/Koa`-based frameworks, use the following approach:

```js
const stream =
  (await render) <
  Readable >
  (this.ctx,
  {
    stream: true,
    mode: "ssr",
  });
stream.on("error", async () => {
  stream.destroy();
  const newStream =
    (await render) <
    string >
    (ctx,
    {
      stream: false, // Here we can only use string form to render, koa cannot reassign stream to body
      mode: "csr",
    });
  this.ctx.res.end(newStream);
});
this.ctx.body = stream;
```

## Implementation Mechanism

The principle of implementing render degradation functionality in the `ssr` framework is very simple. If you have already used this framework for project development, you should have noticed that we don't have traditional `index.html` files, nor any template engines. Our `html` page layout is completely rendered through `JSX` or `Vue SFC`.

After reading about the differences between `Server-Side Rendering` applications and `Client-Side Rendering` applications above, we can see that after degrading to client-side rendering, we don't need to render page components and data fetching on the server side. We only need to render an empty `html` skeleton. In `React` scenarios, this is represented by code as follows:

```js
const layoutFetchData = !isCsr && layoutFetch ? await layoutFetch(ctx) : null;
const fetchData = !isCsr && routeItem.fetch ? await routeItem.fetch(ctx) : null;

return (
  <Layout ctx={ctx} config={config} staticList={staticList} viteReactScript={viteReactScript}>
    {isCsr ? <></> : <Component />}
  </Layout>
);
```

The implementation principle can be seen very easily. Similarly, in `Vue` scenarios, we implement similar functionality through `slot`.

## Notes (Must Read)

When errors occur, degradation is performed. We categorize errors into two types: `Actual Runtime Errors` and `Resource Loading Errors`.

### Error Classification

For `Actual Runtime Errors`, these commonly occur during specific lifecycle execution or when components `render`. For this type of error, we can avoid them through the degradation capabilities provided by the framework.

For `Resource Loading Errors`, which are code we write at the top level of files, for example, if we bind browser objects in files `import`ed at the component top level, then regardless of which rendering mode we use, this type of error will appear. Because when we initialize the route structure, we execute the component `import` logic once. For this type of error, we can only manually write code to be compatible and solve it. Reference [documentation](http://doc.ssr-fc.com/docs/features$faq#%E5%A6%82%E4%BD%95%E8%A7%A3%E5%86%B3%E6%9C%8D%E5%8A%A1%E7%AB%AF%E8%AE%BF%E9%97%AE%E4%B8%8D%E5%8F%AF%E8%AE%BF%E9%97%AE%E7%9A%84%E5%AF%B9%E8%B1%A1%E7%9A%84%E9%97%AE%E9%A2%98).

### Component Classification

In this framework, render degradation in most scenarios is for specific page components of the `pages` type. For `layout` components and `App` components, rendering will be performed regardless of which rendering mode is used. Therefore, we recommend not writing business logic-related code in these two types of components, and try to store `no logic` type code.

### Beware of XSS

Rendering `html` tags through frontend frameworks is not recommended by these frameworks. We can see that code uses approaches like `dangerouslySetInnerHTML` to remind us not to do this. Because it's very easy to be injected with malicious scripts leading to [xss](https://developer.mozilla.org/zh-CN/docs/Glossary/Cross-site_scripting). So we must strictly control this part of rendered content and absolutely cannot have parts that users can control.

When injecting page data, we use [serialize-javascript](https://www.npmjs.com/package/serialize-javascript) to serialize `window.__INITIAL_DATA__`. However, for other content injection in the `html` head, especially `script` tag-related content, developers need to pay close attention.

## How to Deploy Using Independent HTML Files

This feature is rarely used. It may only be needed unless the developer's deployment environment doesn't have Node.js services or needs disaster recovery CDN degradation for core applications.

With this feature, we will generate an `html` file for direct deployment. The effect is the same as traditional `SPA` applications. If developers intend to deploy in `html` form from the beginning, we don't recommend using this framework. Please use scaffolding like `vue-cli`, `create-react-app`, etc.

### Usage Method

Requires version `>=5.5.62`

```shell
$ npx ssr build --html
```

After building, we will generate a `build/index.html` file that can be directly used for deployment. But choosing this solution means:

- Cannot use server-side rendering functionality
- Cannot directly use API services written in Node.js for the current application
