import { promises } from 'fs'
import { join, isAbsolute } from 'path'
import type { UserConfig, ISSRContext, IConfig, ISSRNestContext, FastifyContext } from 'ssr-types'
import { getCwd, stringifyDefine } from './cwd'

export const setHeader = (ctx: ISSRContext, serverFrameWork: string) => {
  if (serverFrameWork === 'ssr-plugin-midway') {
    ctx.response.type = 'text/html;charset=utf-8'
  } else if (serverFrameWork === 'ssr-plugin-nestjs') {
    if ((ctx as ISSRNestContext | FastifyContext).response.setHeader) {
      (ctx as ISSRNestContext).response.setHeader('Content-type', 'text/html;charset=utf-8')
    } else {
      (ctx as FastifyContext).response.header('Content-type', 'text/html;charset=utf-8')
    }
  }
}

const readAsyncChunk = async (config: IConfig): Promise<Record<string, string>> => {
  try {
    const { dynamicFile } = config
    const str = (await promises.readFile(dynamicFile?.asyncChunkMap)).toString()
    return JSON.parse(str)
  } catch (error) {
    return {}
  }
}
const addAsyncChunk = async (webpackChunkName: string, config: IConfig, type: 'css' | 'js') => {
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
export const getDefineEnv = () => {
  const envObject: Record<string, string|undefined> = {}
  Object.keys(process.env).forEach(key => {
    if (!(key.includes('(') || key.includes(')'))) {
      envObject[`process.env.${key}`] = process.env[key]
    }
  })
  stringifyDefine(envObject)
  return envObject
}

export const getAsyncCssChunk = async (ctx: ISSRContext, webpackChunkName: string, config: IConfig): Promise<string[]> => {
  const { cssOrder, extraCssOrder, cssOrderPriority } = config
  const combineOrder = cssOrder.concat([...nomalrizeOrder(extraCssOrder, ctx), ...await addAsyncChunk(webpackChunkName, config, 'css'), `${webpackChunkName}.css`])
  if (cssOrderPriority) {
    const priority = typeof cssOrderPriority === 'function' ? cssOrderPriority({ chunkName: webpackChunkName }) : cssOrderPriority
    combineOrder.sort((a, b) => {
      // 没有显示指定的路由优先级统一为 0
      return (priority[b] || 0) - (priority[a] || 0)
    })
  }
  return combineOrder
}
export const getAsyncJsChunk = async (ctx: ISSRContext, webpackChunkName: string, config: IConfig): Promise<string[]> => {
  const { jsOrder, extraJsOrder, jsOrderPriority } = config
  const combineOrder = jsOrder.concat([...nomalrizeOrder(extraJsOrder, ctx), ...await addAsyncChunk(webpackChunkName, config, 'js')])
  if (jsOrderPriority) {
    const priority = typeof jsOrderPriority === 'function' ? jsOrderPriority({ chunkName: webpackChunkName }) : jsOrderPriority
    combineOrder.sort((a, b) => {
      // 没有显示指定的路由优先级统一为 0
      return (priority[b] || 0) - (priority[a] || 0)
    })
  }
  return combineOrder
}

export const getUserScriptVue = (script: UserConfig['customeHeadScript'], ctx: ISSRContext, h: any, type: 'vue3' | 'vue') => {
  if (!script) {
    return []
  }
  return (Array.isArray(script) ? script : script(ctx)).map(item => h(item.tagName ?? 'script', Object.assign({}, item.describe, type === 'vue' ? {
    domProps: {
      innerHTML: item.content
    }
  } : {
    innerHTML: item.content
  }
  )))
}

export const getInlineCss = async ({
  dynamicCssOrder,
  manifest,
  h,
  config,
  type
}: {
  dynamicCssOrder: string[]
  manifest: Record<string, string | undefined>
  h: any
  config: UserConfig
  type: 'vue3' | 'vue'
}) => {
  const { cssInline, isDev } = config
  if (isDev) return [[], dynamicCssOrder]
  const cwd = getCwd()
  const cssOrder = cssInline === 'all' ? dynamicCssOrder : dynamicCssOrder.filter(item => cssInline?.includes(item))
  const extraInjectCssOrder = cssInline === 'all' ? [] : dynamicCssOrder.filter(item => !cssInline?.includes(item))
  // eslint-disable-next-line
  const inlineCssContent = (await Promise.all(cssOrder.map(css => manifest[css]).filter(Boolean).map(css =>
    promises.readFile(isAbsolute(css!) ? css! : join(cwd, './build', css!)).catch(_ => '')
  ))).map(item => item.toString())

  return [inlineCssContent.map(item => h('style', type === 'vue' ? {
    domProps: {
      innerHTML: item
    }
  } : {
    innerHTML: item
  })),
  extraInjectCssOrder
  ]
}
