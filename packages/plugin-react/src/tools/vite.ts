import type { build as BuildType, UserConfig } from 'vite'
import { loadConfig, chunkNamePlugin, rollupOutputOptions, manifestPlugin, commonConfig } from 'ssr-server-utils'
import react from '@vitejs/plugin-react'
import styleImport, {
  AndDesignVueResolve,
  VantResolve,
  ElementPlusResolve,
  NutuiResolve,
  AntdResolve
} from 'vite-plugin-style-import'

const build: typeof BuildType = require('vite').build
const { getOutput, reactServerEntry, reactClientEntry, viteConfig, supportOptinalChaining } = loadConfig()

const { clientOutPut, serverOutPut } = getOutput()
const styleImportConfig = {
  include: ['**/*.vue', '**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx', /chunkName/],
  resolves: [
    AndDesignVueResolve(),
    VantResolve(),
    ElementPlusResolve(),
    NutuiResolve(),
    AntdResolve()
  ]
}
const serverConfig: UserConfig = {
  ...commonConfig(),
  optimizeDeps: {
    include: ['path-to-regexp', 'react-dom'],
    exclude: ['ssr-server-utils']
  },
  plugins: [
    react({
      ...viteConfig?.()?.server?.defaultPluginOptions,
      jsxRuntime: 'classic',
      babel: !supportOptinalChaining && {
        plugins: [
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator'
        ]
      }
    }),
    viteConfig?.()?.common?.extraPlugin,
    viteConfig?.()?.server?.extraPlugin,
    styleImport(styleImportConfig)
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
    viteConfig?.()?.common?.extraPlugin,
    viteConfig?.()?.client?.extraPlugin,
    styleImport(styleImportConfig)
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
