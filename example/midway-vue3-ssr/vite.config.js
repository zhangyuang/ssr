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
  resolve: {
    alias: {
      '@': join(process.cwd(), './web')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
}
