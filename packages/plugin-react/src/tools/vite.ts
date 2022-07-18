import { build, UserConfig } from 'vite'
import {
  loadConfig, chunkNamePlugin, rollupOutputOptions, manifestPlugin, commonConfig,
  asyncOptimizeChunkPlugin, getOutputPublicPath, generateMapPlugin
} from 'ssr-server-utils'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin, AndDesignVueResolve, VantResolve, ElementPlusResolve, NutuiResolve, AntdResolve } from 'ssr-vite-plugin-style-import'
const { getOutput, reactServerEntry, reactClientEntry, viteConfig, supportOptinalChaining, isDev, define, babelOptions, optimize } = loadConfig()
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
  ...viteConfig?.().server?.otherConfig,
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
    createStyleImportPlugin(styleImportConfig)
  ],
  esbuild: {
    ...viteConfig?.().server?.otherConfig?.esbuild,
    keepNames: true,
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    ...viteConfig?.().server?.otherConfig?.build,
    ssr: reactServerEntry,
    outDir: serverOutPut,
    rollupOptions: {
      ...viteConfig?.().server?.otherConfig?.build?.rollupOptions,
      input: isDev ? reactClientEntry : reactServerEntry, // setting prebundle list by client-entry in dev
      output: {
        entryFileNames: 'Page.server.js'
      }
    }
  },
  define: {
    ...viteConfig?.().server?.otherConfig?.define,
    __isBrowser__: false,
    ...define?.base,
    ...define?.server
  }
}
const clientConfig: UserConfig = {
  ...commonConfig(),
  ...viteConfig?.().client?.otherConfig,
  base: isDev ? '/' : getOutputPublicPath(),
  esbuild: {
    ...viteConfig?.().client?.otherConfig?.esbuild,
    keepNames: true,
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  optimizeDeps: {
    ...viteConfig?.().client?.otherConfig?.optimizeDeps,
    include: ['react-router'].concat(...viteConfig?.().client?.otherConfig?.optimizeDeps?.include ?? []),
    exclude: ['ssr-hoc-react'].concat(...viteConfig?.().client?.otherConfig?.optimizeDeps?.exclude ?? [])
  },
  plugins: [
    react({
      ...viteConfig?.()?.client?.defaultPluginOptions,
      jsxRuntime: 'classic',
      ...babelOptions
    }),
    viteConfig?.()?.common?.extraPlugin,
    viteConfig?.()?.client?.extraPlugin,
    createStyleImportPlugin(styleImportConfig)
  ],
  build: {
    ...viteConfig?.().client?.otherConfig?.build,
    ...(optimize ? { write: false } : {}),
    ssrManifest: true,
    outDir: clientOutPut,
    rollupOptions: {
      ...viteConfig?.().client?.otherConfig?.build?.rollupOptions,
      input: reactClientEntry,
      output: rollupOutputOptions,
      plugins: [chunkNamePlugin(), asyncOptimizeChunkPlugin(), generateMapPlugin(), optimize ? undefined : manifestPlugin()]
    }
  },
  define: {
    ...viteConfig?.().client?.otherConfig?.define,
    __isBrowser__: true,
    ...define?.base,
    ...define?.client
  }
}
const viteStart = async () => {
  //
}
const viteBuild = async () => {
  await build({ ...clientConfig, mode: 'production' })
  await build({ ...serverConfig, mode: 'production' })
}

const viteBuildClient = async () => {
  await build({ ...clientConfig, mode: 'production' }).catch(_ => {})
}
const viteBuildServer = async () => {
  await build({ ...serverConfig, mode: 'production' })
}

export {
  viteBuild,
  viteStart,
  serverConfig,
  clientConfig,
  viteBuildClient,
  viteBuildServer
}
