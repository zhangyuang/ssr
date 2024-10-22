import { promises } from 'fs'
import { isAbsolute, join } from 'path'
import { stringify } from 'qs'
import type { FastifyContext, IConfig, ISSRContext, ISSRNestContext, UserConfig } from 'ssr-types'

import { getCwd, stringifyDefine } from './cwd'

export const setHeader = (ctx: ISSRContext, serverFrameWork: string) => {
	if (serverFrameWork === 'ssr-plugin-midway') {
		ctx.response.type = 'text/html;charset=utf-8'
	} else if (serverFrameWork === 'ssr-plugin-nestjs') {
		if ((ctx as ISSRNestContext | FastifyContext).response.setHeader) {
			// for express
			if (!(ctx as ISSRNestContext).response.headersSent) {
				;(ctx as ISSRNestContext).response.setHeader('Content-type', 'text/html;charset=utf-8')
			}
		} else if (!(ctx as FastifyContext).response.raw.headersSent) {
			// for fastify
			;(ctx as FastifyContext).response.header('Content-type', 'text/html;charset=utf-8')
		}
	}
}

export const splitPageInfo = (info: Record<string, string | boolean | object>): string =>
	stringify(info, {
		encode: false,
		delimiter: ';'
	})

const readAsyncChunk = async (config: IConfig): Promise<Record<string, string>> => {
	try {
		const { dynamicFile } = config
		const str = (await promises.readFile(dynamicFile?.asyncChunkMap)).toString()
		return JSON.parse(str)
	} catch (_error) {
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

const envVarRegex = /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*$/

export const getDefineEnv = () => {
	const envObject: Record<string, string | undefined> = {}
	Object.keys(process.env).forEach((key) => {
		if (envVarRegex.test(key)) {
			envObject[`process.env.${key}`] = process.env[key]
		}
	})
	stringifyDefine(envObject)
	return envObject
}

export const getAsyncCssChunk = async (ctx: ISSRContext, webpackChunkName: string, config: IConfig): Promise<string[]> => {
	const { cssOrder, extraCssOrder, cssOrderPriority } = config
	const combineOrder = cssOrder.concat([...nomalrizeOrder(extraCssOrder, ctx), ...(await addAsyncChunk(webpackChunkName, config, 'css')), `${webpackChunkName}.css`])
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
	const combineOrder = jsOrder.concat([...nomalrizeOrder(extraJsOrder, ctx), ...(await addAsyncChunk(webpackChunkName, config, 'js'))])
	if (jsOrderPriority) {
		const priority = typeof jsOrderPriority === 'function' ? jsOrderPriority({ chunkName: webpackChunkName }) : jsOrderPriority
		combineOrder.sort((a, b) => {
			// 没有显示指定的路由优先级统一为 0
			return (priority[b] || 0) - (priority[a] || 0)
		})
	}
	return combineOrder
}

export const getUserScriptVue = (options: {
	script: UserConfig['customeHeadScript']
	ctx: ISSRContext
	position: 'header' | 'footer'
	staticConfig: UserConfig
}) => {
	const { script, ctx, position, staticConfig } = options
	const defaultScriptArr = getScriptArr(script, ctx)
	const staticScript = position === 'header' ? staticConfig.customeHeadScript : staticConfig.customeFooterScript
	const staticScriptArr = getScriptArr(staticScript, ctx)
	return defaultScriptArr.concat(staticScriptArr)
}

export const getScriptArr = (script: UserConfig['customeHeadScript'], ctx: ISSRContext) => {
	return Array.isArray(script) ? script : (script?.(ctx) ?? [])
}
const getInlineContent = async (order: string[], inline: 'all' | string[] | undefined, manifest: Record<string, string | undefined>, cwd: string) => {
	const { inlineOrder, injectOrder } =
		inline === 'all'
			? { inlineOrder: order, injectOrder: [] }
			: order.reduce(
					(acc, curr) => {
						if (inline?.includes(curr)) {
							acc.inlineOrder.push(curr)
						} else {
							acc.injectOrder.push(curr)
						}
						return acc
					},
					{ inlineOrder: [] as string[], injectOrder: [] as string[] }
				)

	const inlineContent = await Promise.all(
		inlineOrder
			.map((item) => manifest[item])
			.filter(Boolean)
			.map((item) => promises.readFile(isAbsolute(item!) && !item!.startsWith('/client') ? item! : join(cwd, './build', item!)))
	)

	return {
		inlineContent: inlineContent.map((item) => item.toString()),
		injectOrder
	}
}

interface GetInlineParams {
	dynamicCssOrder: string[]
	dynamicJsOrder: string[]
	manifest: Record<string, string | undefined>
	config: UserConfig
	type: 'vue3' | 'vue'
}
export const getInlineOrder = async ({ dynamicCssOrder, dynamicJsOrder, manifest, config }: GetInlineParams) => {
	const cwd = getCwd()
	const { inlineContent: inlineCssOrder, injectOrder: extraCssOrder } = await getInlineContent(dynamicCssOrder, config.cssInline, manifest, cwd)
	const { inlineContent: inlineJsOrder, injectOrder: extraJsOrder } = await getInlineContent(dynamicJsOrder, config.jsInline, manifest, cwd)

	return {
		inlineCssOrder,
		extraCssOrder,
		inlineJsOrder,
		extraJsOrder
	}
}
