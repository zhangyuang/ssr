import { promises } from 'fs'
import { resolve } from 'path'
import type { UserConfig, Plugin } from 'vite'
import { parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string'
import type { OutputOptions } from 'rollup'
import { loadConfig } from '../loadConfig'
import { getOutputPublicPath } from '../parse'
import { getCwd, cryptoAsyncChunkName } from '../cwd'

const webpackCommentRegExp = /webpackChunkName:\s"(.*)?"/
const chunkNameRe = /chunkName=(.*)/
const imageRegExp = /\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/
const fontRegExp = /\.(eot|woff|woff2|ttf)(\?.*)?$/
const cwd = getCwd()
const originAsyncChunkMap: Record<string, string[]> = {}
const asyncChunkMapJSON: Record<string, string[]> = {}

const chunkNamePlugin = function (): Plugin {
  return {
    name: 'chunkNamePlugin',
    transform (source, id) {
      if (id.includes('ssr-temporary-routes')) {
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
      const { id, importedIds } = info
      if (id.includes('chunkName')) {
        const chunkname = chunkNameRe.exec(id)![1]
        for (const importerId of importedIds) {
          if (!originAsyncChunkMap[importerId]) {
            originAsyncChunkMap[importerId] = []
          }
          originAsyncChunkMap[importerId].push(chunkname)
        }
      } else if (originAsyncChunkMap[id]) {
        const { importedIds } = this.getModuleInfo(id)!
        for (const importerId of importedIds) {
          if (!originAsyncChunkMap[importerId]) {
            originAsyncChunkMap[importerId] = []
          }
          originAsyncChunkMap[importerId] = originAsyncChunkMap[importerId].concat(originAsyncChunkMap[id])
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
      await promises.writeFile(resolve(clientOutPut, './asset-manifest.json'), JSON.stringify(manifest))
      await promises.writeFile(resolve(getCwd(), './build/asyncChunkMap.json'), JSON.stringify(asyncChunkMapJSON))
      for (const i in originAsyncChunkMap) {
        originAsyncChunkMap[i] = Array.from(new Set(originAsyncChunkMap[i]))
      }
      await promises.writeFile(resolve(getCwd(), './build/originAsyncChunkMap.json'), JSON.stringify(originAsyncChunkMap))
    }
  }
}

const rollupOutputOptions: OutputOptions = {
  entryFileNames: 'Page.[hash].chunk.js',
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
    return manualChunksFn(id)
  }
}
const manualChunksFn = (id: string) => {
  if (id.includes('chunkName')) {
    return chunkNameRe.exec(id)![1]
  }
  const arr = Array.from(new Set(originAsyncChunkMap?.[id]))
  if (arr.length === 1) {
    return arr[0]
  } else if (arr.length >= 2) {
    return cryptoAsyncChunkName(arr.map(item => ({ name: item })), asyncChunkMapJSON)
  }

}
type SSR = 'ssr'
const commonConfig = (): UserConfig => {
  const { prefix, whiteList, alias, css } = loadConfig()
  return {
    root: cwd,
    base: prefix,
    mode: 'development',
    server: {
      middlewareMode: 'ssr' as SSR
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
      external: ['serialize-javascript', 'ssr-server-utils'],
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
