import { promises } from 'fs'
import { isAbsolute, resolve } from 'path'
import { parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string'
import { mkdir } from 'shelljs'
import type { Plugin, UserConfig, LogType } from 'vite'
import type { OutputOptions, PluginContext, PreRenderedChunk, LoadResult } from 'rolldown'
import { getBuildConfig, addDefaultAlias } from 'ssr-common-utils'
import { getDependencies, getPkgName, accessFile, cryptoAsyncChunkName, getCwd, isReact18, accessFileSync, ssrDebug, loadConfig, logErr, getOutputPublicPath, defaultExternal, judgeFramework } from 'ssr-common-utils'

const hasReactIs = accessFileSync(resolve(getCwd(), './node_modules/react-is'))
const framework = judgeFramework()
const isReact = framework === 'ssr-plugin-react'
const extraInclude = [''].concat(isReact ? ['react', 'ssr-deepclone', 'valtio', isReact18() ? 'react-dom/client' : 'react-dom', 'react-router', 'react-router-dom', hasReactIs ? 'react-is' : ''] : []).filter(Boolean)
const extraExclude = ['ssr-hoc-react', 'ssr-common-utils']
const webpackCommentRegExp = /webpackChunkName:\s?"(.*)?"\s?\*/
const chunkNameRe = /chunkName=(.*)/
const imageRegExp = /\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/
const fontRegExp = /\.(eot|woff|woff2|ttf)(\?.*)?$/
const cwd = getCwd()
const dependenciesMap: Record<string, string[]> = {}
const asyncChunkMapJSON: Record<string, string[]> = {}
const generateMap: Record<string, string> = {}
const vendorList = [
	'vue',
	'vuex',
	'vue-demi',
	'vue-router',
	'react',
	'react-router',
	'react-router-dom',
	'react-dom',
	'@vue',
	'ssr-hoc-react',
	'ssr-client-utils',
	'ssr-common-utils',
	'pinia',
	'@babel/runtime',
	'ssr-plugin-vue3',
	'ssr-plugin-vue',
	'ssr-plugin-react',
	'react/jsx-runtime',
	'path-to-regexp',
	'plugin-vue:export-helper',
	'@vue/devtools-api',
	'ssr-hoc-vue3',
	'ssr-hoc-vue',
	'vite/preload-helper'
]

const chunkNamePlugin = function (): Plugin {
	return {
		name: 'chunkNamePlugin',
		transform(source, id) {
			if (id.includes('ssr-declare-routes') || id.includes('ssr-manual-routes')) {
				let str = new MagicString(source)
				const imports = parseImports(source)[0]
				for (let index = 0; index < imports.length; index++) {
					const { s: start, e: end, se: statementEnd } = imports[index]
					const rawUrl = source.slice(start, end)
					const chunkName = webpackCommentRegExp.exec(rawUrl)?.[1]
					if (rawUrl.includes('layout') || rawUrl.includes('App') || rawUrl.includes('store')) {
						str = str.appendRight(statementEnd - 1, '?chunkName=Page')
					} else if (chunkName) {
						str = str.appendRight(statementEnd - (rawUrl.includes('\n') ? 2 : 1), `?chunkName=${chunkName}`)
					} else {
						str = str.appendRight(statementEnd - 1, '?chunkName=Page')
					}
				}
				return {
					code: str.toString()
				}
			}
		}
	}
}

const thirdPartyModulesMap: Record<string, string> = {}

const recordInfo = (id: string, chunkName: string | null, defaultChunkName: string | null, parentId: string) => {
	const sign = id.includes('node_modules') ? getPkgName(id) : id
	if (id.includes('node_modules')) {
		thirdPartyModulesMap[sign] = parentId
	}
	if (!dependenciesMap[sign]) {
		dependenciesMap[sign] = defaultChunkName ? [defaultChunkName] : []
	}
	chunkName && dependenciesMap[sign].push(chunkName)
	if (id.includes('node_modules')) {
		dependenciesMap[sign].push('vendor')
	}
	if (parentId) {
		dependenciesMap[sign] = dependenciesMap[sign].concat(dependenciesMap[parentId])
	}
	dependenciesMap[sign] = Array.from(new Set(dependenciesMap[sign].filter(Boolean))).sort(sortByAscii)
}

const sortByAscii = (a: string, b: string) => {
	for (let i = 0; i < Math.min(a.length, b.length); i++) {
		if (a.charCodeAt(i) !== b.charCodeAt(i)) {
			return a.charCodeAt(i) - b.charCodeAt(i)
		}
	}
	return a.length - b.length
}

const moduleIds: string[] = []

const findChildren = (id: string, getModuleInfo: PluginContext['getModuleInfo']) => {
	const queue = [id]
	while (queue.length > 0) {
		const id = queue.shift()
		if (id?.includes('node_modules')) {
			continue
		}
		const { importedIds = [], dynamicallyImportedIds = [] } = getModuleInfo(id!) ?? {}
		for (const importerId of importedIds) {
			recordInfo(importerId, null, null, id!)
			queue.push(importerId)
		}
		for (const dyImporterId of dynamicallyImportedIds) {
			recordInfo(dyImporterId, null, 'dynamic', id!)
			queue.push(dyImporterId)
		}
	}
}

const asyncOptimizeChunkPlugin = (): Plugin => {
	return {
		name: 'asyncOptimizeChunkPlugin',
		moduleParsed(this, info) {
			const { id } = info
			if (id.includes('chunkName')) {
				const { importedIds, dynamicallyImportedIds } = info
				const chunkName = id.includes('client-entry') ? 'client-entry' : chunkNameRe.exec(id)![1]
				for (const importerId of importedIds) {
					recordInfo(importerId, chunkName, null, id)
				}
				for (const dyImporterId of dynamicallyImportedIds) {
					recordInfo(dyImporterId, chunkName, 'dynamic', id)
				}
			}
		},
		transform(this, _code, id) {
			moduleIds.push(id)
			ssrDebug(`build optimize process file ${id}`)
		},
		async buildEnd(this, err) {
			// after the first layer file can be located in which chunkName
			// confirm all children dependence belong to which chunkName
			Object.keys(dependenciesMap).forEach((item) => {
				const id = !isAbsolute(item) && thirdPartyModulesMap[item] ? thirdPartyModulesMap[item] : item
				findChildren(id, this.getModuleInfo)
			})
			Object.keys(dependenciesMap).forEach((item) => {
				// allocate all dependencies of third party module to correct chunkName
				if (!isAbsolute(item)) {
					const thirdPartyModulePath = thirdPartyModulesMap[item]
					if (thirdPartyModulePath) {
						try {
							const allDependencies = {}
							// find absolute dependencies path from business file
							getDependencies(
								require.resolve(item, {
									paths: [thirdPartyModulePath]
								}),
								allDependencies
							)
							Object.keys(allDependencies).forEach((d) => {
								dependenciesMap[d] = (dependenciesMap[d] ?? []).concat(dependenciesMap[item])
							})
						} catch (_error) {
							logErr(`Please check ${getPkgName(thirdPartyModulePath)}/package.json ${thirdPartyModulePath} use ${item} but don't specify it in dependencies`)
						}
					}
				}
			})
			Object.keys(dependenciesMap).forEach((item) => {
				dependenciesMap[item] = Array.from(new Set(dependenciesMap[item].filter(Boolean)))
			})
			for (const id of moduleIds) {
				setGenerateMap(id)
			}
			writeGenerateMap()
		}
	}
}

const manifestPlugin = (): Plugin => {
	const { getOutput, optimize } = loadConfig()
	const { clientOutPut } = getOutput()
	return {
		name: 'manifestPlugin',
		async generateBundle(_, bundles) {
			if (optimize) {
				return
			}
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

const writeGenerateMap = async () => {
	await promises.writeFile(resolve(getCwd(), './build/asyncChunkMap.json'), JSON.stringify(asyncChunkMapJSON, null, 2))
	await promises.writeFile(resolve(getCwd(), './build/generateMap.json'), JSON.stringify(generateMap, null, 2))
	await promises.writeFile(resolve(getCwd(), './build/dependenciesMap.json'), JSON.stringify(dependenciesMap, null, 2))
}

const setGenerateMap = (id: string) => {
	const res = manualChunksFn(id)
	generateMap[id] = res ?? 'Page'
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
			return generateMap[id]
		}
	}
}

const manualChunksFn = (id: string) => {
	if (id.includes('chunkName')) {
		const chunkName = chunkNameRe.exec(id)![1]
		return chunkName
	}
	if (!process.env.LEGACY_VITE) {
		const sign = id.includes('node_modules') ? getPkgName(id) : id
		if (vendorList.includes(sign)) {
			// build in Page chunk
			return 'Page'
		}
		const arr = dependenciesMap[sign] ?? []
		if (arr.length === 1) {
			return arr[0]
		} else if (arr.length >= 2) {
			if (arr.includes('Page')) {
				return 'Page'
			}
			const commonChunkName = cryptoAsyncChunkName(arr.map((item) => ({ name: item })) as any, asyncChunkMapJSON)
			return commonChunkName === 'vendor~client-entry' ? 'common-vendor' : commonChunkName
		}
	}
}
const commonConfig = (_env: 'server' | 'client'): UserConfig => {
	const { whiteList, alias, css, viteConfig, optimize, hmr, isDev } = loadConfig()
	const framework = judgeFramework()
	const isProdBuildingModeAndIsClient = _env === 'client' && framework === 'ssr-plugin-react' && !isDev
	const lessOptions = css?.().loaderOptions?.less?.lessOptions ? css?.().loaderOptions?.less?.lessOptions : css?.().loaderOptions?.less
	return {
		root: cwd,
		mode: process.env.VITEMODE ?? 'development',
		...(optimize ? { logLevel: 'error' as LogType } : {}),
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
export { chunkNamePlugin, manifestPlugin, rollupOutputOptions, commonConfig, asyncOptimizeChunkPlugin }
