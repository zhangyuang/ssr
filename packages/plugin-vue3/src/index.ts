import { loadConfig } from 'ssr-server-utils'

const { isVite, optimize } = loadConfig()
const spinner = require('ora')('Building')

export function clientPlugin () {
  return {
    name: 'plugin-vue3',
    start: async () => {
      if (isVite) {
        const { viteStart } = await import('./tools/vite')
        await viteStart()
      } else {
        const { webpackStart } = await import('./tools/webpack')
        await webpackStart()
      }
    },
    build: async () => {
      if (isVite) {
        const { viteBuild } = await import('./tools/vite')
        await viteBuild()
      } else {
        if (optimize) {
          spinner.start()
          const { viteBuildClient } = await import('./tools/vite')
          await viteBuildClient()
          spinner.stop()
        }
        // const { webpackBuild } = await import('./tools/webpack')
        // await webpackBuild()
      }
    }
  }
}

export * from './tools/vite'
export * from './types'
