
import React, { useContext } from 'react'
import serialize from 'serialize-javascript'
import { LayoutProps } from 'ssr-types'
import App from './App'

const Layout = (props: LayoutProps) => {
  // 注：Layout 只会在服务端被渲染，不要在此运行客户端有关逻辑
  const { state } = useContext(window.STORE_CONTEXT)
  const { injectCss, injectScript } = props.staticList!
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <meta name='theme-color' content='#000000' />
        <title>Serverless Side Render</title>
        <script dangerouslySetInnerHTML={{ __html: "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'" }} />
        { injectCss }
      </head>
      <body>
        <div id="app"><App children={props.children} /></div>
        {
          state && <script dangerouslySetInnerHTML={{
            __html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(state)}`
          }} />
        }
        { injectScript }
      </body>
    </html>
  )
}

export default Layout
