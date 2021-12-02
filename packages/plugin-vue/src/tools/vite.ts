import type { build as BuildType, UserConfig } from 'vite'
import { loadConfig, manualChunks, chunkNamePlugin, output, manifestPlugin, commonConfig } from 'ssr-server-utils'
import { createVuePlugin } from 'vite-plugin-vue2'
const build: typeof BuildType = require('vite').build
const { getOutput, vue3ServerEntry, vue3ClientEntry } = loadConfig()
const { clientOutPut, serverOutPut } = getOutput()

const serverConfig: UserConfig = {
  ...commonConfig,
  plugins: [
    createVuePlugin()
  ],
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
  plugins: [
    createVuePlugin()
  ],
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
