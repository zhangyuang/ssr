import { promises } from 'fs'
import { join } from 'path'

export const generateHtml = async () => {
  if (!process.env.SPA) return
  // spa 模式下生成 html 文件直接部署
  const {
    loadConfig, getCwd, judgeFramework, loadModuleFromFramework, logGreen,
    getAsyncJsChunk, logWarning, getAsyncCssChunk, splitPageInfo, getScriptArr, getStaticConfig
  } = await import('ssr-common-utils')
  logGreen('Generating html file...')
  const cwd = getCwd()
  const {
    customeHeadScript, customeFooterScript, hashRouter, htmlTemplate, prefix,
    clientPrefix, isVite, cssOrderPriority, jsOrderPriority, rootId
  } = loadConfig()
  const staticConfig = getStaticConfig()

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
  const ssrDevInfo = { rootId }
  const combine = [
    {
      arr: getScriptArr(header, mockCtx).concat(getScriptArr(staticConfig.customeHeadScript ?? [], mockCtx)),
      flag: 'header'
    }, {
      arr: getScriptArr(footer, mockCtx).concat(getScriptArr(staticConfig.customeFooterScript ?? [], mockCtx)),
      flag: 'footer'
    }]

  const content = splitPageInfo({
    'window.__USE_SSR__': false,
    'window.__USE_VITE__': isVite,
    'window.prefix': `"${prefix}"`,
    'window.clientPrefix': `"${clientPrefix ?? ''}"`,
    'window.ssrDevInfo': JSON.stringify(ssrDevInfo)
  })
  combine[0].arr = combine[0].arr.concat([
    {
      content
    }
  ])
  if (framework === 'ssr-plugin-vue3') {
    const { h, Fragment } = await import(loadModuleFromFramework('vue'))
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
        jsHeaderManifest += (await renderToString(h(Fragment, {}, scriptArr)))
      } else {
        jsFooterManifest += (await renderToString(h(Fragment, {}, scriptArr)))
      }
    }
  } if (framework === 'ssr-plugin-vue') {
    const { h } = await import(loadModuleFromFramework('vue'))
    const Vue = await import(loadModuleFromFramework('vue'))
    const { createRenderer } = await import('vue-server-renderer')
    const { renderToString } = createRenderer()
    for (const item of combine) {
      const { arr, flag } = item
      const app = new Vue({
        render: () => {
          const scriptArr = arr.map((item) => h(
            'script',
            Object.assign({}, item.describe ?? {}, {
              domProps: {
                innerHTML: item.content
              }
            })
          ))
          return scriptArr
        }
      })
      const scriptStr = await renderToString(app)
      if (flag === 'header') {
        jsHeaderManifest += scriptStr.replace('data-server-rendered="true"', '')
      } else {
        jsFooterManifest += scriptStr.replace('data-server-rendered="true"', '')
      }
    }
  }
  if (framework === 'ssr-plugin-react' || framework === 'ssr-plugin-react18') {
    const { createElement: h, Fragment } = await import (loadModuleFromFramework('react'))
    const { renderToString } = await import(loadModuleFromFramework('react-dom/server'))
    for (const item of combine) {
      const { arr, flag } = item
      const scriptArr = arr.map((item) => h(
        'script',
        Object.assign({}, item.describe ?? {}, {
          dangerouslySetInnerHTML: {
            __html: item.content
          }
        })
      ))
      if (flag === 'header') {
        jsHeaderManifest += (await renderToString(h(Fragment, {}, scriptArr))).replace('data-reactroot=""', '')
      } else {
        jsFooterManifest += (await renderToString(h(Fragment, {}, scriptArr))).replace('data-reactroot=""', '')
      }
    }
  }

  const manifest: Record<string, string> = require(join(cwd, './build/client/asset-manifest.json'))

  const jsOrder = await getAsyncJsChunk(mockCtx, '', loadConfig())
  const jsManifest: string[] = jsOrder.map(item => manifest[item]).filter(Boolean).map(item => `<script src="${item}" ${isVite ? 'type="module"' : ''}></script>`)

  const cssOrder = await getAsyncCssChunk(mockCtx, '', loadConfig())
  const cssManifest: string[] = cssOrder.map(item => manifest[item]).filter(Boolean).map(item => `<link rel='stylesheet' href="${item}" />`)

  if (typeof cssOrderPriority === 'function' || typeof jsOrderPriority === 'function') {
    logWarning('Notices: orderPriority cannot get chunkName in spa html build, you will get chunkName as undefined')
  }

  const generateHtmlStr = htmlStr.replace('cssInject', cssManifest.join('')).replace('jsManifest', jsManifest.join('')).replace('jsHeaderManifest', jsHeaderManifest)
    .replace('jsFooterManifest', jsFooterManifest)
    .replace('hashRouterScript', hashRouterScript)
  await promises.writeFile(join(cwd, './build/index.html'), generateHtmlStr)

}
