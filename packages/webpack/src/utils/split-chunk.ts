import { loadConfig, getCwd, cryptoAsyncChunkName } from 'ssr-common-utils'
import { resolve } from 'path'
import type { OptimizationSplitChunksOptions, NormalModule } from '@rspack/core'

export const getSplitChunksOptions = (asyncChunkMap: {
	val: Record<string, string[]>
}) => {
	const { optimize } = loadConfig()
	return {
		minSize: optimize ? 0 : 2000,
		maxAsyncRequests: 5,
		maxInitialRequests: 3,
		chunks: 'all',
		name(module, chunks, _cacheGroupKey) {
			return cryptoAsyncChunkName(chunks, asyncChunkMap.val)
		},
		cacheGroups: getWebpackSplitCache()
	} as OptimizationSplitChunksOptions
}

const getWebpackSplitCache = (): OptimizationSplitChunksOptions['cacheGroups'] => {
	const { optimize, chunkName: defaultEntryChunkName } = loadConfig()
	if (optimize) {
		const generateMap: Record<string, string> = require(resolve(getCwd(), './build/generateMap.json'))
		const cacheGroups: OptimizationSplitChunksOptions['cacheGroups'] = {
			dynamicChunks: {
				test: (module, _) => {
					const normalModule = module as NormalModule
					for (const file in generateMap) {
						const chunkName = generateMap[file]
						if (!normalModule.resource) {
							return false
						}
						if (file.split('?')[0] === normalModule.resource.split('?')[0]) {
							return chunkName !== defaultEntryChunkName
						}
					}
					return false
				},
				name: (module, _) => {
					const normalModule = module as NormalModule
					for (const file in generateMap) {
						const chunkName = generateMap[file]
						if (file.split('?')[0] === normalModule.resource.split('?')[0]) {
							return chunkName
						}
					}
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
