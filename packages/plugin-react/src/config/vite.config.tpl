// 以下为默认生成的 Vite Config 配置，为了确保应用正确运行请不要删除默认配置中的任何代码

const { join } = require('path')
const reactRefresh = require('@vitejs/plugin-react-refresh')
const genericNames = require('generic-names')

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  plugins: [
    reactRefresh()
  ],
  define: {
    __isBrowser__: true
  },
  resolve: {
    alias: {
      '@': join(process.cwd(), './web'),
      _build: join(process.cwd(), './build')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  build: {
    rollupOptions: {
      input: './node_modules/ssr-plugin-react/esm/entry/client-entry.js'
    }
  }
}
