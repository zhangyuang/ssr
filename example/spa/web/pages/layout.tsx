
import * as React from 'react'
import * as serialize from 'serialize-javascript'
// import * as styles from './index.less'

import './index.less'

// console.log(styles)

const Layout = (props) => {
  const { injectCss, injectScript } = props.config
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <meta name='theme-color' content='#000000' />
        <title>Serverless Side Render1</title>
        {
          injectCss && injectCss.map(item => <link rel='stylesheet' href={item} key={item} />)
        }
      </head>
      <body>
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
