
import { resolve } from 'path'
import { build, UserConfig } from 'vite'
import { getCwd, loadConfig, manualChunks, chunkNamePlugin, output } from 'ssr-server-utils'
import vuePlugin from '@vitejs/plugin-vue'

const cwd = getCwd()
const { prefix, getOutput } = loadConfig()
type SSR = 'ssr'
const { clientOutPut, serverOutPut } = getOutput()

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
    outDir: serverOutPut,
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
    outDir: clientOutPut,
    rollupOptions: {
      input: resolve(cwd, './node_modules/ssr-plugin-vue3/esm/entry/client-entry.js'),
      output: output,
      plugins: [chunkNamePlugin()]
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
  // await build(clientConfig)
  await build(serverConfig)
}

export {
  viteBuild,
  viteStart,
  serverConfig,
  clientConfig
}
