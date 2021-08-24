// 以下为默认生成的 Vite Config 配置，为了确保应用正确运行请不要删除默认配置中的任何代码

const { join } = require('path')
const reactRefresh = require('@vitejs/plugin-react-refresh')
// 保证双端用的是同一版本的 hash 算法
const genericNames = require('ssr-server-utils/node_modules/generic-names')

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
  css: {
    modules: {
      generateScopedName: function (name, filename, css) {
        // 对齐 css-loader 与 postcss-modules 生成 hash 方式, 不要修改
        return genericNames('[name]__[local]___[hash:base64:5]', {
          context: process.cwd()
        })(name, filename)
      }
    }
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
