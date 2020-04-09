
import React from 'react'
import serialize from 'serialize-javascript'
import styles from './index.less'

const Layout = (props) => {
  const { injectCss, injectScript } = props.config
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <meta name='theme-color' content='#000000' />
        <title>Serverless Side Render</title>
        {
          injectCss && injectCss.map(item => <link rel='stylesheet' href={item} key={item} />)
        }
      </head>
      <body className={styles.body}>
        <div id='app'>{ props.children }</div>
        {
          props.fetchData && <script dangerouslySetInnerHTML={{
            __html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(props.fetchData)}`
          }} />
        }
        <div dangerouslySetInnerHTML={{
          __html: injectScript && injectScript.join('')
        }} />
      </body>
    </html>
  )
}

export default Layout
