import { join } from 'path'
import { loadConfig, nodeExternals, loadModuleFromFramework } from 'ssr-server-utils'
import * as WebpackChain from 'webpack-chain'
import * as webpack from 'webpack'
import { getBaseConfig } from './base'

const getServerWebpack = (chain: WebpackChain) => {
  const config = loadConfig()
  const { isDev, cwd, getOutput, chainServerConfig, whiteList, chunkName } = config
  const shouldUseSourceMap = isDev || Boolean(process.env.GENERATE_SOURCEMAP)
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

  const modulesDir = [join(cwd, './node_modules')]
  chain.externals(nodeExternals({
    whitelist: whiteList,
    // externals Dir contains example/xxx/node_modules ssr/node_modules
    modulesDir
  }))
  if (!isDev) {
    chain.optimization.minimizer('terser')
      .use(loadModuleFromFramework('terser-webpack-plugin'), [{
        terserOptions: {
          keep_fnames: true
        },
        extractComments: false,
        parallel: true,
        cache: true,
        sourceMap: shouldUseSourceMap
      }])
  }
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
