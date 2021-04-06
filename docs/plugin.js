const { midwayPlugin } = require('ssr-plugin-midway')
const { vuePlugin } = require('ssr-plugin-vue3')

module.exports = {
  serverPlugin: midwayPlugin(),
  clientPlugin: vuePlugin()
}
