import { loadConfig } from 'ssr-server-utils'

const { isVite } = loadConfig()

export function reactPlugin () {
  return {
    name: 'plugin-react',
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
        const { webpackBuild } = await import('./tools/webpack')
        await webpackBuild()
      }
    }
  }
}

export * from './tools/vite'
