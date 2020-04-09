import * as webpack from 'webpack'
import * as webpackDevServer from 'webpack-dev-server'
import { getClientWebpack, webpackDevServerConfig, port, host }from 'ssr-webpack'

const startClientServer = (argv) => {
  return new Promise((resolve, reject) => {
    const clientConfig = getClientWebpack(argv)
    const compiler = webpack(clientConfig)
    const server = new webpackDevServer(compiler, webpackDevServerConfig)
    compiler.hooks.done.tap('WebpackDevMiddleware', (stats) => {
      // Do the stuff in nextTick, because bundle may be invalidated
      // if a change happened while compiling
      resolve()
    })
    server.listen(port, host)
  })
}

const startClientBuild = async () => {
  // const ora = require('ora')('正在构建')
  // const outputPath = clientConfig.output.path
  // ora.start()
  // const stats: any = await webpackWithPromise(clientConfig)
  // console.log(stats.toString({
  //   assets: true,
  //   colors: true,
  //   hash: true,
  //   timings: true,
  //   version: true,
  //   warnings: false
  // }))

  // ora.succeed()
}

export {
  startClientServer,
  startClientBuild
}
