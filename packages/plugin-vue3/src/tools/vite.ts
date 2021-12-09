import type { build as BuildType, UserConfig } from 'vite'
import { loadConfig, chunkNamePlugin, output, manifestPlugin, commonConfig } from 'ssr-server-utils'
import vuePlugin from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import'
const build: typeof BuildType = require('vite').build
const { getOutput, vue3ServerEntry, vue3ClientEntry, viteConfig } = loadConfig()
const { clientOutPut, serverOutPut } = getOutput()

const serverConfig: UserConfig = {
  ...commonConfig(),
  plugins: [
    vuePlugin(viteConfig?.()?.server?.defaultPluginOptions),
    viteConfig?.()?.server?.extraPlugin,
    styleImport({
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: (name) => {
            return `vant/es/${name}/style/index`
          }
        }
      ]
    })
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
    __isBrowser__: false,
    ...viteConfig?.()?.server?.define
  }
}

const clientConfig: UserConfig = {
  ...commonConfig(),
  plugins: [
    vuePlugin(viteConfig?.()?.client?.defaultPluginOptions),
    viteConfig?.()?.client?.extraPlugin,
    styleImport({
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: (name) => {
            return `vant/es/${name}/style/index`
          }
        }
      ]
    })
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
    __isBrowser__: true,
    ...viteConfig?.()?.client?.define
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
