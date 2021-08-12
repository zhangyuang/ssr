import { promises } from 'fs'
import { join } from 'path'
import { Argv } from 'ssr-types'

const htmlStr = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  cssInject
</head>
<body>
  <div id="app"></div>
  jsManifest
</body>
</html>
`

export const generateHtml = async (argv: Argv) => {
  if (process.env.SPA) {
    console.log('当前构建开启 SPA 模式，将生成 html 文件用于独立部署，默认关闭 dynamic 选项')
    // spa 模式下生成 html 文件直接部署
    const { loadConfig, getCwd } = await import('ssr-server-utils')
    const { jsOrder, cssOrder } = loadConfig()
    const cwd = getCwd()
    const manifest = require(join(cwd, './build/client/asset-manifest.json'))
    let jsManifest = ''
    // @ts-expect-error
    jsOrder.forEach(item => {
      jsManifest += `<script src=${manifest[item]}></script>`
    })
    // @ts-expect-error
    let cssManifest = ''
    cssOrder.forEach(item => {
      cssManifest += `<link rel='stylesheet' href=${manifest[item]} />`
    })
    const generateHtmlStr = htmlStr.replace('cssInject', cssManifest).replace('jsManifest', jsManifest)
    await promises.writeFile(join(cwd, './build/index.html'), generateHtmlStr)
  }
}
