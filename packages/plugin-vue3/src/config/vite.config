const vuePlugin = require('@vitejs/plugin-vue')
const { join } = require('path')

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  plugins: [
    vuePlugin()
  ],
  define: {
    __isBrowser__: true
  },
  resolve: {
    alias: {
      '@': join(process.cwd(), './web'),
      '~': join(process.cwd(), './node_modules')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
}
