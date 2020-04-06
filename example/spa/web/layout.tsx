
import * as React from 'react'
import serialize from 'serialize-javascript'

const Layout = (props) => {
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
        <div id='app'>{ props.children }</div>
        {/* {
          serverData && <script dangerouslySetInnerHTML={{
            __html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(serverData)}`
          }} />
        }
        <div dangerouslySetInnerHTML={{
          __html: injectScript && injectScript.join('')
        }} /> */}
      </body>
    </html>
  )
}

export default Layout
