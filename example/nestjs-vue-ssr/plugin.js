const { nestjsPlugin } = require('ssr-plugin-nestjs')
const { vuePlugin } = require('ssr-plugin-vue')

module.exports = {
  serverPlugin: nestjsPlugin(),
  clientPlugin: vuePlugin()
}
