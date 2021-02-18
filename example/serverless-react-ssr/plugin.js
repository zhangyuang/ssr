const { faasPlugin } = require('ssr-plugin-faas')
const { reactPlugin } = require('ssr-plugin-react')
module.exports = {
  serverPlugin: faasPlugin(),
  clientPlugin: reactPlugin()
}
