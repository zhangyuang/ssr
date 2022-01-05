import type { build as BuildType, UserConfig } from 'vite'
import { loadConfig, chunkNamePlugin, rollupOutputOptions, manifestPlugin, commonConfig } from 'ssr-server-utils'
import { createVuePlugin } from 'vite-plugin-vue2'
const build: typeof BuildType = require('vite').build
const { getOutput, vueServerEntry, vueClientEntry, define } = loadConfig()
const { clientOutPut, serverOutPut } = getOutput()

const serverConfig: UserConfig = {
  ...commonConfig(),
  plugins: [
    createVuePlugin()
  ],
  build: {
    ssr: vueServerEntry,
    outDir: serverOutPut,
    rollupOptions: {
      output: {
        entryFileNames: 'Page.server.js'
      }
    }
  },
  define: {
    __isBrowser__: false,
    ...define?.server,
    ...define?.base
  }
}

const clientConfig: UserConfig = {
  ...commonConfig(),
  plugins: [
    createVuePlugin()
  ],
  build: {
    ssrManifest: true,
    outDir: clientOutPut,
    rollupOptions: {
      input: vueClientEntry,
      output: rollupOutputOptions,
      plugins: [chunkNamePlugin(), manifestPlugin()]
    }
  },
  define: {
    __isBrowser__: true,
    ...define?.client,
    ...define?.base
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
