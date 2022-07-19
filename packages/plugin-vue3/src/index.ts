import { loadConfig, writeEmitter } from 'ssr-server-utils'

const { isVite, optimize } = loadConfig()
const spinner = require('ora')('Building')

export function clientPlugin () {
  return {
    name: 'plugin-vue3',
    start: async () => {
      return await new Promise((resolve) => {
        (async () => {
          if (isVite) {
            const { viteStart } = await import('./tools/vite')
            await viteStart()
            resolve('')
          } else {
            if (optimize) {
              writeEmitter.on('writeEnd', async () => {
                process.env.NODE_ENV = 'development'
                spinner.stop()
                const { webpackStart } = await import('./tools/webpack')
                await webpackStart()
                resolve('')
              })
              spinner.start()
              const { viteBuildClient } = await import('./tools/vite')
              await viteBuildClient()
            } else {
              const { webpackStart } = await import('./tools/webpack')
              await webpackStart()
              resolve('')
            }
          }
        })()
      })
    },
    build: async () => {
      return await new Promise((resolve) => {
        (async () => {
          if (isVite) {
            const { viteBuild } = await import('./tools/vite')
            await viteBuild()
            resolve('')
          } else {
            if (optimize) {
              writeEmitter.on('writeEnd', async () => {
                spinner.stop()
                const { webpackBuild } = await import('./tools/webpack')
                await webpackBuild()
                resolve('')
              })
              spinner.start()
              const { viteBuildClient } = await import('./tools/vite')
              await viteBuildClient()
            } else {
              const { webpackBuild } = await import('./tools/webpack')
              await webpackBuild()
              resolve('')
            }
          }
        })()
      })

    }
  }
}

export * from './tools/vite'
export * from './types'
