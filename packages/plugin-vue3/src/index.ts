import * as WebpackChain from 'webpack-chain'
import { startClientServer, startServerBuild, startClientBuild } from 'ssr-webpack'
import { getServerWebpack } from './config'

export function vuePlugin () {
  return {
    name: 'plugin-vue3',
    start: async () => {
      const serverConfigChain = new WebpackChain()
      await startServerBuild(getServerWebpack(serverConfigChain))
      if (process.env.BUILD_TOOL === 'vite') {
        return
      }
      const { getClientWebpack } = await import('./config')
      const clientConfigChain = new WebpackChain()
      await startClientServer(getClientWebpack(clientConfigChain))
    },
    build: async () => {
      const { getClientWebpack } = await import('./config')
      const serverConfigChain = new WebpackChain()
      await startServerBuild(getServerWebpack(serverConfigChain))
      const clientConfigChain = new WebpackChain()
      await startClientBuild(getClientWebpack(clientConfigChain))
    }
  }
}
