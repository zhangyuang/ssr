
export function vuePlugin () {
  return {
    name: 'plugin-vue3',
    start: async () => {
      if (process.env['BUILD_TOOL'] === 'vite') {
        const { viteStart } = await import('./tools/vite')
        await viteStart()
      } else {
        const { webpackStart } = await import('./tools/webpack')
        await webpackStart()
      }
    },
    build: async () => {
      if (process.env['BUILD_TOOL'] === 'vite') {
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
