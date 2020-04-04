import * as webpack from 'webpack'
import * as webpackDevServer from 'webpack-dev-server'
import { getClientWebpack }from './webapck-config/client'
import { webpackDevServerConfig, port } from './webapck-config/config'

const startClientServer = (argv) => {
  const clientConfig = getClientWebpack(argv)
  const compiler = webpack(clientConfig)
  const server = new webpackDevServer(compiler, webpackDevServerConfig)
  server.listen(port, '0.0.0.0')
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
