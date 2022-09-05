import { promises } from 'fs'
import { UserConfig, ISSRContext, IConfig } from 'ssr-types'

const readAsyncChunk = async (config: IConfig): Promise<Record<string, string>> => {
  try {
    const { dynamicFile } = config
    const str = (await promises.readFile(dynamicFile?.asyncChunkMap)).toString()
    return JSON.parse(str)
  } catch (error) {
    return {}
  }
}
const addAsyncChunk = async (webpackChunkName: string, config: IConfig, type: 'css'|'js') => {
  const arr = []
  const asyncChunkMap = await readAsyncChunk(config)
  for (const key in asyncChunkMap) {
    if (asyncChunkMap[key].includes(webpackChunkName) || asyncChunkMap[key].includes('client-entry')) {
      arr.push(`${key}.${type}`)
    }
  }
  return arr
}

export const nomalrizeOrder = (order: UserConfig['extraJsOrder'], ctx: ISSRContext): string[] => {
  if (!order) {
    return []
  }
  if (Array.isArray(order)) {
    return order
  } else {
    return order(ctx)
  }
}

export const getAsyncCssChunk = async (ctx: ISSRContext, webpackChunkName: string, config: IConfig): Promise<string[]> => {
  const { cssOrder, extraCssOrder } = config
  return cssOrder.concat([...nomalrizeOrder(extraCssOrder, ctx), ...await addAsyncChunk(webpackChunkName, config, 'css'), `${webpackChunkName}.css`])
}
export const getAsyncJsChunk = async (ctx: ISSRContext, webpackChunkName: string, config: IConfig): Promise<string[]> => {
  const { jsOrder, extraJsOrder } = config
  return jsOrder.concat([...nomalrizeOrder(extraJsOrder, ctx)])
  // fix for sourcemap
  // return jsOrder.concat([...nomalrizeOrder(extraJsOrder, ctx), ...await addAsyncChunk(webpackChunkName, config, 'js'), `${webpackChunkName}.js`])
}

export const getUserScriptVue = (script: UserConfig['customeHeadScript'], ctx: ISSRContext, h: any, type: 'vue3'| 'vue') => {
  if (!script) {
    return []
  }
  return (Array.isArray(script) ? script : script(ctx)).map(item => h('script', Object.assign({}, item.describe, type === 'vue' ? {
    domProps: {
      innerHTML: item.content
    }
  } : {
    innerHTML: item.content
  }
  )))
}
