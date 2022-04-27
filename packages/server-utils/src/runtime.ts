import { promises } from 'fs'
import { resolve } from 'path'
import { UserConfig, ISSRContext } from 'ssr-types'
import { loadConfig } from './loadConfig'
import { getCwd } from './cwd'

const readAsyncChunk = async (): Promise<Record<string, string>> => {
  const cwd = getCwd()
  try {
    const str = (await promises.readFile(resolve(cwd, './build/asyncChunkMap.json'))).toString()
    return JSON.parse(str)
  } catch (error) {
    return {}
  }
}
const addAsyncChunk = async (webpackChunkName: string) => {
  const arr = []
  const asyncChunkMap = await readAsyncChunk()
  for (const key in asyncChunkMap) {
    if (asyncChunkMap[key].includes(webpackChunkName)) {
      arr.push(`${key}.css`)
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

export const getAsyncCssChunk = async (ctx: ISSRContext, webpackChunkName: string): Promise<string[]> => {
  const { dynamic, isVite, isDev, cssOrder, extraCssOrder } = loadConfig()
  let dynamicCssOrder = cssOrder.concat(nomalrizeOrder(extraCssOrder, ctx))
  if (dynamic) {
    dynamicCssOrder = cssOrder.concat([`${webpackChunkName}.css`])
    if (!isVite || (isVite && !isDev)) {
      // call it when webpack mode or vite prod mode
      dynamicCssOrder = dynamicCssOrder.concat(await addAsyncChunk(webpackChunkName))
    }
  }
  return dynamicCssOrder
}

export const getAsyncJsChunk = async (ctx: ISSRContext): Promise<string[]> => {
  const { jsOrder, extraJsOrder } = loadConfig()
  return jsOrder.concat(nomalrizeOrder(extraJsOrder, ctx))
}

export const getUserScriptVue = (script: UserConfig['customeHeadScript'], ctx: ISSRContext, h: any, type: 'vue3'| 'vue') => {
  if (!script) {
    return []
  }
  const { disableClientRender } = loadConfig()
  return (Array.isArray(script) ? script : script(ctx)).map(item => h('script', Object.assign({}, item.describe, type === 'vue' ? {
    domProps: {
      innerHTML: item.content
    }
  } : {
    innerHTML: item.content
  }
  ))).concat(disableClientRender ? [h('script', type === 'vue' ? {
    // for qiankun
    innerHTML: 'window.__disableClientRender__ = true'
  } : {
    domProps: {
      innerHTML: 'window.__disableClientRender__ = true'
    }
  })] : [])
}
