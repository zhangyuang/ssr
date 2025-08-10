import type { OptimizationSplitChunksOptions, NormalModule, ModuleGraph, Compiler } from '@rspack/core'
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

const recordInfo = (module: NormalModule, parentModuleName: string | null, moduleGraph: ModuleGraph, visited: string[]) => {
	const modulePath = module.resourceResolveData?.path!
	if (!modulePath || visited.includes(modulePath)) {
		return
	}
	visited.push(modulePath)
	if (!dependenciesMap[modulePath]) {
		dependenciesMap[modulePath] = []
	}
	if (parentModuleName && dependenciesMap[parentModuleName]) {
		dependenciesMap[modulePath] = [...new Set([...dependenciesMap[modulePath], ...dependenciesMap[parentModuleName]])]
	}

	const conns = moduleGraph.getOutgoingConnections(module)
	for (const c of conns) {
		const child = c.module as NormalModule
		const childPath = child?.resourceResolveData?.path
		if (!childPath || childPath === modulePath) {
			continue
		}
		recordInfo(child, modulePath, moduleGraph, visited)
	}
}

export class splitChunkPlugin {
	apply(compiler: Compiler) {
		compiler.hooks.compilation.tap('splitChunkPlugin', (compilation) => {
			const moduleGraph = compilation.moduleGraph
			compilation.hooks.afterOptimizeModules.tap('splitChunkPlugin', (modules) => {
				const normalModules = Array.from(modules) as NormalModule[]
				for (const module of normalModules) {
					if (!module.resourceResolveData?.query?.includes('chunkName')) {
						continue
					}
					const chunkName = chunkNameRe.exec(module.resourceResolveData?.query)?.[1]
					const visited: string[] = []
					dependenciesMap[module.resourceResolveData?.path!] = [chunkName!]
					recordInfo(module, module.resourceResolveData?.path ?? null, moduleGraph, visited)
				}
				for (const fileName in dependenciesMap) {
					let chunkNames = dependenciesMap[fileName]
					if (fileName.includes('node_modules')) {
						chunkNames.push('vendor')
					}
					chunkNames = Array.from(new Set(chunkNames)).sort(sortByAscii)
					if (chunkNames.includes('Page')) {
						chunkNames = chunkNames.includes('vendor') ? ['Page', 'vendor'] : ['Page']
					}
					dependenciesMap[fileName] = chunkNames
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
				const moduleName = normalModule.resourceResolveData?.path?.split('?')?.[0]
				return !!generateMap[moduleName ?? '']
			},
			name: (module) => {
				const normalModule = module as NormalModule
				return generateMap[normalModule.resourceResolveData?.path ?? ''] ?? 'Page'
			}
		}
	} as OptimizationSplitChunksOptions['cacheGroups']
}
