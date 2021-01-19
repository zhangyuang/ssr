import * as webpack from 'webpack'
import { buildConfig, webpackDevServerConfig } from 'ssr-server-utils'
import { getClientWebpack } from '../config'
import { webpackPromisify } from '../utils/promisify'

const WebpackDevServer = require('webpack-dev-server-ssr')

const { port, host, webpackStatsOption } = buildConfig
const startClientServer = async () => {
  return await new Promise((resolve, reject) => {
    const clientConfig = getClientWebpack()
    const compiler = webpack(clientConfig)
    const server = new WebpackDevServer(compiler, webpackDevServerConfig)
    compiler.hooks.done.tap('WebpackDevMiddleware', (stats) => {
      // Do the stuff in nextTick, because bundle may be invalidated
      // if a change happened while compiling
      resolve()
    })
    server.listen(port, host)
  })
}

const startClientBuild = async () => {
  const clientConfig = getClientWebpack()
  const stats = await webpackPromisify(clientConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startClientServer,
  startClientBuild
}
