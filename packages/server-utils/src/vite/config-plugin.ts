import { promises } from 'fs'
import { resolve } from 'path'
import type { UserConfig, Plugin } from 'vite'
import { parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string'
import type { OutputOptions, PreRenderedChunk } from 'rollup'
import { mkdir } from 'shelljs'
import { loadConfig } from '../loadConfig'
import { getOutputPublicPath } from '../parse'
import { getCwd, cryptoAsyncChunkName, accessFile } from '../cwd'

const webpackCommentRegExp = /webpackChunkName:\s?"(.*)?"\s?\*/
const chunkNameRe = /chunkName=(.*)/
const imageRegExp = /\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/
const fontRegExp = /\.(eot|woff|woff2|ttf)(\?.*)?$/
const cwd = getCwd()
const dependenciesMap: Record<string, string[]> = {}
const asyncChunkMapJSON: Record<string, string[]> = {}
const generateMap: Record<string, string> = {}

const chunkNamePlugin = function (): Plugin {
  return {
    name: 'chunkNamePlugin',
    transform (source, id) {
      if (id.includes('ssr-declare-routes') || id.includes('ssr-manual-routes')) {
        let str = new MagicString(source)
        const imports = parseImports(source)[0]
        for (let index = 0; index < imports.length; index++) {
          const { s: start, e: end } = imports[index]
          const rawUrl = source.slice(start, end)
          if (!rawUrl.includes('render')) continue
          const chunkName = webpackCommentRegExp.exec(rawUrl)![1]
          str = str.appendRight(end - 1, `?chunkName=${chunkName}`)
        }
        return {
          code: str.toString()
        }
      }
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
        const chunkname = chunkNameRe.exec(id)![1]
        for (const importerId of importedIds) {
          if (!dependenciesMap[importerId]) {
            dependenciesMap[importerId] = []
          }
          dependenciesMap[importerId].push(chunkname)
        }
        for (const dyImporterId of dynamicallyImportedIds) {
          if (!dependenciesMap[dyImporterId]) {
            dependenciesMap[dyImporterId] = ['dynamic']
          }
          dependenciesMap[dyImporterId].push(chunkname)
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
    }
  }
}
const manifestPlugin = (): Plugin => {
  const { getOutput } = loadConfig()
  const { clientOutPut } = getOutput()
  return {
    name: 'manifestPlugin',
    async generateBundle (_, bundles) {
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
      await promises.writeFile(resolve(clientOutPut, './asset-manifest.json'), JSON.stringify(manifest, null, 2))
      await promises.writeFile(resolve(getCwd(), './build/asyncChunkMap.json'), JSON.stringify(asyncChunkMapJSON, null, 2))
      await promises.writeFile(resolve(getCwd(), './build/generateMap.json'), JSON.stringify(generateMap, null, 2))
    }
  }
}
// const vendorList = ['vue', 'vuex', 'vue-router', 'react', 'react-router', 'react-router-dom', 'react-dom', '@vue']
const entryList = ['vue', 'vuex', 'vue-router', 'react', 'react-router', 'react-router-dom', 'react-dom', '@vue', 'ssr-client-utils', 'pinia', 'create-router', 'combine-router']
const re = /node_modules(\\|\/)(.*?)(\1)/
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
    const res = manualChunksFn(id)
    const name = res ? (typeof res === 'string' ? res : res.name) : undefined
    if (!res) {
      generateMap[id] = 'entry'
      return 'entry'
    } else {
      generateMap[id] = (typeof res === 'string' ? res : res.originalName)
    }
    return name
  }
}
const manualChunksFn = (id: string) => {
  if (id.includes('chunkName')) {
    return chunkNameRe.exec(id)![1]
  }
  if (!process.env.LEGACY_VITE) {
    if (id.includes('node_modules')) {
      const lastStart = id.lastIndexOf('node_modules')
      if (entryList.includes(re.exec(id.slice(lastStart, id.length))?.[2] as string)) {
        return
      }
      if (!dependenciesMap[id]) {
        dependenciesMap[id] = []
      }
      dependenciesMap[id].push('vendor')
    }
    const arr = Array.from(new Set(dependenciesMap?.[id]))
    if (arr.length === 1) {
      return arr[0]
    } else if (arr.length >= 2) {
      return {
        name: cryptoAsyncChunkName(arr.map(item => ({ name: item })), asyncChunkMapJSON),
        originalName: arr.join('~')
      }
    }
  }
}
type SSR = 'ssr'
const commonConfig = (): UserConfig => {
  const { whiteList, alias, css, hmr, viteConfig } = loadConfig()
  return {
    root: cwd,
    mode: 'development',
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
      external: ['ssr-serialize-javascript', 'ssr-server-utils', 'ssr-deepclone'].concat(viteConfig?.()?.server?.externals ?? []),
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
  asyncOptimizeChunkPlugin
}
