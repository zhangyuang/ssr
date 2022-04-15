import { build, UserConfig } from 'vite'
import { loadConfig, chunkNamePlugin, rollupOutputOptions, manifestPlugin, commonConfig, asyncOptimizeChunkPlugin, getOutputPublicPath } from 'ssr-server-utils'
import vuePlugin from '@vitejs/plugin-vue'
import vueJSXPlugin from '@vitejs/plugin-vue-jsx'
import babel from '@rollup/plugin-babel'
import styleImport, { AndDesignVueResolve, VantResolve, ElementPlusResolve, NutuiResolve, AntdResolve } from 'vite-plugin-style-import'

const { getOutput, prefix, publicPath, vue3ServerEntry, vue3ClientEntry, viteConfig, supportOptinalChaining, isDev, define, babelOptions } = loadConfig()
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
    vuePlugin(viteConfig?.()?.server?.defaultPluginOptions),
    vueJSXPlugin(),
    viteConfig?.()?.common?.extraPlugin,
    viteConfig?.()?.server?.extraPlugin,
    styleImport(styleImportConfig),
    !supportOptinalChaining && babel({
      babelHelpers: 'bundled',
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator'
      ],
      exclude: /node_modules|\.(css|less|sass)/,
      extensions: ['.vue', '.ts', '.tsx', '.js']
    }),
    babelOptions && babel({
      ...babelOptions
    })
  ],
  build: {
    ssr: vue3ServerEntry,
    outDir: serverOutPut,
    rollupOptions: {
      input: isDev ? vue3ClientEntry : vue3ServerEntry, // setting prebundle list by client-entry in dev
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

// 配置了 publicPath 则使用 getOutputPublicPath，否则使用 prefix
const clientBase = publicPath ? getOutputPublicPath() : prefix
const clientConfig: UserConfig = {
  ...commonConfig(),
  base: isDev ? '/' : clientBase,
  plugins: [
    vuePlugin(viteConfig?.()?.client?.defaultPluginOptions),
    vueJSXPlugin(),
    viteConfig?.()?.common?.extraPlugin,
    viteConfig?.()?.client?.extraPlugin,
    styleImport(styleImportConfig),
    babelOptions && babel({
      ...babelOptions
    })
  ],
  build: {
    ssrManifest: true,
    outDir: clientOutPut,
    rollupOptions: {
      input: vue3ClientEntry,
      output: rollupOutputOptions,
      plugins: [chunkNamePlugin(), asyncOptimizeChunkPlugin(), manifestPlugin()]
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
