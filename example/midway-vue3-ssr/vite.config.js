const vuePlugin = require('@vitejs/plugin-vue')
const { join } = require('path')

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  plugins: [
    vuePlugin()
  ],
  // optimizeDeps: {
  //   include: ['ssr-temporary-routes']
  // },
  define: {
    __isBrowser__: true
  },
  optimizeDeps: { include: ['ssr-temporary-routes'] },
  resolve: {
    alias: {
      '@': join(process.cwd(), './web'),
      '~': join(process.cwd(), './node_modules')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    force: true
  },
  ssr: {
    noExternal: ['ssr-temporary-routes']
  }

}
