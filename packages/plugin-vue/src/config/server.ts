import { join } from 'path'
import { loadConfig, nodeExternals } from 'ssr-common-utils'
import * as WebpackChain from 'webpack-chain'
import * as webpack from 'ssr-webpack4'

import { getBaseConfig } from './base'

const getServerWebpack = (chain: WebpackChain) => {
  const config = loadConfig()
  const { isDev, cwd, getOutput, chainServerConfig, whiteList, chunkName } = config
  getBaseConfig(chain, true)
  chain.devtool(isDev ? 'inline-source-map' : false)
  chain.target('node')
  chain.entry(chunkName)
    .add(require.resolve('../entry/server-entry'))
    .end()
    .output
    .path(getOutput().serverOutPut)
    .filename('[name].server.js')
    .libraryTarget('commonjs')
    .end()

  const modulesDir = [join(cwd, './node_modules')]

  chain.externals(nodeExternals({
    whitelist: whiteList,
    // externals Dir contains example/xxx/node_modules ssr/node_modules
    modulesDir
  }))

  chain.when(isDev, () => {
    chain.watch(true)
  })
  chain.plugin('serverLimit').use(webpack.optimize.LimitChunkCountPlugin, [{
    maxChunks: 1
  }])
  chainServerConfig(chain) // 合并用户自定义配置

  return chain.toConfig()
}

export {
  getServerWebpack
}
