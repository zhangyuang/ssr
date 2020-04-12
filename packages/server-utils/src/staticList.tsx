import { join } from 'path'
import * as React from 'react'
import { getCwd } from './cwd'

const getStaticList = (staticPrefix: string, funcName: string, cssOrder: string[], jsOrder: string[]) => {
  const cwd = getCwd()
  const manifest = require(join(cwd, `./build/${funcName}/client/asset-manifest.json`))
  const injectCss = cssOrder.map(css => `${staticPrefix}${manifest[css]}`).map(item => <link rel='stylesheet' key={item} href={item}/>)
  const injectScript = jsOrder.map(js => `${staticPrefix}${manifest[js]}`).map(item => <script key={item} src={item}/>)
  return {
    injectCss,
    injectScript
  }
}

export {
  getStaticList
}
