import { resolve } from 'path'
import type { build as BuildType, UserConfig } from 'vite'
import { loadConfig, chunkNamePlugin, output, manifestPlugin, commonConfig, getCwd } from 'ssr-server-utils'
import vuePlugin from '@vitejs/plugin-vue'
const build: typeof BuildType = require('vite').build
const { getOutput, vue3ServerEntry, vue3ClientEntry } = loadConfig()
const { clientOutPut, serverOutPut } = getOutput()

const cwd = getCwd()
const resolveObj = {
  alias: {
    '@': resolve(cwd, './web'),
    _build: resolve(cwd, './build')
  },
  extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
}
const serverConfig: UserConfig = {
  ...commonConfig,
  resolve: resolveObj,
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
  ...commonConfig,
  resolve: resolveObj,
  plugins: [
    vuePlugin()
  ],
  build: {
    ssrManifest: true,
    outDir: clientOutPut,
    rollupOptions: {
      input: vue3ClientEntry,
      //@ts-expect-error
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
