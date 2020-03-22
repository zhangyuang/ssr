# 路由分割

使用ssr能够大大提升首屏的性能，那么在ssr出现之前或者是说使用之前，大部分人都会使用的应用的性能优化方式就是路由分割。使得首屏加载的js只包含首屏组件，而类似于详情页这些组件的js可以放在路由切换后再加载。如果是代码geek的同学自然想将应用的性能做到极致。那么ssr+路由分割自然是都需要的。这里我们用到的路由分割的库是[react-loadable](https://github.com/jamiebuilds/react-loadable)。但我们实现ssr+路由分割的方式与官方的方式大有不同，可以说我们的更加简单，这里我来分析一下我们如何使用react-loadable在ssr场景下进行路由分割。

## 并非必须

虽然路由分割确实可以让我们将首页所加载的bundle提及减小，但在切换页面时候的体验上却有所缺失。有兴趣的同学可以clone [loadable](https://github.com/ykfe/egg-react-ssr/tree/dev/example/ssr-with-loadable)的example进行体验。可以发现在切换到详情页时，会有一个加载的效果出现，因为我们详情页的bundle是异步加载的而不是首屏就加载好的。所以是否使用loadable可以根据应用的具体需求而定，如果详情页的bundle过大可以考虑拆分。而并不是说一定要使用。

## 原理浅析

纯csr的应用使用react-loadable非常简单，只需要将组件外层包上一个loadable提供的hoc即可。

```js
const LoadableComponent = Loadable({
  loader: () => import('./my-component'),
  loading: Loading, // loading组件为页面组件还未加载完毕时候的loading状态展示
});
```

在这一点上我更喜欢Vue的设计，根本无需使用第三方的库，只需要把引入组件的方式改一下，让他返回一个Promise即可。当然最终的原理是一样的。

```js
// 这里进行修改……
import Foo from './Foo.vue'

// 改为这样：
const Foo = () => import('./Foo.vue')
```

实质上原理都是通过dynamic import返回一个Promise结合webpack的code spliting来进行路由分割。由于这不是本章要讲的主要内容，所以可以直接参考webpack[官方文档](https://webpack.js.org/guides/code-splitting/)这一块的内容来做一个基本的了解。

## react-loadable 官方SSR方案

让我们打开[react-loadable](https://github.com/jamiebuilds/react-loadable)的github，不出所料，ssr这么重要的功能官方自然会在文档中教你怎么做。这里摘一下部分代码

```js
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './components/App';

const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>...</head>
      <body>
        <div id="app">${ReactDOMServer.renderToString(<App/>)}</div>
        <script src="/dist/main.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Running on http://localhost:3000/');
});
Loadable.preloadAll().then(() => {
  app.listen(3000, () => {
    console.log('Running on http://localhost:3000/');
  });
});

//plugin.js
{
  "plugins": [
    "react-loadable/babel"
  ]
}
// router.js
import Loadable from 'react-loadable';

app.get('/', (req, res) => {
  let modules = [];

  let html = ReactDOMServer.renderToString(
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      <App/>
    </Loadable.Capture>
  );

  console.log(modules);

  res.send(`...${html}...`);
});

Loadable.preloadReady().then(() => {
  ReactDOM.hydrate(<App/>, document.getElementById('app'));
});
```

这里我简单说一下执行原理

1. 将服务端bundle打包成多个文件
2. 预加载组件后应用才能启动
3. 将客户端bundle打包成多个文件
4. 客户端bundle预加载后render页面

### 痛点

官方的ssr配置经过我的总结有如下痛点

- 配置复杂
- 服务端bundle要求必须都在本地硬盘

大部分骨架都是按照官方的教程来做的，个人认为配置的难度确实不小，踩的坑挺多。例如将将服务端bundle打包成多个文件使用require来让主bundle去加载分块出来的bundle，像一些骨架本地开发时服务端bundle也在内存中这就没办法直接require了。比如[easy-webpack](https://github.com/easy-team/egg-react-webpack-boilerplate/issues/23)的方案，就只能在开发模式时，栓选出 异步chunk 模块，然后落地磁盘。像我们的骨架，服务端bundle直接就打包成实体文件在磁盘中自然是没有这个问题的。但是我还是不想这么做，因为在[最佳实践](./deploy.md)中，我们推荐是将所有的bundle全部上cdn。如果要将服务端bundle打包成多个文件，那么就得根据`manifest`整理出依赖关系将cdn上所需的bundle全部下载到本地，做自然是有办法做的，但这就导致我们做的逻辑要更多了且难以理解。

## 不要将服务端bundle打包成多个文件

个人认为将将服务端bundle打包成多个文件虽然说确实可以将bundle的体积更小化，但是带来的配置成本确是过于高昂。且由于ssr bundle通常是开启了external选项后才打包的，生产环境的体积大部分在几kb到几十kb之内，且配合require本身的缓存，这部分的加载性能实测几乎无任何差别。所以本骨架不将服务端bundle打包成多个文件依然保持一个文件。

## 更好的进行客户端预加载工作

在ssr场景下由于我们首屏的html在服务端已经直出了，这时候react-loadable的loading状态就不需要展示了，如果展示了就会出现错误的效果以及`content not match`的错误提示。所以这时候我们需要将loadable包裹的组件的真实值获取到。好在react-loadble提供给我们了preload这个静态方法。静态方法的调用时机是在组件render之前，这个有好有坏。好处是我们可以在组件render之前就做好很多事情，例如数据预取。坏处是没办法和hooks以及suspence结合起来了。这些特性的执行时机都在render阶段。

我们只需要将非首屏的组件用loadable包裹异步加载即可。

```js
routes: [
    {
        path: '/',
        exact: true,
        Component: () => (require('@/page/index').default), // 这里使用一个function包裹为了让它延迟require
        controller: 'page',
        handler: 'index'
    },
    {
        path: '/news/:id',
        exact: true,
        Component: () => (__isBrowser__ ? require('react-loadable')({
        loader: () => import(/* webpackChunkName: "news" */ '@/page/news'),
        loading: function Loading () {
            return React.createElement('div')
        }
        }) : require('@/page/news').default // 通过这种方式来让服务端bundle不要分块打包
        ),
        controller: 'page',
        handler: 'index'
    }
]
```

这里有一个坑就是我们用一个function来将组件包裹起来了为了前后端共用一个路由配置，导致Loadable没办法预先知道你有哪些组件被包裹了，所以没办法直接调用Loadable.preloadReady()来预加载。只能自己写一个[preloadComponen](https://github.com/ykfe/egg-react-ssr/blob/dev/packages/ykfe-utils/src/preloadComponent.ts)方法来手动调用组件的preload方法了。

```js
import { pathToRegexp } from 'path-to-regexp'
import cloneDeepWith from 'lodash.clonedeepwith'
import { RouteItem } from './interface/route'

const preloadComponent = async (Routes: RouteItem[]) => {
  const _Routes = cloneDeepWith(Routes)
  for (let i in _Routes) {
    const { Component, path } = _Routes[i]
    let activeComponent = Component()
    if (activeComponent.preload && pathToRegexp(path).test(location.pathname)) {
        // 只有在你访问的path和组件为同一个path才拿到真实的组件，其他情况还是返回Loadable Compoennt来让首屏不要去加载这些组件
      activeComponent = (await activeComponent.preload()).default
    }
    _Routes[i].Component = () => activeComponent
  }
  return _Routes
}

export {
    preloadComponent
}
```

然后在clientRender中调用一下该方法

```js
const clientRender = async () => {
  const clientRoutes = await preloadComponent(Routes)
  // 客户端渲染||hydrate
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    <BrowserRouter>
      {
        // 使用高阶组件getWrappedComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
        clientRoutes.map(({ path, exact, Component }) => {
          const activeComponent = Component()
          const WrappedComponent = getWrappedComponent(activeComponent)
          const Layout = WrappedComponent.Layout || defaultLayout
          return <Route exact={exact} key={path} path={path} render={() => <Layout><WrappedComponent /></Layout>} />
        })
      }
    </BrowserRouter>
    , document.getElementById('app'))

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}
```

## 总结

你可以发现，你实际上只需要在clientRender中添加一行代码，以及用react-loadable来将组件包裹一下之外无所多做任何配置。比起官方那极其复杂的做法我们的做法无疑简洁多了。当然唯一的缺点就是服务端bundle没有分块，但是这点性能差异比起配置的简洁以及易用性来说可以忽略不计。所以说官方的推荐做法在大部分情况下可以参考，但还是要有自己的理解，其实react-loadable的源码也就几百行花上3天时间基本可以看懂每一行代码是干什么的了。