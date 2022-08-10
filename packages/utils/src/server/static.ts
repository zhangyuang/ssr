const reactRefreshFragment = ` import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true`

const remInitial = "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'"

const defaultExternal = ['ssr-serialize-javascript', 'ssr-server-utils', 'ssr-deepclone', 'ssr-hoc-react', 'ssr-common-utils', 'vite', 'axios']

export {
  reactRefreshFragment,
  remInitial,
  defaultExternal
}
