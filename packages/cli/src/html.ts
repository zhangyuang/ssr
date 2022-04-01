// @ts-nocheck
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
  jsHeaderManifest
</head>
<body>
  <div id="app"></div>
  jsFooterManifest
  jsManifest
</body>
</html>
`

export const generateHtml = async (argv: Argv) => {
  if (process.env.SPA) {
    console.log('当前构建开启 SPA 模式，将生成 html 文件用于独立部署，默认关闭 dynamic 选项')
    // spa 模式下生成 html 文件直接部署
    const { loadConfig, getCwd, judgeFramework, loadModuleFromFramework } = await import('ssr-server-utils')
    const { jsOrder, cssOrder, customeHeadScript, customeFooterScript } = loadConfig()
    const framewor = judgeFramework()
    let jsHeaderManifest = ''
    let jsFooterManifest = ''
    if (framewor === 'ssr-plugin-vue3') {
      const { h } = await import(loadModuleFromFramework('vue'))
      const { renderToString } = await import ('@vue/server-renderer')
      const flag = customeHeadScript ? 'header' : 'footer'
      const arr = customeHeadScript ?? customeFooterScript
      const scriptArr = (Array.isArray(arr) ? arr : arr({}))?.map((item) => h(
        'script',
        Object.assign({}, item.describe, {
          innerHTML: item.content
        })
      ))
      if (flag === 'header') {
        jsHeaderManifest = (await renderToString(h('div', {}, scriptArr))).replace('<div>', '').replace('</div>', '')
      } else {
        jsFooterManifest = (await renderToString(h('div', {}, scriptArr))).replace('<div>', '').replace('</div>', '')
      }
    }

    const cwd = getCwd()
    const manifest = require(join(cwd, './build/client/asset-manifest.json'))
    let jsManifest = ''
    jsOrder.forEach(item => {
      if (manifest[item]) {
        jsManifest += `<script src=${manifest[item]}></script>`
      }
    })
    let cssManifest = ''
    cssOrder.forEach(item => {
      if (manifest[item]) {
        cssManifest += `<link rel='stylesheet' href=${manifest[item]} />`
      }
    })
    const generateHtmlStr = htmlStr.replace('cssInject', cssManifest).replace('jsManifest', jsManifest).replace('jsHeaderManifest', jsHeaderManifest).replace('jsFooterManifest', jsFooterManifest)
    await promises.writeFile(join(cwd, './build/index.html'), generateHtmlStr)
  }
}
