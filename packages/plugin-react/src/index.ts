import * as WebpackChain from 'webpack-chain'
import { startClientServer, startServerBuild } from 'ssr-webpack'
import { getClientWebpack, getServerWebpack } from './config'

export function reactPlugin () {
  return {
    start: async (config) => {
      config.chain = new WebpackChain()
      await startServerBuild(getServerWebpack(config), config)
      config.chain = new WebpackChain()
      await startClientServer(getClientWebpack(config), config)
    }
  }
}
