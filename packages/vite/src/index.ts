import type * as VuePlugin from "@vitejs/plugin-vue/dist";
import type * as VueJSXPlugin from "@vitejs/plugin-vue-jsx/dist";
import type * as ReactOXCPlugin from "@vitejs/plugin-react-oxc";
// import type * as ReactPlugin from '@vitejs/plugin-react'
import { resolve } from "path";
import babel from "@rollup/plugin-babel";
import { visualizer } from "rollup-plugin-visualizer";
import {
  getCwd,
  getDefineEnv,
  getOutputPublicPath,
  loadConfig,
  defaultExternal,
  loadModuleFromFramework,
  judgeFramework,
  getBuildEntry,
} from "ssr-common-utils";
import { build as viteBuild, type PluginOption, type InlineConfig } from "vite/dist/node/index.js";
import {
  AndDesignVueResolve,
  AntdResolve,
  ElementPlusResolve,
  NutuiResolve,
  VantResolve,
  createStyleImportPlugin,
} from "ssr-vite-plugin-style-import";
import { getBabelOptions } from "./babel";
import {
  commonConfig,
  asyncOptimizeChunkPlugin,
  manifestPlugin,
  rollupOutputOptions,
} from "./build-plugins";

const framework = judgeFramework();
const isReact = framework === "ssr-plugin-react";
const isVue3 = framework === "ssr-plugin-vue3";

const { getOutput, viteConfig, supportOptinalChaining, isDev, define, chunkName, whiteList } =
  loadConfig();
const { clientOutPut, serverOutPut } = getOutput();

let vuePlugin: typeof VuePlugin.default | undefined;
let vueJSXPlugin: typeof VueJSXPlugin.default | undefined;
// let reactPlugin: typeof ReactPlugin.default | undefined
let reactOXCPlugin: typeof ReactOXCPlugin.default | undefined;
if (isVue3) {
  vuePlugin = require(loadModuleFromFramework("@vitejs/plugin-vue"));
  vueJSXPlugin = require(loadModuleFromFramework("@vitejs/plugin-vue-jsx"));
}
if (isReact) {
  // reactPlugin = require(loadModuleFromFramework('@vitejs/plugin-react'))
  reactOXCPlugin = require(loadModuleFromFramework("@vitejs/plugin-react-oxc")).default;
}
const styleImportConfig = {
  include: ["**/*.vue", "**/*.ts", "**/*.js", "**/*.tsx", "**/*.jsx", /chunkName/],
  resolves: [
    AndDesignVueResolve(),
    VantResolve(),
    ElementPlusResolve(),
    NutuiResolve(),
    AntdResolve(),
  ],
};

// Framework-specific server plugins
let frameworkServerPlugins: PluginOption[] = [];

const commonServerPlugins = [
  createStyleImportPlugin(styleImportConfig),
  viteConfig?.()?.common?.extraPlugin,
  viteConfig?.()?.server?.extraPlugin,
];

if (isVue3) {
  frameworkServerPlugins = frameworkServerPlugins.concat(
    vuePlugin!(viteConfig?.()?.server?.defaultPluginOptions),
    vueJSXPlugin!(),
  );
  frameworkServerPlugins = frameworkServerPlugins.concat(
    createStyleImportPlugin(styleImportConfig),
    !supportOptinalChaining &&
      babel({
        babelHelpers: "bundled",
        plugins: [
          "@babel/plugin-proposal-optional-chaining",
          "@babel/plugin-proposal-nullish-coalescing-operator",
        ],
        exclude: /node_modules|\.(css|less|sass)/,
        extensions: [".vue", ".ts", ".tsx", ".js"],
      }),
  );
} else if (isReact) {
  frameworkServerPlugins = frameworkServerPlugins.concat(
    // reactPlugin!({
    // 	...viteConfig?.()?.server?.defaultPluginOptions,
    // 	jsxRuntime: 'automatic',
    // 	...babelOptions
    // })
    reactOXCPlugin!({
      ...viteConfig?.()?.server?.defaultPluginOptions,
    }),
  );
}

