import { promises } from 'fs'
import { resolve } from 'path'
import type { Plugin } from 'vite'
import { parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string'
import type { OutputOptions } from 'rollup'
import { loadConfig } from '../loadConfig'
import { getOutputPublicPath } from '../parse'
import { getCwd } from '../cwd'

const webpackCommentRegExp = /webpackChunkName:\s"(.*)?"/
const chunkNameRe = /chunkName=(.*)/
const cwd = getCwd()
const { getOutput, prefix } = loadConfig()
const { clientOutPut } = getOutput()

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
const manifestPlugin = (): Plugin => {
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
    }
  }
}

const output: OutputOptions = {
  entryFileNames: 'Page.[hash].chunk.js',
  chunkFileNames: '[name].[hash].chunk.js',
  assetFileNames: (assetInfo) => {
    if (assetInfo.name?.includes('client-entry')) {
      return 'Page.[hash].chunk.[ext]'
    }
    return '[name].[hash].chunk.[ext]'
  },
  manualChunks: (id: string) => {
    if (id.includes('node_modules') && id.includes('.js')) {
      return 'vendor'
    }
    console.log(id)
    if (id.includes('chunkName')) {
      return chunkNameRe.exec(id)![1]
    }
  }
}
type SSR = 'ssr'
const commonConfig = {
  root: cwd,
  base: prefix,
  mode: 'development',
  server: {
    middlewareMode: 'ssr' as SSR
  }
}
export {
  chunkNamePlugin,
  manifestPlugin,
  output,
  commonConfig
}
