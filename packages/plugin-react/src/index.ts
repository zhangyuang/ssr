import {startClientServer, startServerBuild} from 'ssr-webpack'
import { getClientWebpack, getServerWebpack } from './config'

export function reactPlugin () {
  return {
    start: async (config) => {
      getServerWebpack(config)
      getClientWebpack(config)
      await Promise.all([startClientServer(config), startServerBuild(config)])
    }
  }
}
