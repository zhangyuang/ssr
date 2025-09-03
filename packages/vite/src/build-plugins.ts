import { promises, writeFileSync } from 'fs'
import { resolve } from 'path'
import { mkdir } from 'shelljs'
import type { Plugin, UserConfig } from 'vite'
import type { OutputOptions, PreRenderedChunk, LoadResult } from 'rolldown'
import { getBuildConfig, addDefaultAlias, getPkgName, vendorList } from 'ssr-common-utils'
import {
	accessFile,
	getCwd,
	isReact18,
	accessFileSync,
	loadConfig,
	getOutputPublicPath,
	defaultExternal,
	judgeFramework,
	sortByAscii
} from 'ssr-common-utils'

const hasReactIs = accessFileSync(resolve(getCwd(), './node_modules/react-is'))
const framework = judgeFramework()
const isReact = framework === 'ssr-plugin-react'
const extraInclude = ['']
	.concat(
		isReact
			? [
					'react',
					'ssr-deepclone',
					'valtio',
					isReact18() ? 'react-dom/client' : 'react-dom',
					'react-router',
					'react-router-dom',
					hasReactIs ? 'react-is' : ''
				]
			: []
	)
	.filter(Boolean)
const extraExclude = ['ssr-hoc-react', 'ssr-common-utils']
const chunkNameRe = /chunkName=(.*)/
const imageRegExp = /\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/
const fontRegExp = /\.(eot|woff|woff2|ttf)(\?.*)?$/
const cwd = getCwd()
const dependenciesMap: Record<string, string[]> = {}
const asyncChunkMap: Record<string, string[]> = {}
const generateMap: Record<string, string> = {}

const getModuleName = (id: string) => {
	return id.split('?')[0]
}
const moduleIds = new Set<string>()
const directChunkModules: string[] = []

const asyncOptimizeChunkPlugin = (): Plugin => {
	return {
		name: 'asyncOptimizeChunkPlugin',
		moduleParsed(this, info) {
			const { id } = info
			// keep the order of modules
			moduleIds.add(id)
			if (id.includes('chunkName') || id.includes('client-entry')) {
				directChunkModules.push(id)
			}
		},

		async buildEnd(this, err) {
			// Process direct chunk modules using BFS traversal like rspack
			for (const directChunkModule of directChunkModules) {
				const queue = [directChunkModule]
				const visited = new Set<string>()
				const moduleChunkName = chunkNameRe.exec(directChunkModule)?.[1] || 'Page'

				while (queue.length > 0) {
					const currentModuleId = queue.shift()!
					const currentModuleName = getModuleName(currentModuleId)

					// Update dependencies map for current module
					dependenciesMap[currentModuleName] = dependenciesMap[currentModuleName]
						? dependenciesMap[currentModuleName].concat(moduleChunkName)
						: [moduleChunkName]

					const moduleInfo = this.getModuleInfo(currentModuleId)
					if (moduleInfo?.importedIds) {
						for (const importedId of moduleInfo.importedIds) {
							const importedModuleName = getModuleName(importedId)
							if (!visited.has(importedModuleName)) {
								visited.add(importedModuleName)
								queue.push(importedId)
							}
						}
					}
				}
			}

			// Post-process dependencies like rspack
			for (const fileName in dependenciesMap) {
				let chunkNames = Array.from(new Set(dependenciesMap[fileName]))
				if (fileName.includes('node_modules')) {
					chunkNames.push('vendor')
				}
				const pkgName = getPkgName(fileName)
				if (
					vendorList.includes(pkgName) ||
					fileName.includes('rollupPluginBabelHelpers.js') ||
					fileName.includes('plugin-vue:export-helper')
				) {
					chunkNames = ['vendor']
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
		}
	}
}

const manifestPlugin = (): Plugin => {
	const { getOutput } = loadConfig()
	const { clientOutPut } = getOutput()
	return {
		name: 'manifestPlugin',
		async generateBundle(_, bundles) {
			const manifest: Record<string, string> = {}
			for (const bundle in bundles) {
				const val = bundle
				const arr = bundle.split('/')[1].split('.')
				arr.splice(1, 2)
				manifest[arr.join('.')] = `${getOutputPublicPath()}${val}`
			}
			if (!(await accessFile(resolve(clientOutPut)))) {
				mkdir('-p', resolve(clientOutPut))
			}
			manifest['vite'] = '1'
			await promises.writeFile(resolve(clientOutPut, './asset-manifest.json'), JSON.stringify(manifest, null, 2))
		}
	}
}

const rollupOutputOptions: () => OutputOptions = () => {
	const buildConfig = getBuildConfig()
	return {
		entryFileNames: (_chunkInfo: PreRenderedChunk) => {
			return buildConfig.viteEntryChunk
		},
		chunkFileNames: buildConfig.jsBuldConfig.chunkFileName,
		assetFileNames: (chunkInfo) => {
			const { originalFileNames } = chunkInfo
			const name = originalFileNames[0]
			if (name && (imageRegExp.test(name) || fontRegExp.test(name))) {
				return buildConfig.viteImageChunk
			}
			return buildConfig.viteAssetChunk
		},
		manualChunks: (id: string) => {
			const moduleName = getModuleName(id)
			return generateMap[moduleName] ?? 'Page'
		}
	}
}

const commonConfig = (_env: 'server' | 'client'): UserConfig => {
	const { whiteList, alias, css, viteConfig, hmr, isDev } = loadConfig()
	const framework = judgeFramework()
	const isProdBuildingModeAndIsClient = _env === 'client' && framework === 'ssr-plugin-react' && !isDev
	const lessOptions = css?.().loaderOptions?.less?.lessOptions
		? css?.().loaderOptions?.less?.lessOptions
		: css?.().loaderOptions?.less
	return {
		root: cwd,
		mode: process.env.VITEMODE ?? 'development',
		server: {
			middlewareMode: true,
			hmr,
			...viteConfig?.().common?.server
		},
		optimizeDeps: {
			...viteConfig?.().common?.otherConfig?.optimizeDeps,
			include: extraInclude.concat(...(viteConfig?.().common?.otherConfig?.optimizeDeps?.include ?? [])),
			exclude: extraExclude.concat(...(viteConfig?.().common?.otherConfig?.optimizeDeps?.exclude ?? []))
		},
		appType: 'custom',
		css: {
			postcss: css?.().loaderOptions?.postcss ?? {},
			preprocessorOptions: {
				less: {
					javascriptEnabled: true,
					...lessOptions
				},
				scss: css?.().loaderOptions?.scss ?? {}
			}
		},
		ssr: {
			external: defaultExternal.concat(viteConfig?.()?.server?.externals ?? []),
			noExternal: whiteList
		},
		resolve: {
			alias: {
				...alias,
				...(isProdBuildingModeAndIsClient ? addDefaultAlias({}) : {})
			},
			extensions: ['.mjs', '.ts', '.jsx', '.tsx', '.json', '.vue', '.js']
		}
	}
}

interface ResolveOptions {
	[moduleId: string]: LoadResult | ((id: string, opts?: { ssr?: boolean }) => LoadResult)
}

export function ssrResolvePlugin(options: ResolveOptions): Plugin[] {
	return [
		{
			name: 'ssr-vite-plugin-resolve:resolveId',
			enforce: 'pre',
			resolveId(source) {
				// continue
			}
		}
	]
}
export { manifestPlugin, rollupOutputOptions, commonConfig, asyncOptimizeChunkPlugin }
