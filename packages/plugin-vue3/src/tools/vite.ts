
import { resolve } from 'path'
import { build } from 'vite'
import { getCwd, loadConfig } from 'ssr-server-utils'
import vuePlugin from '@vitejs/plugin-vue'

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
    ssrManifest: true,
    outDir: resolve(cwd, './build/server'),
    rollupOptions: {
      input: resolve(cwd, './node_modules/ssr-plugin-vue3/esm/entry/client-entry.js')
    }
  },
  define: {
    __isBrowser__: false
  }
}

const clientConfig = {
  ...commonConfig,
  build: {
    ssr: resolve(cwd, './node_modules/ssr-plugin-vue3/esm/entry/server-entry'),
    outDir: resolve(cwd, './build/client'),
    rollupOptions: {
      input: resolve(cwd, './node_modules/ssr-plugin-vue3/esm/entry/client-entry.js')
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
  await build(serverConfig)
}

export {
  viteBuild,
  viteStart,
  serverConfig,
  clientConfig
}
