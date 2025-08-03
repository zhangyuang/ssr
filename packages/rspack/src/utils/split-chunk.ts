import { loadConfig, getCwd, cryptoAsyncChunkName } from 'ssr-common-utils'
import { resolve } from 'path'
import type { OptimizationSplitChunksOptions } from '@rspack/core'

export const getSplitChunksOptions = (asyncChunkMap: {
	val: Record<string, string[]>
}) => {
	const { optimize } = loadConfig()
	return {
		minSize: optimize ? 0 : 2000,
		maxAsyncRequests: 5,
		maxInitialRequests: 3,
		chunks: 'all',
		name(_, chunks, _cacheGroupKey) {
			return cryptoAsyncChunkName(chunks, asyncChunkMap.val)
		},
		cacheGroups: getWebpackSplitCache()
	} as OptimizationSplitChunksOptions
}

const getWebpackSplitCache = (): OptimizationSplitChunksOptions['cacheGroups'] => {
	const { optimize, chunkName } = loadConfig()
	if (optimize) {
		const generateMap: Record<string, string> = require(resolve(getCwd(), './build/generateMap.json'))
		const asyncChunkMap = require(resolve(getCwd(), './build/asyncChunkMap.json'))
		let maxPriority = Object.keys(asyncChunkMap).length + 1
		const splitPriorityMap: Record<string, number | undefined> = {
			'common-vendor': maxPriority + 2,
			'layout-app~vendor': maxPriority + 1,
			'layout-app': maxPriority + 1
		}
		// make priority consistent
		Object.keys(asyncChunkMap)
			.sort((a, b) => {
				const lenA = asyncChunkMap[a]
				const lenB = asyncChunkMap[b]
				if (lenA !== lenB) {
					return asyncChunkMap[b].length - asyncChunkMap[a].length
				} else {
					return a > b ? 1 : -1
				}
			})
			.forEach((chunkName) => {
				if (!splitPriorityMap[chunkName]) {
					splitPriorityMap[chunkName] = maxPriority - 1
				}
				maxPriority--
			})
		const webpackMap: Record<string, string[]> = {}
		for (const fileName in generateMap) {
			const chunkName = generateMap[fileName]
			if (!webpackMap[chunkName]) {
				webpackMap[chunkName] = []
			}
			webpackMap[chunkName].push(fileName)
		}
		delete webpackMap[chunkName]
		const cacheGroups: OptimizationSplitChunksOptions['cacheGroups'] = {}
		for (const chunkName in webpackMap) {
			const arr = webpackMap[chunkName]
			if (!cacheGroups[chunkName]) {
				cacheGroups[chunkName] = {
					name: chunkName,
					test: (module, _) => {
						if (chunkName === 'void' || !module.nameForCondition?.()) {
							return false
						}
						const nameForCondition = module.nameForCondition()
						return checkContains(arr, nameForCondition!)
					},
					priority: splitPriorityMap[chunkName] ?? 0
				}
			}
		}
		return cacheGroups
	} else {
		return {
			vendors: {
				test: (module) => {
					//@ts-ignore
					return !!(module.resource && /\.js$/.test(module.resource) && module.resource.match('node_modules'))
				},
				name: 'vendor'
			}
		} as OptimizationSplitChunksOptions['cacheGroups']
	}
}

const checkContains = (arr: string[], name: string) => {
	for (const val of arr) {
		if (val.includes(name)) {
			return true
		}
	}
	return false
}
