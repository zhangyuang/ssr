import type { OptimizationSplitChunksOptions, NormalModule } from '@rspack/core'
import { getCwd, cryptoAsyncChunkName, sortByAscii, vendorList, getPkgName } from 'ssr-common-utils'
import type Webpack from 'webpack'
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

const getModuleName = (module: NormalModule) => {
	return module.resource?.split('?')[0] || ''
}
const directChunkModules = [] as NormalModule[]

export class splitChunkPlugin {
	apply(compiler: Webpack.Compiler) {
		compiler.hooks.compilation.tap('splitChunkPlugin', (compilation) => {
			compilation.hooks.afterOptimizeModules.tap('splitChunkPlugin', (normalModules) => {
				for (const module of normalModules) {
					const normalModule = module as unknown as NormalModule
					const modulePath = getModuleName(normalModule)
					if (!modulePath) {
						continue
					}
					if (normalModule.resource?.includes('chunkName')) {
						directChunkModules.push(module as unknown as NormalModule)
					}
					if (normalModule.resource?.includes('client-entry')) {
						directChunkModules.push(module as unknown as NormalModule)
					}
				}

				for (const directChunkModule of directChunkModules) {
					const queue = [directChunkModule]
					const visited = new Set<string>()
					const moduleChunkName = chunkNameRe.exec(directChunkModule.resource ?? '')?.[1]! || 'Page'
					while (queue.length) {
						const currentModule = queue.shift()
						const modulePath = getModuleName(currentModule as unknown as NormalModule)
						if (!modulePath || modulePath.includes('css-loader')) {
							continue
						}
						dependenciesMap[modulePath] = dependenciesMap[modulePath]
							? dependenciesMap[modulePath].concat(moduleChunkName)
							: [moduleChunkName]
						const outgoings = currentModule!.dependencies ?? []
						for (const outgoing of outgoings) {
							//@ts-expect-error
							const modulePath = outgoing.module?.resource
							if (!modulePath) {
								continue
							}
							if (visited.has(modulePath)) {
								continue
							}
							visited.add(modulePath)
							//@ts-expect-error
							queue.push(outgoing.module as NormalModule)
						}
					}
				}
				for (const fileName in dependenciesMap) {
					let chunkNames = Array.from(new Set(dependenciesMap[fileName]))
					if (fileName.includes('node_modules')) {
						chunkNames.push('vendor')
					}
					const pkgName = getPkgName(fileName)
					if (vendorList.includes(pkgName)) {
						chunkNames = ['vendor']
					}
					chunkNames = chunkNames.sort(sortByAscii)
					if (chunkNames.includes('Page')) {
						chunkNames = chunkNames.includes('vendor') ? ['Page', 'vendor'] : ['Page']
					}
					dependenciesMap[fileName] = chunkNames
					generateMap[fileName] = dependenciesMap[fileName].join('~')
					asyncChunkMap[generateMap[fileName]] = chunkNames
					writeFileSync(resolve(getCwd(), `./build/generateMap.json`), JSON.stringify(generateMap, null, 2))
					writeFileSync(resolve(getCwd(), `./build/dependenciesMap.json`), JSON.stringify(dependenciesMap, null, 2))
					writeFileSync(resolve(getCwd(), `./build/asyncChunkMap.json`), JSON.stringify(asyncChunkMap, null, 2))
				}
			})
		})
	}
}
const getWebpackSplitCache = (): OptimizationSplitChunksOptions['cacheGroups'] => {
	return {
		dynamicChunks: {
			test: (module) => {
				const normalModule = module as NormalModule
				const moduleName = normalModule.resource?.split('?')?.[0]
				return !!generateMap[moduleName ?? '']
			},
			name: (module) => {
				const normalModule = module as NormalModule
				const moduleName = normalModule.resource?.split('?')?.[0]
				return generateMap[moduleName ?? ''] ?? 'Page'
			}
		}
	} as OptimizationSplitChunksOptions['cacheGroups']
}
