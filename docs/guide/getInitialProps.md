# 服务端数据预取

服务端渲染将获取数据的操作，由原来的客户端发起ajax请求数据的形式改为由服务端获取。当然你也可以部分数据由服务端获取部分数据由客户端获取，这一点我们放在性能优化章节讲解。这里我们将服务端的逻辑封装到一个名为serverRender的方法中进行。在这个方法中我们做的任务是获取到需要渲染的组件以及数据，将他们在Node侧编译为html返回给客户端。

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, StaticRouter, Route } from 'react-router-dom'
import defaultLayout from '@/layout'
import { getWrappedComponent, getComponent } from 'ykfe-utils'
import { routes as Routes } from '../config/config.ssr'

const serverRender = async (ctx) => {
  // 服务端渲染 根据ctx.path获取请求的具体组件，调用getInitialProps并渲染
  const ActiveComponent = getComponent(Routes, ctx.path)
  const serverData = ActiveComponent.getInitialProps ? await ActiveComponent.getInitialProps(ctx) : {}
  const Layout = ActiveComponent.Layout || defaultLayout
  ctx.serverData = serverData
  return <StaticRouter location={ctx.req.url} context={serverData}>
    <Layout layoutData={ctx}>
      <ActiveComponent {...serverData} />
    </Layout>
  </StaticRouter>
}
```

下面我们来按顺序讲解改方法的作用

1. 这里我们首先从config.default.js里配置的路由表中，根据当前请求的path，来确定我们要渲染哪一个组件，getComponent你可以理解为一个根据path从路由表中找到匹配的组件的方法  
由于路由表中的组件是写成一个function包裹的形式

```js
// 路由表的Component字段之所以要写成function包裹的形式，是因为egg启动时就会加载config.default.js,这时候我们的组件未经babel处理是es6 modules的语法，在Node侧会报错，所以这里我们要延迟加载具体组件
Component: () => (require('@/page/index').default)
```

。所以这里我们要调用这个function，拿到正确的组件类型  

2. 检测该组件上有没有getInitialProps静态方法，这里之所以要用静态方法，是为了不需要实例化就可以拿到方法。如果有的话，我们调用这个方法并将ctx作为参数传入进去 

3. 获取layout，如果组件有自定义的特殊layout的话，我们将layout挂在组件的静态属性上，在这里获取，如果没有的话用默认的layout

4. 将数据挂在ctx上，使得在其他地方可以通过ctx对象读取，这一步我们需要在服务端渲染html的时候，将数据通过window.__initialData__注入到页面中，作为客户端hydrate的初始化数据

5. 将数据作为组件的props传入，使得组件可以通过props.xxx的方式来读取到服务端获取的数据

6. serverRender方法最后返回一个React Element，将会作为ReactDOMServer.renderToStream()这个方法的参数传入。这也是我们服务端的打包入口文件，因为其中包含了大量的es6以及JSX语法，所以我们必须得经过webpack + babel处理后，才能在Node侧调用该方法