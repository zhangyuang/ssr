import { promises } from 'fs'
import { resolve } from 'path'
import type { UserConfig, Plugin } from 'vite'
import { parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string'
import type { OutputOptions } from 'rollup'
import { loadConfig } from '../loadConfig'
import { getOutputPublicPath } from '../parse'
import { getCwd } from '../cwd'

const webpackCommentRegExp = /webpackChunkName:\s"(.*)?"/
const chunkNameRe = /chunkName=(.*)/
const imageRegExp = /\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/
const fontRegExp = /\.(eot|woff|woff2|ttf)(\?.*)?$/
const cwd = getCwd()

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
    if (id.includes('node_modules') && id.includes('.js') && !id.includes('client-entry')) {
      return 'vendor'
    }

    if (id.includes('chunkName')) {
      return chunkNameRe.exec(id)![1]
    }
  }
}
type SSR = 'ssr'
const noExternalArr: string[] = []
const commonConfig = (): UserConfig => {
  const { prefix, whiteList, viteConfig } = loadConfig()
  return {
    root: cwd,
    base: prefix,
    mode: 'development',
    server: {
      middlewareMode: 'ssr' as SSR
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    // @ts-expect-error
    ssr: {
      external: ['serialize-javascript', 'ssr-server-utils'],
      noExternal: noExternalArr.concat(whiteList as string[] || [])
    },
    resolve: {
      alias: {
        '@': resolve(cwd, './web'),
        _build: resolve(cwd, './build'),
        ...viteConfig?.()?.common?.alias
      },
      extensions: ['.mjs', '.ts', '.jsx', '.tsx', '.json', '.vue', '.js']
    }
  }
}
export {
  chunkNamePlugin,
  manifestPlugin,
  rollupOutputOptions,
  commonConfig
}
