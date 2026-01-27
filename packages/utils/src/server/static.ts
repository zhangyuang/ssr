const nameSpaceBuiltinModules = ["node:stream"];

const reactRefreshFragment = ` import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true`;

const remInitial =
  "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'";
// module need be external
const defaultExternal = [
  "@vue/server-renderer",
  "ssr-serialize-javascript",
  "react",
  "react-dom",
  "react-dom/server",
  "react-dom/server.node",
  "vue",
  "vue-router",
  "vuex",
  "pinia",
  "ssr-react-dom",
  "ssr-server-utils",
  "ssr-deepclone",
  "ssr-hoc-react",
  "ssr-common-utils",
  "vite",
  "axios",
];

const ssrPackages = [
  "ssr",
  "ssr-plugin-vue3",
  "ssr-plugin-react",
  "ssr-plugin-vue",
  "ssr-types",
  "ssr-common-utils",
  "ssr-core-vue",
  "ssr-hoc-vue3",
  "ssr-webpack",
  "ssr-vite",
  "ssr-rspack",
  "ssr-core-react",
  "ssr-core-vue3",
  "ssr-plugin-midway",
  "ssr-plugin-nestjs",
  "ssr-hoc-react",
  "ssr-core",
];

const vendorList = [
  "vue",
  "vuex",
  "vue-demi",
  "vue-router",
  "react",
  "react-router",
  "react-router-dom",
  "react-dom",
  "@vue",
  "ssr-hoc-react",
  "ssr-client-utils",
  "ssr-common-utils",
  "pinia",
  "@babel/runtime",
  "ssr-plugin-vue3",
  "ssr-plugin-vue",
  "ssr-plugin-react",
  "react/jsx-runtime",
  "path-to-regexp",
  "plugin-vue:export-helper",
  "@vue/devtools-api",
  "ssr-hoc-vue3",
  "ssr-hoc-vue",
  "vite/preload-helper",
  "hoc-vue3",
];
export {
  reactRefreshFragment,
  vendorList,
  remInitial,
  defaultExternal,
  ssrPackages,
  nameSpaceBuiltinModules,
};
