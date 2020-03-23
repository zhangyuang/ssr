
import React from 'react'
import Shell from 'shelljs'
import { resolve, join } from 'path'
import { renderToNodeStream } from 'react-dom/server'
const isDev = process.env.NODE_ENV === 'development'

const reactToStream = (Component: React.FunctionComponent, props: object) => {
  return renderToNodeStream(React.createElement(Component, props))
}
const renderLayout = async (ctx: any) => {
  const layoutPath = resolve(__dirname, '../dist/Layout.server.js')
  if (isDev) {
    Shell.rm('-rf', layoutPath)
    delete require.cache[layoutPath]
  }
  let Layout = require(layoutPath).default

  const props = ctx ? {
    layoutData: ctx
  } : {
    layoutData: {
      app: {
        config: config
      }
    }
  }

  const str = reactToStream(Layout, props)
  return str
}

export default renderLayout
