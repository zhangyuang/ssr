import { join } from 'path'
import * as React from 'react'
import { getCwd } from './cwd'

const getStaticList = (isDev: boolean, devManifest: any, staticPrefix: string, funcName: string, cssOrder: string[], jsOrder: string[]) => {

  const cwd = getCwd()
  const manifest = isDev ? devManifest : require(join(cwd, `./build/${funcName}/client/asset-manifest.json`))
  const injectCss = cssOrder.map(css => `${staticPrefix}${isDev ? '' : `/build/${funcName}/client`}${manifest[css]}`).map(item => <link rel='stylesheet' key={item} href={item}/>)
  const injectScript = jsOrder.map(js => `${staticPrefix}${isDev ? '' : `/build/${funcName}/client`}${manifest[js]}`).map(item => <script key={item} src={item}/>)
  return {
    injectCss,
    injectScript
  }
}

export {
  getStaticList
}
