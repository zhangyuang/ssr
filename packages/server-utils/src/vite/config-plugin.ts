import { promises } from 'fs'
import { EventEmitter } from 'events'
import { resolve } from 'path'
import type { UserConfig, Plugin } from 'vite'
import { parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string'
import type { OutputOptions, PreRenderedChunk } from 'rollup'
import { mkdir } from 'shelljs'
import * as getPackageName from 'get-package-name'
import { loadConfig } from '../loadConfig'
import { getOutputPublicPath } from '../parse'
import { getCwd, cryptoAsyncChunkName, accessFile, checkContainsRev } from '../cwd'

const getPkgName = getPackageName.default
const webpackCommentRegExp = /webpackChunkName:\s?"(.*)?"\s?\*/
const chunkNameRe = /chunkName=(.*)/
const imageRegExp = /\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/
const fontRegExp = /\.(eot|woff|woff2|ttf)(\?.*)?$/
const cwd = getCwd()
const dependenciesMap: Record<string, string[]> = {}
const asyncChunkMapJSON: Record<string, string[]> = {}
const generateMap: Record<string, string> = {}
const vendorMap: Record<string, string[]> = {}

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
          if (!rawUrl.includes('render')) {
            if (rawUrl.includes('fetch')) {
              str = str.appendRight(statementEnd - 1, '?chunkName=void')
            } else if (rawUrl.includes('layout') || rawUrl.includes('App') || rawUrl.includes('store')) {
              str = str.appendRight(statementEnd - 1, '?chunkName=layout-app')
            } else {
              str = str.appendRight(statementEnd - 1, '?chunkName=void')
            }
            continue
          }
          const chunkName = webpackCommentRegExp.exec(rawUrl)![1]
          str = str.appendRight(statementEnd - 1, `?chunkName=${chunkName}`)
        }
        return {
          code: str.toString()
        }
      }
    }
  }
}
const vendorList = ['vue', 'vuex', 'vue-router', 'react', 'react-router', 'react-router-dom', 'react-dom', '@vue', 'ssr-client-utils', 'ssr-common-utils', 'pinia']
const entryList = ['__vite-browser-external']

const recordInfo = (id: string, chunkName: string, defaultChunkName?: string) => {
  if (!dependenciesMap[id]) {
    dependenciesMap[id] = defaultChunkName ? [defaultChunkName] : []
  }
  dependenciesMap[id].push(chunkName)
}
const debounce = (func: Function, wait: number) => {
  let timer: number
  return () => {
    clearTimeout(timer)
    timer = setTimeout(func, wait)
  }
}

let hasWritten = false
const writeEmitter = new EventEmitter()

const fn = () => {
  const { writeDebounceTime } = loadConfig()
  return debounce(() => {
    if (hasWritten) {
      throw new Error('generateMap has been written over twice, please check your machine performance, or add config.writeDebounceTime that default is 1000ms')
    }
    hasWritten = true
    writeEmitter.emit('buildEnd')
  }, writeDebounceTime)
}

