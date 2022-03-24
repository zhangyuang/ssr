import { loadConfig } from 'ssr-server-utils'

const { isVite } = loadConfig()

export function clientPlugin () {
  return {
    name: 'plugin-vue',
    start: async () => {
      if (isVite) {
        console.log('vite ssr is not supported vue2 ref https://github.com/underfin/vite-plugin-vue2/issues/31')
      } else {
        const { webpackStart } = await import('./tools/webpack')
        await webpackStart()
      }
    },
    build: async () => {
      if (isVite) {
        console.log('vite ssr is not supported vue2 ref https://github.com/underfin/vite-plugin-vue2/issues/31')
      } else {
        const { webpackBuild } = await import('./tools/webpack')
        await webpackBuild()
      }
    }
  }
}

export * from './tools/vite'
