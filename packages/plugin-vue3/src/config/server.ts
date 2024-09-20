import { loadConfig, loadModuleFromFramework, terserConfig } from 'ssr-common-utils'
import * as WebpackChain from 'webpack-chain'
import * as webpack from 'ssr-webpack4'

import { getBaseConfig } from './base'

const getServerWebpack = (chain: WebpackChain) => {
  const config = loadConfig()
  const { isDev, getOutput, chainServerConfig, chunkName } = config

  getBaseConfig(chain, true)
  chain.target('node')
  chain.entry(chunkName)
    .add(require.resolve('../entry/server-entry'))
    .end()
    .output
    .path(getOutput().serverOutPut)
    .filename('[name].server.js')
    .libraryTarget('commonjs')
    .end()

  chain.optimization
    .minimizer('terser')
    .use(loadModuleFromFramework('terser-webpack-plugin'), [terserConfig(true)])

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
