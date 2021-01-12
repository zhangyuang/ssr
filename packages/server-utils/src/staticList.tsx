import { join } from 'path'
import * as React from 'react'
import { getCwd } from './cwd'
import { getPromisify } from './promisify'

let manifest: any = false
const getManiFest = async ({
  port, isDev, funcName
}: {
  port: number
  isDev: boolean
  funcName: string
}) => {
  if (manifest) {
    return
  }
  const cwd = getCwd()
  if (isDev) {
    manifest = await getPromisify(`http://localhost:${port}/asset-manifest.json`)
  } else {
    manifest = require(join(cwd, `./build/${funcName}/client/asset-manifest.json`))
  }
}
const getStaticList = async (isDev: boolean, port: number, staticPrefix: string, funcName: string, cssOrder: string[], jsOrder: string[]) => {
  await getManiFest({
    port,
    isDev,
    funcName
  })

  const injectCss = cssOrder.map(css => `${staticPrefix}${manifest[css]}`)
    .map(item => <link rel='stylesheet' key={item} href={item} />)
  const injectScript = jsOrder.map(js => `${staticPrefix}${manifest[js]}`)
    .map(item => <script key={item} src={item} />)
  return {
    injectCss,
    injectScript
  }
}

export {
  getStaticList
}