let checkBuildEnd: () => void
const moduleIds: string[] = []
const asyncOptimizeChunkPlugin = (): Plugin => {
  return {
    name: 'asyncOptimizeChunkPlugin',
    moduleParsed (this, info) {
      const { id } = info
      const lastStart = id.lastIndexOf('node_modules')
      if (id.includes('chunkName') || id.includes('client-entry')) {
        const { importedIds, dynamicallyImportedIds } = info
        const chunkName = id.includes('client-entry') ? 'client-entry' : chunkNameRe.exec(id)![1]
        for (const importerId of importedIds) {
          recordInfo(importerId, chunkName)
        }
        for (const dyImporterId of dynamicallyImportedIds) {
          recordInfo(dyImporterId, chunkName, 'dynamic')
        }
      } else if (id.includes('node_modules') && lastStart > -1 && vendorList.includes(getPkgName(id))) {
        const { importedIds, dynamicallyImportedIds } = info
        const chunkName = 'common-vendor'
        recordInfo(id, chunkName, chunkName)
        for (const importerId of importedIds) {
          recordInfo(importerId, chunkName)
        }
        for (const dyImporterId of dynamicallyImportedIds) {
          recordInfo(dyImporterId, chunkName, 'dynamic')
        }
      } else if (dependenciesMap[id]) {
        const { importedIds, dynamicallyImportedIds } = this.getModuleInfo(id)!
        for (const importerId of importedIds) {
          if (!dependenciesMap[importerId]) {
            dependenciesMap[importerId] = []
          }
          dependenciesMap[importerId] = dependenciesMap[importerId].concat(dependenciesMap[id])
        }
        for (const dyImporterId of dynamicallyImportedIds) {
          if (!dependenciesMap[dyImporterId]) {
            dependenciesMap[dyImporterId] = ['dynamic']
          }
          dependenciesMap[dyImporterId] = dependenciesMap[dyImporterId].concat(dependenciesMap[id])
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
    async buildEnd (err) {
      return await new Promise((resolve) => {
        Object.entries(dependenciesMap).forEach(([fileName, dependenciesArr]) => {
          const arr = Array.from(new Set(dependenciesArr))
          if (fileName.includes('node_modules')) {
            arr.push('vendor')
            const modulename = getPkgName(fileName)
            if (!vendorMap[modulename]) {
              vendorMap[modulename] = arr
            } else if (arr.length > vendorMap[modulename].length) {
              vendorMap[modulename] = arr
            } else if (arr.length === vendorMap[modulename].length) {
              vendorMap[modulename] = Array.from(new Set(vendorMap[modulename].concat(arr)))
            }
          } else {
            vendorMap[fileName] = arr
          }
        })
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
        const arr = bundle.split('.')
        arr.splice(1, 2)
        manifest[arr.join('.')] = `${getOutputPublicPath()}${val}`
      }
      if (!await accessFile(resolve(clientOutPut))) {
        mkdir(resolve(clientOutPut))
      }
      manifest['vite'] = '1'
      await promises.writeFile(resolve(clientOutPut, './asset-manifest.json'), JSON.stringify(manifest, null, 2))
    }
  }
}

const writeGenerateMap = async () => {
  await promises.writeFile(resolve(getCwd(), './build/asyncChunkMap.json'), JSON.stringify(asyncChunkMapJSON, null, 2))
  await promises.writeFile(resolve(getCwd(), './build/generateMap.json'), JSON.stringify(generateMap, null, 2))
  await promises.writeFile(resolve(getCwd(), './build/vendorMap.json'), JSON.stringify(vendorMap, null, 2))
}

const setGenerateMap = (id: string) => {
  const res = manualChunksFn(id)
  generateMap[id] = res ?? 'void'
}

const rollupOutputOptions: OutputOptions = {
  entryFileNames: (chunkInfo: PreRenderedChunk) => {
    for (const id in chunkInfo.modules) {
      generateMap[id] = 'Page'
    }
    return 'Page.[hash].chunk.js'
  },
  chunkFileNames: '[name].[hash].chunk.js',
  assetFileNames: (assetInfo) => {
    if (assetInfo.name?.includes('client-entry')) {
      return 'Page.[hash].chunk.[ext]'
    }
    if (assetInfo.name && (imageRegExp.test(assetInfo.name) || fontRegExp.test(assetInfo.name))) {
      return 'assets/[name].[hash].[ext]'
    }
    return '[name].[hash].chunk.[ext]'
  },
  manualChunks: (id: string) => {
    return generateMap[id] === 'void' ? undefined : generateMap[id]
  }
}

const manualChunksFn = (id: string) => {
  if (id.includes('chunkName')) {
    const chunkName = chunkNameRe.exec(id)![1]
    return chunkName === 'void' ? undefined : chunkName
  }
  if (!process.env.LEGACY_VITE) {
    const arr = vendorMap[getPkgName(id)] || vendorMap[id]
    if (!arr || (arr.includes('client-entry') || checkContainsRev(entryList, id))) {
      return
    } else if (arr.includes('common-vendor')) {
      return 'common-vendor'
    }
    if (arr.length === 1) {
      return arr[0]
    } else if (arr.length >= 2) {
      return cryptoAsyncChunkName(arr.map(item => ({ name: item })), asyncChunkMapJSON)
    }
  }
}

type SSR = 'ssr'
const commonConfig = (): UserConfig => {
  const { whiteList, alias, css, hmr, viteConfig, optimize } = loadConfig()
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
          ...css?.().loaderOptions?.less
        },
        scss: css?.().loaderOptions?.scss ?? {}
      }
    },
    // @ts-expect-error
    ssr: {
      external: ['ssr-serialize-javascript', 'ssr-server-utils', 'ssr-deepclone', 'ssr-hoc-react'].concat(viteConfig?.()?.server?.externals ?? []),
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
