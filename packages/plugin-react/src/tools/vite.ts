import type { build as BuildType, UserConfig } from 'vite'
import { loadConfig, chunkNamePlugin, rollupOutputOptions, manifestPlugin, commonConfig } from 'ssr-server-utils'
import react from '@vitejs/plugin-react'
const build: typeof BuildType = require('vite').build
const { getOutput, reactServerEntry, reactClientEntry, viteConfig } = loadConfig()
const { clientOutPut, serverOutPut } = getOutput()

const serverConfig: UserConfig = {
  ...commonConfig(),
  plugins: [
    react({
      ...viteConfig?.()?.server?.defaultPluginOptions,
      jsxRuntime: 'classic'
    }),
    viteConfig?.()?.server?.extraPlugin
  ],
  build: {
    ssr: reactServerEntry,
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
  esbuild: {
    keepNames: true
  },
  plugins: [
    react({
      ...viteConfig?.()?.client?.defaultPluginOptions,
      jsxRuntime: 'classic'
    }),
    viteConfig?.()?.client?.extraPlugin
  ],
  build: {
    ssrManifest: true,
    outDir: clientOutPut,
    rollupOptions: {
      input: reactClientEntry,
      output: rollupOutputOptions,
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
