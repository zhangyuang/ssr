import type { build as BuildType, UserConfig } from 'vite'
import { loadConfig, chunkNamePlugin, rollupOutputOptions, manifestPlugin, commonConfig } from 'ssr-server-utils'
import vuePlugin from '@vitejs/plugin-vue'
import vueJSXPlugin from '@vitejs/plugin-vue-jsx'
import babel from '@rollup/plugin-babel'
import styleImport, {
  AndDesignVueResolve,
  VantResolve,
  ElementPlusResolve,
  NutuiResolve,
  AntdResolve
} from 'vite-plugin-style-import'

const build: typeof BuildType = require('vite').build
const { getOutput, vue3ServerEntry, vue3ClientEntry, viteConfig, supportOptinalChaining, isDev } = loadConfig()
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
      extensions: ['.vue', '.ts', '.js']
    })
  ],
  build: {
    ssr: vue3ServerEntry,
    outDir: serverOutPut,
    rollupOptions: {
      input: isDev ? vue3ClientEntry : '',
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
    vueJSXPlugin(),
    viteConfig?.()?.common?.extraPlugin,
    viteConfig?.()?.client?.extraPlugin,
    styleImport(styleImportConfig)
  ],
  build: {
    ssrManifest: true,
    outDir: clientOutPut,
    rollupOptions: {
      input: vue3ClientEntry,
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
