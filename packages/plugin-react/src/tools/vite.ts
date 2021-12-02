import { resolve } from 'path'
import type { build as BuildType, UserConfig } from 'vite'
import { loadConfig, chunkNamePlugin, output, manifestPlugin, commonConfig, getCwd } from 'ssr-server-utils'
import react from '@vitejs/plugin-react'
const build: typeof BuildType = require('vite').build
const { getOutput, reactServerEntry, reactClientEntry } = loadConfig()
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
    react()
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
    __isBrowser__: false
  }
}

const clientConfig: UserConfig = {
  ...commonConfig,
  resolve: resolveObj,
  plugins: [
    react()
  ],
  build: {
    ssrManifest: true,
    outDir: clientOutPut,
    rollupOptions: {
      input: reactClientEntry,
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
