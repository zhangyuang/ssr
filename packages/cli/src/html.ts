import { promises } from 'fs'
import { join } from 'path'

export const generateHtml = async () => {
  if (!process.env.SPA) return
  // spa 模式下生成 html 文件直接部署
  const { loadConfig, getCwd, judgeFramework, loadModuleFromFramework, logGreen, getAsyncJsChunk, logWarning, getAsyncCssChunk } = await import('ssr-common-utils')
  logGreen('Generating html file...')
  const { customeHeadScript, customeFooterScript, hashRouter, htmlTemplate, prefix, clientPrefix, isVite, cssOrderPriority, jsOrderPriority } = loadConfig()
  const htmlStr = htmlTemplate ?? `
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
    hashRouterScript
    jsFooterManifest
    jsManifest
  </body>
  </html>
  `
  const mockCtx = {} as any
  const framework = judgeFramework()
  let jsHeaderManifest = ''
  let jsFooterManifest = ''
  const hashRouterScript = hashRouter ? '<script>window.hashRouter=true</script>' : ''
  const header = customeHeadScript ?? []
  const footer = customeFooterScript ?? []
  const combine = [
    {
      arr: Array.isArray(header) ? header : header(mockCtx),
      flag: 'header'
    }, {
      arr: Array.isArray(footer) ? footer : footer(mockCtx),
      flag: 'footer'
    }]
  combine[0].arr = combine[0].arr.concat([
    {
      content: `window.__USE_SSR__=false;window.__USE_VITE__=${isVite}; window.prefix="${prefix}" ;${clientPrefix ? `window.clientPrefix="${clientPrefix}"` : ''}`
    }
  ])

  if (framework === 'ssr-plugin-vue3') {
    const { h } = await import(loadModuleFromFramework('vue'))
    const { renderToString } = await import('@vue/server-renderer')
    for (const item of combine) {
      const { arr, flag } = item
      const scriptArr = arr.map((item) => h(
        'script',
        Object.assign({}, item.describe ?? {}, {
          innerHTML: item.content
        })
      ))
      if (flag === 'header') {
        jsHeaderManifest = (await renderToString(h('div', {}, scriptArr))).replace('<div>', '').replace('</div>', '')
      } else {
        jsFooterManifest = (await renderToString(h('div', {}, scriptArr))).replace('<div>', '').replace('</div>', '')
      }
    }
  } if (framework === 'ssr-plugin-vue') {
    for (const item of combine) {
      const { arr, flag } = item
      // @ts-expect-error
      const scriptArr = arr.map((item) => `<script ${isVite ? 'type="module"' : ''} ${item.describe?.attrs ? `src="${item.describe.attrs.src}" type=text/javascript` : ''}>${item.content} </script>`)
      if (flag === 'header') {
        jsHeaderManifest = scriptArr.join('')
      } else {
        jsFooterManifest = scriptArr.join('')
      }
    }
  }

  const cwd = getCwd()
  const manifest: Record<string, string> = require(join(cwd, './build/client/asset-manifest.json'))
  let jsManifest: string[] = []
  const jsOrder = await getAsyncJsChunk(mockCtx, '', loadConfig())
  jsOrder.forEach(item => {
    if (manifest[item]) {
      jsManifest.push(item)
    }
  })
  jsManifest = jsManifest.map(item => `<script src="${manifest[item]}" ${isVite ? 'type="module"' : ''}></script>`)
  let cssManifest: string[] = []

  const cssOrder = await getAsyncCssChunk(mockCtx, '', loadConfig())
  // cssOrder 依赖运行时动态注入 page chunkname，故 spa 构建模式为了防止 css 闪烁，所有 css 统一全部放在头部加载
  for (const item in manifest) {
    if (item.endsWith('.css') && !cssOrder.includes(item)) {
      cssOrder.push(item)
    }
  }

  cssOrder.forEach(item => {
    if (manifest[item]) {
      cssManifest.push(item)
    }
  })
  cssManifest = cssManifest.map(item => `<link rel='stylesheet' href="${manifest[item]}" />`)

  if (typeof cssOrderPriority === 'function' || typeof jsOrderPriority === 'function') {
    logWarning('Notices: orderPriority cannot get chunkName in spa html build, you will get chunkName as undefined')
  }

  const generateHtmlStr = htmlStr.replace('cssInject', cssManifest.join('')).replace('jsManifest', jsManifest.join('')).replace('jsHeaderManifest', jsHeaderManifest)
    .replace('jsFooterManifest', jsFooterManifest)
    .replace('hashRouterScript', hashRouterScript)
  await promises.writeFile(join(cwd, './build/index.html'), generateHtmlStr)

}
