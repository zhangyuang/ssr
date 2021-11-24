
import { resolve } from 'path'
import { build } from 'vite'
import { getCwd, loadConfig } from 'ssr-server-utils'
import vuePlugin from '@vitejs/plugin-vue'

export const viteStart = async () => {
  //
}
export const viteBuild = async () => {
  const cwd = getCwd()
  const { prefix } = loadConfig()

  const commonConfig = {
    root: cwd,
    base: prefix,
    mode: 'production',
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

  await build({
    ...commonConfig,
    server: {
      middlewareMode: 'ssr'
    },
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
  })
  await build({
    ...commonConfig,
    server: {
      middlewareMode: 'ssr'
    },
    build: {
      ssrManifest: true,
      outDir: resolve(cwd, './build/client'),
      rollupOptions: {
        input: resolve(cwd, './node_modules/ssr-plugin-vue3/esm/entry/client-entry.js')
      }
    },
    define: {
      __isBrowser__: false
    }
  })
}
