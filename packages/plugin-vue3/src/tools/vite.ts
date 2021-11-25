
import { resolve, sep, basename } from 'path'
import { build, UserConfig } from 'vite'
import { getCwd, loadConfig, getFeDir, getDynamicParam } from 'ssr-server-utils'
import vuePlugin from '@vitejs/plugin-vue'

const cwd = getCwd()
const { prefix } = loadConfig()
const feDir = getFeDir()
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

const clientConfig: UserConfig = {
  ...commonConfig,
  build: {
    ssrManifest: true,
    outDir: resolve(cwd, './build/client'),
    rollupOptions: {
      input: resolve(cwd, './node_modules/ssr-plugin-vue3/esm/entry/client-entry.js')
    },
    manualChunks: () => {
      return (id) => {
        let chunkName = ''
        if (id.includes('render')) {
          console.log('xx', getDynamicParam(basename(id)))
          chunkName = id.replace(feDir, '').split(sep).slice(0, -1).join('-') + getDynamicParam(basename(id)).replace(/\/:\??/g, '-').replace('?', '-optional')
          return chunkName
        }
        return id
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
