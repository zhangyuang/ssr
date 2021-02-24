const { nestjsPlugin } = require('ssr-plugin-nestjs')
const { reactPlugin } = require('ssr-plugin-react')

module.exports = {
  serverPlugin: nestjsPlugin(),
  clientPlugin: reactPlugin()
}
