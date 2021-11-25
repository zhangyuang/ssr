
import { resolve, sep, basename } from 'path'
import { build, UserConfig } from 'vite'
import { getCwd, loadConfig, getPagesDir, getDynamicParam } from 'ssr-server-utils'
import vuePlugin from '@vitejs/plugin-vue'
import { parse as parseImports } from 'es-module-lexer'

const cwd = getCwd()
const { prefix } = loadConfig()
const pagesDir = getPagesDir()
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

const myPlugin = () => {
  return {
    name: 'transform-file',

    transform (source, id) {
      if (id.includes('ssr-temporary-routes')) {
        const imports = parseImports(source)[0]
        for (let index = 0; index < imports.length; index++) {
          const {
            s: start,
            e: end
          } = imports[index]

          const rawUrl = source.slice(start, end)
          console.log(rawUrl)
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
        chunkFileNames: '[name].[hash].chunk.js'
      },
      plugins: [myPlugin()]
    }
    // manualChunks: () => {
    //   return (id) => {
    //     if (id.includes('render')) {
    //       let chunkName = ''
    //       const filename = basename(id)
    //       chunkName = id.replace(pagesDir, '').split(sep).slice(1, -1).join('-')
    //       if (filename.includes('$')) {
    //         chunkName = `${chunkName}-${getDynamicParam(filename).replace(/\/:\??/g, '-').replace('?', '-optional')}`
    //       }
    //       return chunkName
    //     }
    //     if (id.includes('client-entry')) {
    //       console.log(id)
    //       return 'vendor123'
    //     }
    //   }
    // }
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