const serverPlugins: PluginOption[] = [...frameworkServerPlugins, ...commonServerPlugins];

const { server: serverEntry, client: clientEntry } = getBuildEntry();

export const serverConfig: InlineConfig = {
  ...commonConfig("server"),
  ...viteConfig?.().server?.otherConfig,
  ssr: {
    external: defaultExternal.concat(viteConfig?.()?.server?.externals ?? []),
    noExternal: whiteList,
  },
  plugins: viteConfig?.()?.server?.processPlugin?.(serverPlugins) ?? serverPlugins,
  build: {
    minify: false,
    ...viteConfig?.().server?.otherConfig?.build,
    ssr: serverEntry,
    outDir: serverOutPut,
    rolldownOptions: {
      ...viteConfig?.().server?.otherConfig?.build?.rollupOptions,
      input: isDev ? clientEntry : serverEntry, // setting prebundle list by client-entry in dev
      output: {
        entryFileNames: `${chunkName}.server.js`,
      },
    },
  },
  define: {
    ...getDefineEnv(),
    ...viteConfig?.().server?.otherConfig?.define,
    __isBrowser__: false,
    ...define?.base,
    ...define?.server,
  },
};
// Framework-specific client plugins
let frameworkClientPlugins: PluginOption[] = [];
const commonClientPlugins = [
  createStyleImportPlugin(styleImportConfig),
  viteConfig?.()?.common?.extraPlugin,
  viteConfig?.()?.client?.extraPlugin,
];
if (isVue3) {
  frameworkClientPlugins = [
    vuePlugin!(viteConfig?.()?.client?.defaultPluginOptions),
    vueJSXPlugin!(),
  ];
} else if (isReact) {
  frameworkClientPlugins = [
    // reactPlugin!({
    // 	...viteConfig?.()?.client?.defaultPluginOptions,
    // 	jsxRuntime: 'automatic',
    // 	...babelOptions
    // })
    reactOXCPlugin!({
      ...viteConfig?.()?.client?.defaultPluginOptions,
    }),
  ];
}

const clientPlugins: PluginOption[] = [...frameworkClientPlugins, ...commonClientPlugins];
const analyzePlugin = process.env.GENERATE_ANALYSIS
  ? visualizer({ filename: resolve(getCwd(), "./build/stat.html"), open: true })
  : null;
export const clientConfig: InlineConfig = {
  ...commonConfig("client"),
  ...viteConfig?.().client?.otherConfig,
  base: isDev ? "/" : getOutputPublicPath(),
  plugins: viteConfig?.()?.client?.processPlugin?.(clientPlugins) ?? clientPlugins,
  build: {
    minify: !process.env.NOMINIFY,
    ...viteConfig?.().client?.otherConfig?.build,
    ssrManifest: true,
    outDir: clientOutPut,
    rolldownOptions: {
      ...viteConfig?.().client?.otherConfig?.build?.rollupOptions,
      input: clientEntry,
      output: rollupOutputOptions(),
      plugins: [
        asyncOptimizeChunkPlugin(),
        manifestPlugin(),
        ...(isVue3
          ? getBabelOptions({
              babel,
            })
          : []),
        analyzePlugin,
      ],
    },
  },
  define: {
    ...getDefineEnv(),
    ...viteConfig?.().client?.otherConfig?.define,
    __isBrowser__: true,
    ...define?.base,
    ...define?.client,
  },
};

export const viteBuildClient = async () => {
  await viteBuild({
    ...clientConfig,
    mode: process.env.VITEMODE ?? "production",
  }).catch((_) => {});
};
export const viteBuildServer = async () => {
  await viteBuild({ ...serverConfig, mode: process.env.VITEMODE ?? "production" });
};

export const start = async () => {
  //
};

export const build = async () => {
  await viteBuild({ ...clientConfig, mode: process.env.VITEMODE ?? "production" });
  await viteBuild({ ...serverConfig, mode: process.env.VITEMODE ?? "production" });
};
