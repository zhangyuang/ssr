const { faasPlugin } = require('ssr-plugin-faas')
const { vuePlugin } = require('ssr-plugin-vue')
module.exports = {
  serverPlugin: faasPlugin(),
  fePlugin: vuePlugin()
}
