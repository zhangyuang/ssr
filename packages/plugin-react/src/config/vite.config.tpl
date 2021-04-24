// 以下为默认生成的 Vite Config 配置，为了确保应用正确运行请不要删除默认配置中的任何代码

const { join } = require('path')
const reactRefresh = require('@vitejs/plugin-react-refresh')

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-loadable']
  },
  plugins: [
    reactRefresh()
  ],
  define: {
    __isBrowser__: true
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  },
  resolve: {
    alias: {
      '@': join(process.cwd(), './web')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
}
