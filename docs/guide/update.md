# 从1.x版本升级

本文章将针对使用了1.x版本的用户，如何升级到最新的2.x版本，改动的地方非常的少

## 修改controller

``` js
// before
const stream = await renderToStream(ctx, 'Page', ctx.app.config)
// after
const stream = await renderToStream(ctx, ctx.app.config)
```

## 修改config.default.js

直接将新的config.default.js的内容粘贴过去即可

```js
const resolvePath = (path) => require('path').resolve(process.cwd(), path)

module.exports = {
  keys: 'eggssr',
  type: 'ssr', // 指定运行类型可设置为csr切换为客户端渲染
  static: {
    prefix: '/',
    dir: resolvePath('dist')
  },
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
      Component: () => (require('@/page/news').default),
      controller: 'page',
      handler: 'index'
    }
  ],
  baseDir: resolvePath(''),
  injectCss: [
    `/static/css/Page.chunk.css`
  ], // 客户端需要加载的静态样式表
  injectScript: [
    `<script src='/static/js/runtime~Page.js'></script>`,
    `<script src='/static/js/vendor.chunk.js'></script>`,
    `<script src='/static/js/Page.chunk.js'></script>`
  ], // 客户端需要加载的静态资源文件表
  serverJs: resolvePath(`dist/Page.server.js`)
}
 
```

## 修改layout.js

直接将新的layout组件内容粘贴过去

``` js

import React from 'react'
import '@/assets/common.less'
import './index.less'
import { Link } from 'react-router-dom'
import serialize from 'serialize-javascript'

const commonNode = props => (
  // 为了同时兼容ssr/csr请保留此判断，如果你的layout没有内容请使用 props.children ? <div>{ props.children }</div> : ''
  props.children ? <div className='normal'><h1 className='title'><Link to='/'>Egg + React + SSR</Link><div className='author'>by ykfe</div></h1>{props.children}</div>
    : ''
)

const Layout = (props) => {
  if (__isBrowser__) {
    return commonNode(props)
  } else {
    const { serverData } = props.layoutData
    const { injectCss, injectScript } = props.layoutData.app.config
    return (
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
          <meta name='theme-color' content='#000000' />
          <title>React App</title>
          {
            injectCss && injectCss.map(item => <link rel='stylesheet' href={item} key={item} />)
          }
        </head>
        <body>
          <div id='app'>{ commonNode(props) }</div>
          {
            serverData && <script dangerouslySetInnerHTML={{
              __html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(serverData)}`
            }} />
          }
          <div dangerouslySetInnerHTML={{
            __html: injectScript && injectScript.join('')
          }} />
        </body>
      </html>
    )
  }
}

export default Layout
```

## 修改entry.js

在serverRender方法中新增layoutData属性即可

``` js
const serverRender = async (ctx) => {
  // 服务端渲染 根据ctx.path获取请求的具体组件，调用getInitialProps并渲染
  const ActiveComponent = getComponent(Routes, ctx.path)()
  const Layout = ActiveComponent.Layout || defaultLayout
  const serverData = ActiveComponent.getInitialProps ? await ActiveComponent.getInitialProps(ctx) : {}
  ctx.serverData = serverData
  return <StaticRouter location={ctx.req.url} context={serverData}>
    <Layout layoutData={ctx}>
      <ActiveComponent {...serverData} />
    </Layout>
  </StaticRouter>
}
```

## 修改package.json

只需要修改 `npm script` 启动命令，加入 `ykcli`即可

``` js
"scripts": {
    "start": "rimraf dist && concurrently \"npm run ssr\" \" npm run csr \"",
    "ssr": "concurrently \"egg-bin dev\" \"cross-env NODE_ENV=development webpack --watch --config ./build/webpack.config.server.js\"",
    "csr": "cross-env NODE_ENV=development ykcli dev",
}
```