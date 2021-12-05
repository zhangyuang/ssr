import type { build as BuildType, UserConfig } from 'vite'
import { loadConfig, chunkNamePlugin, output, manifestPlugin, commonConfig } from 'ssr-server-utils'
import vuePlugin from '@vitejs/plugin-vue'
const build: typeof BuildType = require('vite').build
const { getOutput, vue3ServerEntry, vue3ClientEntry } = loadConfig()
const { clientOutPut, serverOutPut } = getOutput()

console.log('xxx', vuePlugin)
const serverConfig: UserConfig = {
  ...commonConfig(),
  plugins: [
    vuePlugin()
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
  ...commonConfig(),
  plugins: [
    vuePlugin()
  ],
  build: {
    ssrManifest: true,
    outDir: clientOutPut,
    rollupOptions: {
      input: vue3ClientEntry,
      output: output,
      plugins: [chunkNamePlugin(), manifestPlugin()]
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
  await build({ ...clientConfig, mode: 'production' })
  await build({ ...serverConfig, mode: 'production' })
}

export {
  viteBuild,
  viteStart,
  serverConfig,
  clientConfig
}
