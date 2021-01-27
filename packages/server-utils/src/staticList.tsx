import { join } from 'path'
import * as React from 'react'
import { getCwd } from './cwd'
import { getPromisify } from './promisify'

let manifest: any = false
const getManiFest = async ({
  fePort, isDev
}: {
  fePort: number
  isDev: boolean
}) => {
  if (manifest) {
    return
  }
  const cwd = getCwd()
  if (isDev) {
    manifest = await getPromisify(`http://localhost:${fePort}/asset-manifest.json`)
  } else {
    manifest = require(join(cwd, './build/client/asset-manifest.json'))
  }
}
const getStaticList = async (isDev: boolean, fePort: number, staticPrefix: string, cssOrder: string[], jsOrder: string[]) => {
  await getManiFest({
    fePort,
    isDev
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
