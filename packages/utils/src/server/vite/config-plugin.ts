import { promises } from 'fs'
import { EventEmitter } from 'events'
import { resolve, isAbsolute } from 'path'
import type { UserConfig, Plugin } from 'vite'
import { parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string'
import type { OutputOptions, PreRenderedChunk, PluginContext } from 'rollup'
import { mkdir } from 'shelljs'
import { loadConfig } from '../loadConfig'
import { getOutputPublicPath } from '../parse'
import { getCwd, cryptoAsyncChunkName, accessFile, debounce } from '../cwd'
import { logErr } from '../log'
import { getDependencies, getPkgName } from '../build-utils'
import { getBuildConfig } from '../build-config'
import { defaultExternal } from '../static'

const webpackCommentRegExp = /webpackChunkName:\s?"(.*)?"\s?\*/
const chunkNameRe = /chunkName=(.*)/
const imageRegExp = /\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/
const fontRegExp = /\.(eot|woff|woff2|ttf)(\?.*)?$/
const cwd = getCwd()
const dependenciesMap: Record<string, string[]> = {}
const asyncChunkMapJSON: Record<string, string[]> = {}
const generateMap: Record<string, string> = {}
const vendorList = ['vue', 'vuex', 'vue-router', 'react', 'react-router',
  'react-router-dom', 'react-dom', '@vue', 'ssr-hoc-react', 'ssr-hoc-react18',
  'ssr-client-utils', 'ssr-common-utils', 'pinia', '@babel/runtime',
  'ssr-plugin-vue3', 'ssr-plugin-vue', 'ssr-plugin-react', 'react/jsx-runtime',
  'path-to-regexp', 'plugin-vue:export-helper', '@vue/devtools-api', 'ssr-hoc-vue3', 'ssr-hoc-vue'
]

const chunkNamePlugin = function (): Plugin {
  return {
    name: 'chunkNamePlugin',
    transform (source, id) {
      if (id.includes('ssr-declare-routes') || id.includes('ssr-manual-routes')) {
        let str = new MagicString(source)
        const imports = parseImports(source)[0]
        for (let index = 0; index < imports.length; index++) {
          const { s: start, e: end, se: statementEnd } = imports[index]
          const rawUrl = source.slice(start, end)
          const chunkName = webpackCommentRegExp.exec(rawUrl)?.[1]
          if (!rawUrl.includes('render')) {
            if (rawUrl.includes('layout') || rawUrl.includes('App') || rawUrl.includes('store')) {
              str = str.appendRight(statementEnd - 1, '?chunkName=Page')
            } else if (chunkName) {
              str = str.appendRight(statementEnd - 1, `?chunkName=${chunkName}`)
            } else {
              str = str.appendRight(statementEnd - 1, '?chunkName=Page')
            }
            continue
          }
          str = str.appendRight(statementEnd - 1, `?chunkName=${chunkName}`)
        }
        return {
          code: str.toString()
        }
      }
    }
  }
}

const filePathMap: Record<string, string> = {}

const recordInfo = (id: string, chunkName: string | null, defaultChunkName: string | null, parentId: string) => {
  const sign = id.includes('node_modules') ? getPkgName(id) : id
  if (id.includes('node_modules')) {
    filePathMap[sign] = parentId
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

let hasWritten = false
const writeEmitter = new EventEmitter()

const fn = () => {
  const { writeDebounceTime } = loadConfig()
  return debounce(() => {
    if (hasWritten) {
      throw new Error(`generateMap has been written over twice, please check your machine performance, or add config.writeDebounceTime that default is ${writeDebounceTime}ms`)
    }
    hasWritten = true
    writeEmitter.emit('buildEnd')
  }, writeDebounceTime)
}

let checkBuildEnd: () => void
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
    moduleParsed (this, info) {
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
    buildStart () {
      checkBuildEnd = fn()
    },
    transform (this, code, id) {
      moduleIds.push(id)
      checkBuildEnd()
    },
    async buildEnd (this, err) {
      // after the first layer file can be located in which chunkName
      // confirm all children dependence belong to which chunkName
      Object.keys(dependenciesMap).forEach(item => {
        const id = !isAbsolute(item) ? filePathMap[item] : item
        findChildren(id, this.getModuleInfo)
      })
      Object.keys(dependenciesMap).forEach(item => {
        if (!isAbsolute(item)) {
          const abPath = filePathMap[item]
          if (abPath) {
            try {
              const allDependencies = {}
              // find absolute dependencies path from business file
              getDependencies(require.resolve(item, {
                paths: [abPath]
              }), allDependencies)
              Object.keys(allDependencies).forEach(d => {
                dependenciesMap[d] = (dependenciesMap[d] ?? []).concat(dependenciesMap[item])
              })
            } catch (error) {
              logErr(`Please check ${getPkgName(abPath)}/package.json ${abPath} use ${item} but don't specify it in dependencies`)
            }
          }
        }
      })
      Object.keys(dependenciesMap).forEach(item => {
        dependenciesMap[item] = Array.from(new Set(dependenciesMap[item].filter(Boolean)))
      })
      return await new Promise((resolve) => {
        if (err) {
          writeEmitter.on('buildEnd', () => {
            for (const id of moduleIds) {
              setGenerateMap(id)
            }
            writeEmitter.removeAllListeners()
            writeGenerateMap().then(() => resolve())
          })
        } else {
          for (const id of moduleIds) {
            setGenerateMap(id)
          }
          writeGenerateMap().then(() => resolve())
        }
      })
    }
  }
}

const manifestPlugin = (): Plugin => {
  const { getOutput, optimize } = loadConfig()
  const { clientOutPut } = getOutput()
  return {
    name: 'manifestPlugin',
    async generateBundle (_, bundles) {
      if (optimize) return
      const manifest: Record<string, string> = {}
      for (const bundle in bundles) {
        const val = bundle
        const arr = bundle.split('/')[1].split('.')
        arr.splice(1, 2)
        manifest[arr.join('.')] = `${getOutputPublicPath()}${val}`
      }
      if (!await accessFile(resolve(clientOutPut))) {
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
    entryFileNames: (chunkInfo: PreRenderedChunk) => {
      return buildConfig.entryChunk
    },
    chunkFileNames: buildConfig.jsBuldConfig.chunkFileName,
    assetFileNames: (assetInfo) => {
      if (assetInfo.name?.includes('client-entry')) {
        return buildConfig.clientEntryChunk
      }
      if (assetInfo.name && (imageRegExp.test(assetInfo.name) || fontRegExp.test(assetInfo.name))) {
        return buildConfig.imagePathForVite
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
      const commonChunkName = cryptoAsyncChunkName(arr.map(item => ({ name: item })), asyncChunkMapJSON)
      return commonChunkName === 'vendor~client-entry' ? 'common-vendor' : commonChunkName
    }
  }
}

type SSR = 'ssr'
const commonConfig = (): UserConfig => {
  const { whiteList, alias, css, hmr, viteConfig, optimize } = loadConfig()
  const lessOptions = css?.().loaderOptions?.less?.lessOptions ? css?.().loaderOptions?.less?.lessOptions : css?.().loaderOptions?.less
  return {
    root: cwd,
    mode: 'development',
    ...(optimize ? { logLevel: 'slient' } : {}),
    server: {
      middlewareMode: 'ssr' as SSR,
      hmr,
      ...viteConfig?.().common?.server
    },
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
    // @ts-expect-error
    ssr: {
      external: defaultExternal.concat(viteConfig?.()?.server?.externals ?? []),
      noExternal: whiteList
    },
    resolve: {
      alias: alias,
      extensions: ['.mjs', '.ts', '.jsx', '.tsx', '.json', '.vue', '.js']
    }
  }
}
export {
  chunkNamePlugin,
  manifestPlugin,
  rollupOutputOptions,
  commonConfig,
  asyncOptimizeChunkPlugin,
  writeEmitter
}
