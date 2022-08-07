# 数据获取

数据获取是服务端渲染应用中非常重要的一个环节。通过本章节的内容，读者可以了解服务端渲染应用的一些深层次的知识

## 静态方法获取数据

`ssr` 框架提出定义 `fetch.ts` 文件用于获取数据，本质上与 `Vue` 提出的 `asyncData`, `Next.js` 提出的 `getInitialProps` 意义一致，都属于一个静态方法。

关于什么是 `static method`, 即不需要将类实例化便可以拿到的方法。例如下面的代码

```js
class Foo {}

Foo.bar = () => {}
```

此时的 `bar` 函数即为 `static method`, 我们可以直接通过 `Foo.bar()` 来调用它，而不需要 `new Foo()`。这里大部分用户可能会有疑惑，为什么要使用一个静态方法来进行数据的获取，而不是像传统 SPA 应用一样直接写在组件的生命周期当中呢。

对服务端渲染有一定了解的同学会知道，在服务端会执行的生命周期只有 `created/componentWillMount`，而像 `mounted/componentDidMount` 这样的生命周期是不会被执行的。那么我们将获取数据的逻辑写在 `created` 当中是否可行呢。答案也是否定的

由于我们获取数据的逻辑一般都是异步的。在服务端渲染的过程中，并不会像客户端应用那样，当 `props/state` 改变时组件重新 `render`。举个例子，下面的代码是无法拿到正确的渲染结果的

```js
class Foo extends React.component {
    construtor (props) {
        super(props)
        this.state = {
            value: 'foo'
        }
    }
    async componentWillMount() {
        const newValue = await Promise.resolve('bar')
        this.setState({
            value: newValue
        })
    }
    render() {
        return (
            <div>{this.state.value}</div>
        )
    }
}
```

上述代码我们期望的渲染结果是 `value=bar` 但是实际的结果却并不是这样。有兴趣的同学可以实际运行一下上述代码来观察一下具体的现象。同理在 `Vue` 当中我们也不能够拿到正确的数据。所以我们需要定义一个静态方法来获取数据

## fetch.ts 规范

我们在静态方法的基础上抽象出 `fetch.ts` 文件规范来作为获取数据的入口文件。因为对一些大团队来说，我们在服务端通常可以采用 `rpc` 类型的调用，或是直接调用 `Node Service` 的代码来获取数据，无需通过 `http` 请求，所以在 `fetch.ts` 中，我们可能会编写服务端相关代码，故独立出一个文件来进行维护。

`fetch.ts` 的定义是页面级别的组件进行数据获取的入口文件，不包括子组件。由于在服务端一个组件被真正的 `render` 之前，我们并不知道它依赖哪些子组件。所以我们没有办法调用子组件的 `fetch`, 当然也有其他方式可以解决这个问题。见本文最后的补充内容。在 `Vue` 场景这个问题很容易解决，我们将会在之后的版本在 `Vue` 场景加入对子组件数据获取的支持。

`fetch.ts` 的文件类型分为两种

### Layout fetch

`Layout` 级别的 `fetch` (可选)，定义在 `web/components/layout/fetch.ts` 路径

意义: `Layout` 级别的 `fetch` 用于初始化一些所有页面都会用到的一些公共数据，若该文件存在则调用。将会把返回的数据与页面级别的 `fetch` 合并返回给开发者。`Layout` 场景只允许存在一个 `fetch` 文件

### 页面级 fetch

页面级别的 `fetch` (可选, 可以存在多个)，定义在 `web/pages/xxx/fetch.ts` 路径

意义: 页面级别的 `fetch` 将会在当前访问该前端页面组件对应的 `path` 时被调用

#### fetch 与 render 对应关系

`fetch` 文件与 `render` 对应关系如下

- 当只有一个 `fetch` 文件时，当前文件夹所有的 `render` 文件都对应这个 `fetch` 文件
- `fetch` 文件存在多个时，`render` 文件与 `fetch` 文件名一一对应，例如 `render.vue` => `fetch.ts`, `render$id.vue` => `fetch$id.ts`

### fetch 调用时机

这里我们将其分为`服务端渲染模式`和`客户端渲染模式`两种情况

#### 服务端渲染模式

将会在服务端渲染执行的过程中被调用。在客户端激活的过程中会复用服务端获取并注入到 `window` 中的数据来进行初始化。不会在客户端再次获取。当客户端进行前端路由切换时会调用将要前往的页面对应的 `fetch`。下图中的 `fetch` 代表 `layout fetch` + `page fetch`。有则调用。

![](/images/ssr-fetch.png)

#### 客户端渲染模式

此时服务端不会进行任何的数据获取操作, 仅渲染一个空的 `html` 骨架，实际的数据获取以及 DOM 渲染的操作都会在客户端执行。也就跟大家熟悉的传统客户端 SPA 应用的行为一致了

![](/images/csr-fetch.png)

#### 判断当前环境

