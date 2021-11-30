import { resolve } from 'path'
import type { build as BuildType, UserConfig } from 'vite'
import { getCwd, loadConfig, manualChunks, chunkNamePlugin, output, manifestPlugin } from 'ssr-server-utils'
import vuePlugin from '@vitejs/plugin-vue'
const build: typeof BuildType = require('vite').build
const cwd = getCwd()
const { prefix, getOutput, vue3ServerEntry, vue3ClientEntry } = loadConfig()
type SSR = 'ssr'
const { clientOutPut, serverOutPut } = getOutput()

const commonConfig = {
  root: cwd,
  base: prefix,
  mode: 'development',
  server: {
    middlewareMode: 'ssr' as SSR
  },
  plugins: [
    vuePlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(cwd, './web'),
      _build: resolve(cwd, './build')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
}

const serverConfig: UserConfig = {
  ...commonConfig,
  build: {
    ssr: vue3ServerEntry,
    outDir: serverOutPut,
    rollupOptions: {
      output: {
        entryFileNames: 'Page.server.js'
      }
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
    outDir: clientOutPut,
    rollupOptions: {
      input: vue3ClientEntry,
      output: output,
      plugins: [chunkNamePlugin(), manifestPlugin()]
    },
    manualChunks: manualChunks
  },
  define: {
    __isBrowser__: true
  }
}
const viteStart = async () => {
  //
}
const viteBuild = async () => {
  await build({ ...clientConfig, mode: 'production' })
  await build({ ...serverConfig, mode: 'production' })
}

export {
  viteBuild,
  viteStart,
  serverConfig,
  clientConfig
}
