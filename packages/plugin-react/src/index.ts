import * as WebpackChain from 'webpack-chain'
import { startClientServer, startServerBuild, startClientBuild } from 'ssr-webpack'
import { getClientWebpack, getServerWebpack } from './config'

export function reactPlugin () {
  return {
    start: async (config) => {
      const serverConfigChain = new WebpackChain()
      await startServerBuild(getServerWebpack(serverConfigChain, config), config)
      const clientConfigChain = new WebpackChain()
      await startClientServer(getClientWebpack(clientConfigChain, config), config)
    },
    build: async (config) => {
      const serverConfigChain = new WebpackChain()
      await startServerBuild(getServerWebpack(serverConfigChain, config), config)
      const clientConfigChain = new WebpackChain()
      await startClientBuild(getClientWebpack(clientConfigChain, config), config)
    }
  }
}
