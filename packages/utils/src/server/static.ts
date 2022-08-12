const reactRefreshFragment = ` import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true`

const remInitial = "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'"

const defaultExternal = ['ssr-serialize-javascript', 'ssr-server-utils', 'ssr-deepclone', 'ssr-hoc-react', 'ssr-common-utils', 'vite', 'axios']

const ssrPackages = [
  'ssr', 'ssr-plugin-vue3', 'ssr-plugin-react',
  'ssr-plugin-vue', 'ssr-types', 'ssr-common-utils',
  'ssr-core-vue', 'ssr-hoc-vue3', 'ssr-webpack', 'ssr-core-react',
  'ssr-core-vue3', 'ssr-plugin-midway', 'ssr-plugin-nestjs',
  'ssr-hoc-react'
]

export {
  reactRefreshFragment,
  remInitial,
  defaultExternal,
  ssrPackages
}
