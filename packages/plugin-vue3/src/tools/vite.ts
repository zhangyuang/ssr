
import { resolve } from 'path'
import { build, UserConfig, Plugin } from 'vite'
import { getCwd, loadConfig } from 'ssr-server-utils'
import vuePlugin from '@vitejs/plugin-vue'
import { parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string'

const cwd = getCwd()
const { prefix } = loadConfig()
type SSR = 'ssr'

const commonConfig = {
  root: cwd,
  base: prefix,
  mode: 'production',
  server: {
    middlewareMode: 'ssr' as SSR
  },
  plugins: [
    vuePlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(process.cwd(), './web'),
      _build: resolve(process.cwd(), './build')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
}

const serverConfig = {
  ...commonConfig,
  build: {
    ssr: resolve(cwd, './node_modules/ssr-plugin-vue3/esm/entry/server-entry.js'),
    outDir: resolve(cwd, './build/server'),
    rollupOptions: {
      input: resolve(cwd, './node_modules/ssr-plugin-vue3/esm/entry/server-entry.js')
    }
  },
  define: {
    __isBrowser__: false
  }
}

const webpackCommentRegExp = /webpackChunkName:\s"(.*)?"/
const chunkNameRe = /chunkName=(.*)/

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
const clientConfig: UserConfig = {
  ...commonConfig,
  build: {
    ssrManifest: true,
    outDir: resolve(cwd, './build/client'),
    rollupOptions: {
      input: resolve(cwd, './node_modules/ssr-plugin-vue3/esm/entry/client-entry.js'),
      output: {
        chunkFileNames: '[name].[hash].chunk.js',
        assetFileNames: '[name].[hash].chunk.[ext]'
      },
      plugins: [chunkNamePlugin()]
    },
    manualChunks: () => {
      return (id) => {
        if (id.includes('chunkName')) {
          return chunkNameRe.exec(id)![1]
        }
      }
    }
  },
  define: {
    __isBrowser__: true
  }
}
const viteStart = async () => {
  //
}
const viteBuild = async () => {
  await build(clientConfig)
  // await build(serverConfig)
}

export {
  viteBuild,
  viteStart,
  serverConfig,
  clientConfig
}
