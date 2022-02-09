import { build, UserConfig } from 'vite'
import { loadConfig, chunkNamePlugin, rollupOutputOptions, manifestPlugin, commonConfig, asyncOptimizeChunkPlugin } from 'ssr-server-utils'
import react from '@vitejs/plugin-react'
import styleImport, { AndDesignVueResolve, VantResolve, ElementPlusResolve, NutuiResolve, AntdResolve } from 'vite-plugin-style-import'

const { getOutput, reactServerEntry, reactClientEntry, viteConfig, supportOptinalChaining, isDev, define, babelOptions } = loadConfig()

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
  plugins: [
    react({
      ...viteConfig?.()?.server?.defaultPluginOptions,
      jsxRuntime: 'classic',
      babel: {
        ...babelOptions,
        plugins: [
          ...babelOptions?.plugins ?? [],
          ...!supportOptinalChaining ? [
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator'
          ] : []
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
    rollupOptions: Object.assign(
      isDev ? { input: reactClientEntry } : {}, // setting prebundle list by client-entry in dev
      {
        output: {
          entryFileNames: 'Page.server.js'
        }
      }
    )
  },
  define: {
    __isBrowser__: false,
    ...viteConfig?.()?.server?.define,
    ...define?.server,
    ...define?.base
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
      jsxRuntime: 'classic',
      ...babelOptions
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
      plugins: [chunkNamePlugin(), asyncOptimizeChunkPlugin(), manifestPlugin()]
    }
  },
  define: {
    __isBrowser__: true,
    ...viteConfig?.()?.client?.define,
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
