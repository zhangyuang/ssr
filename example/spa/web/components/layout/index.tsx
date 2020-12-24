
import React, { useContext } from 'react'
import serialize from 'serialize-javascript'
import { LayoutProps } from 'ssr'
import styles from './index.less'

const Layout = (props: LayoutProps) => {
  const {state, dispatch} = useContext((window as IWindow).STORE_CONTEXT)
  const { injectCss, injectScript } = props.staticList
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
      <body className={styles.body}>
        <div id='app'>{ props.children }</div>
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