在默认的示例中，我们会通过 `__isBrowser__` 变量来标志当前环境是为了让开发者了解该文件可能会在 `服务端`，`客户端` 两种不同的环境中执行。该变量构建过程中会自动注入无需开发者关注。而真实应用中，除了基础建设成熟的公司或部门会在 `Node.js` 层通过 `RPC` 的方式去调用其他语言的接口之外，大部分公司还是使用 `HTTP` 的形式来请求服务。这种情况不需要通过 `__isBrowser__` 判断环境。可直接用 [axios](https://github.com/axios/axios) 发起 `HTTP` 请求, `axios` 会自动根据当前环境判断是客户端则使用 `xhr` 对象发起请求服务端则使用 `http` 模块发起请求。

### 方法入参

在 `Vue`, `React` 场景以及 `服务端`，`客户端` 环境我们的 `fetch.ts` 的入参会有稍许不同

#### Vue 场景

在 `Vue` 场景中，我们将会把 `vuex`, `vue-router` 返回的实例作为参数传入。开发者可以在任何时候使用它们。在 `服务端` 环境，我们会额外把当前请求的上下文 `ctx` 传入。开发者可以通过 `ctx` 拿到上面挂载的 `自定义 Service` 或者 `ctx.request` 等对象信息。这取决于服务端代码调用 `core` 模块时的具体入参实现。

```js
import { Store } from 'vuex'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { ISSRMidwayContext } from 'ssr-types'
import { IndexData } from '~/typings/data'
interface IApiService {
  index: () => Promise<IndexData>
}
interface Params {
  store: Store<any>
  router: RouteLocationNormalizedLoaded
}

export default async ({ store, router }: Params, ctx?: ISSRMidwayContext<{
  apiService?: IApiService
}>) => {
  const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx?.apiService?.index()
  await store.dispatch('indexStore/initialData', { payload: data })
}

```

#### React 场景

在 `React` 场景，我们在 `服务端` 会将当前请求的上下文 `ctx` 作为参数传入。开发者可以通过 `ctx` 拿到上面挂载的 `自定义 Service` 或者 `ctx.request` 等对象信息。这取决于服务端代码调用 `core` 模块时的具体入参实现。在前端路由切换时，也就是客户端 `fetch` 数据场景。我们会将 `react-router` 提供的[路由元信息](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d90beb2f67881d54384c0f9b42a03233aaba1ca1/types/react-router/index.d.ts#L69)作为参数传入。


```js
import { ReactMidwayFetch } from 'ssr-types'
import { IndexData } from '~/typings/data'

const fetch: ReactMidwayFetch<{
  apiService: {
    index: () => Promise<IndexData>
  }
}> = async ({ ctx, routerProps }) => {
  // 阅读文档获得更多信息 http://doc.ssr-fc.com/docs/features$fetch#%E5%88%A4%E6%96%AD%E5%BD%93%E5%89%8D%E7%8E%AF%E5%A2%83
  const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx!.apiService?.index()
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    indexData: data
  }
}

export default fetch

```
### 注意

上述图片指的是用 `前端路由` 进行跳转的情况。此时的跳转并不会真正的向服务端发起请求。所以数据的获取是在客户端完成的。

如果开发者使用 `a` 标签进行跳转。则此时可视为完全打开一个新页面。此时的数据获取操作仍然是在服务端完成

### 不同场景实现差异

在 `React` 场景以及 `Vue` 场景我们的切换路由 `fetch` 数据的时机略有不同。之所以会有差异这里是为了选择不同框架实现起来最简单好用的方式。

在 `React` 场景，我们会用一个 [高阶组件](https://github.com/zhangyuang/ssr/blob/dev/packages/hoc-react/src/wrapComponent.tsx) 包裹在所有的页面级别组件外部。在 `useEffect` 中获取数据。所以我们的行为会是跳转后立即打开跳转后的页面组件，当执行完 `useEffect` 的逻辑后拿到数据修改 `Context` 再触发组件的重新 `render`

在 `Vue` 场景，我们会在 `beforeResolve` 钩子调用跳转后的页面组件的 `fetch` 所以我们会在拿到数据后，才能够打开新页面

## 补充内容

通过上面的内容开发者可以知道在一个服务端渲染应用中我们应该怎么获取数据了。但是比起纯客户端应用我们还是有一些不足如下

- 只能够获取页面级组件数据，不包含子组件
- 必须通过静态方法来获取

针对第一个问题, 在 `Vue` 场景非常容易解决。我们可以直接在组件对象中拿到当前依赖的子组件。通过定义一些规范，我们可以支持子组件 `fetch` 文件的获取执行。我们将会在之后的版本支持这一功能。

在 `React` 场景略麻烦，`react-graphQl-apollo` 的解决思路是将组件在服务端渲染两次。第一次渲染时我们可以拿到当前的组件具有哪些子组件并且可以拿到子组件上定义的静态方法。进行收集并调用。在第二次渲染的时候将收集的数据与组件结合变成完整的字符串。当然这样的缺陷就是渲染两次会对性能造成一定影响。但也是一个思路

针对 `double rendering` 以及 静态方法的问题，我们都可以通过 [React Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html) 来解决。`Suspense` 的概念有些丰富，这里不进行详细描述。这里摘录官网的[示例代码](https://codesandbox.io/s/frosty-hermann-bztrp?file=/src/fakeApi.js)进行讲解

```js
// This is not a Promise. It's a special object from our Suspense integration.
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

在 `resource.posts.read()` 中，我们会进行一个异步的获取数据的操作。当然它返回的并不是一个 `Promise` 对象，而是一个特殊的 `Suspense integration`。在组件渲染的过程中，会等待 `posts` 的数据真正返回后，在进行具体的 `render` 逻辑。也就是我们用同步的写法来描述了一个异步的操作。

当然目前 `Suspense` 的特性并没有成熟，特别是与服务端渲染结合这一块还有许多问题要解决。但是也是一个未来的发展思路。值得关注。