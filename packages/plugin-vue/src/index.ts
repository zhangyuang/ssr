import * as WebpackChain from 'webpack-chain'

export function vuePlugin () {
  return {
    name: 'plugin-vue',
    start: async () => {
      // 本地开发的时候要做细致的依赖分离， Vite 场景不需要去加载 Webpack 构建客户端应用所需的模块
      const { startServerBuild } = await import('ssr-webpack/cjs/server/server')
      const { getServerWebpack } = await import('./config/server')
      const serverConfigChain = new WebpackChain()
      if (process.env.BUILD_TOOL === 'vite') {
        await startServerBuild(getServerWebpack(serverConfigChain))
      } else {
        const { startClientServer } = await import('ssr-webpack')
        const { getClientWebpack } = await import('./config')
        const clientConfigChain = new WebpackChain()
        await Promise.all([startServerBuild(getServerWebpack(serverConfigChain)), startClientServer(getClientWebpack(clientConfigChain))])
      }
    },
    build: async () => {
      const { startServerBuild, startClientBuild } = await import('ssr-webpack')
      const { getClientWebpack, getServerWebpack } = await import('./config')
      const serverConfigChain = new WebpackChain()
      const clientConfigChain = new WebpackChain()
      await Promise.all([startServerBuild(getServerWebpack(serverConfigChain)), startClientBuild(getClientWebpack(clientConfigChain))])
    }
  }
}
