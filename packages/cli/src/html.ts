// @ts-nocheck
import { promises } from 'fs'
import { join } from 'path'

export const generateHtml = async () => {
  if (!process.env.SPA) return
  // spa 模式下生成 html 文件直接部署
  const { loadConfig, getCwd, judgeFramework, loadModuleFromFramework, logGreen, getAsyncJsChunk, cssOrderPriority } = await import('ssr-common-utils')
  logGreen('Generating html file...')
  const { customeHeadScript, customeFooterScript, hashRouter, htmlTemplate, prefix, clientPrefix, isVite, extraCssOrder } = loadConfig()
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

  const framework = judgeFramework()
  let jsHeaderManifest = ''
  let jsFooterManifest = ''
  const hashRouterScript = hashRouter ? '<script>window.hashRouter=true</script>' : ''
  const header = customeHeadScript ?? []
  const footer = customeFooterScript ?? []
  const combine = [
    {
      arr: Array.isArray(header) ? header : header({}),
      flag: 'header'
    }, {
      arr: Array.isArray(footer) ? footer : footer({}),
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
  let jsManifest = ''
  const jsOrder = await getAsyncJsChunk({}, '', loadConfig())
  jsOrder.forEach(item => {
    if (manifest[item]) {
      jsManifest += `<script src="${manifest[item]}" ${isVite ? 'type="module"' : ''}></script>`
    }
  })
  const cssManifest = []
  Object.values(manifest).reverse().forEach(item => {
    if (item.endsWith('chunk.css')) {
      cssManifest.push(`<link rel='stylesheet' href="${item}" />`)
    }
  });
  (extraCssOrder ?? []).forEach(item => {
    if (manifest?.[item].endsWith('.css')) {
      cssManifest.push(`<link rel='stylesheet' href="${item}" />`)
    }
  })
  if (cssOrderPriority) {
    const priority = typeof cssOrderPriority === 'function' ? cssOrderPriority({ webpackChunkName }) : cssOrderPriority
    cssManifest.sort((a, b) => {
      // 没有显示指定的路由优先级统一为 0
      return (priority[b] || 0) - (priority[a] || 0)
    })
  }
  const generateHtmlStr = htmlStr.replace('cssInject', cssManifest.join('')).replace('jsManifest', jsManifest).replace('jsHeaderManifest', jsHeaderManifest)
    .replace('jsFooterManifest', jsFooterManifest)
    .replace('hashRouterScript', hashRouterScript)
  await promises.writeFile(join(cwd, './build/index.html'), generateHtmlStr)

}
