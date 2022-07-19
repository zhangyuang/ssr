import { loadConfig, writeEmitter } from 'ssr-server-utils'

const { isVite, optimize } = loadConfig()
const spinner = require('ora')('Building')

export function clientPlugin () {
  return {
    name: 'plugin-react',
    start: async () => {
      if (isVite) {
        const { viteStart } = await import('./tools/vite')
        await viteStart()
      } else {
        if (optimize) {
          writeEmitter.on('writeEnd', async () => {
            process.env.NODE_ENV = 'development'
            spinner.stop()
            const { webpackStart } = await import('./tools/webpack')
            await webpackStart()
          })
          spinner.start()
          const { viteBuildClient } = await import('./tools/vite')
          await viteBuildClient()
        } else {
          const { webpackStart } = await import('./tools/webpack')
          await webpackStart()
        }
      }
    },
    build: async () => {
      if (isVite) {
        const { viteBuild } = await import('./tools/vite')
        await viteBuild()
      } else {
        if (optimize) {
          writeEmitter.on('writeEnd', async () => {
            spinner.stop()
            const { webpackBuild } = await import('./tools/webpack')
            await webpackBuild()
          })
          spinner.start()
          const { viteBuildClient } = await import('./tools/vite')
          await viteBuildClient()
        } else {
          const { webpackBuild } = await import('./tools/webpack')
          await webpackBuild()
        }
      }
    }
  }
}

export * from './tools/vite'
