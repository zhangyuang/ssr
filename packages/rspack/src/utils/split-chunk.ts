import type { OptimizationSplitChunksOptions, NormalModule, Compiler } from '@rspack/core'
import { getCwd, cryptoAsyncChunkName, sortByAscii } from 'ssr-common-utils'
import { resolve } from 'path'
import { writeFileSync } from 'fs'

const dependenciesMap: Record<string, string[]> = {}
const generateMap: Record<string, string> = {}
const chunkNameRe = /chunkName=(.*)/
const asyncChunkMap: Record<string, string[]> = {}

export const getSplitChunksOptions = () => {
	return {
		minSize: 0,
		maxAsyncRequests: 5,
		maxInitialRequests: 3,
		chunks: 'all',
		name(_, chunks, _cacheGroupKey) {
			return cryptoAsyncChunkName(chunks, asyncChunkMap)
		},
		cacheGroups: getWebpackSplitCache()
	} as OptimizationSplitChunksOptions
}

export class splitChunkPlugin {
	apply(compiler: Compiler) {
		compiler.hooks.compilation.tap('splitChunkPlugin', (compilation) => {
			const moduleGraph = compilation.moduleGraph
			const modules = new Set<NormalModule>()
			compilation.hooks.succeedModule.tap('splitChunkPlugin', (module) => {
				// keep the order of modules
				modules.add(module as NormalModule)
			})
			compilation.hooks.afterOptimizeModules.tap('splitChunkPlugin', () => {
				for (const module of modules) {
					const { path: modulePath, query } = module.resourceResolveData!
					if (!modulePath) {
						continue
					}
					const incomings = moduleGraph.getIncomingConnections(module)
					const chunkNames = query?.includes('chunkName')
						? [chunkNameRe.exec(query ?? '')?.[1]]
						: incomings
								.map((c) => {
									const { query, path } = (c.originModule as NormalModule)?.resourceResolveData ?? {}
									return query?.includes('chunkName') ? chunkNameRe.exec(query ?? '')?.[1] : dependenciesMap[path ?? '']
								})
								.flat()
								.filter(Boolean)

					dependenciesMap[modulePath] = dependenciesMap[modulePath]
						? dependenciesMap[modulePath].concat(chunkNames as string[])
						: (chunkNames as string[])
					dependenciesMap[modulePath] = Array.from(new Set(dependenciesMap[modulePath]))
				}
				for (const fileName in dependenciesMap) {
					let chunkNames = dependenciesMap[fileName]
					if (fileName.includes('node_modules')) {
						chunkNames.push('vendor')
					}
					chunkNames = chunkNames.sort(sortByAscii)
					if (chunkNames.includes('Page')) {
						chunkNames = chunkNames.includes('vendor') ? ['Page', 'vendor'] : ['Page']
					}
					dependenciesMap[fileName] = chunkNames.length === 0 ? ['Page'] : chunkNames
					generateMap[fileName] = dependenciesMap[fileName].join('~')
					asyncChunkMap[generateMap[fileName]] = chunkNames
				}
				writeFileSync(resolve(getCwd(), `./build/generateMap.json`), JSON.stringify(generateMap, null, 2))
				writeFileSync(resolve(getCwd(), `./build/dependenciesMap.json`), JSON.stringify(dependenciesMap, null, 2))
				writeFileSync(resolve(getCwd(), `./build/asyncChunkMap.json`), JSON.stringify(asyncChunkMap, null, 2))
			})
		})
	}
}

const getWebpackSplitCache = (): OptimizationSplitChunksOptions['cacheGroups'] => {
	return {
		dynamicChunks: {
			test: (module) => {
				const normalModule = module as NormalModule
				const moduleName = normalModule.resourceResolveData?.path
				return !!generateMap[moduleName ?? '']
			},
			name: (module) => {
				const normalModule = module as NormalModule
				return generateMap[normalModule.resourceResolveData?.path ?? ''] ?? 'Page'
			}
		}
	} as OptimizationSplitChunksOptions['cacheGroups']
}
