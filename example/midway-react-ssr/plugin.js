const { midwayPlugin } = require('ssr-plugin-midway')
const { reactPlugin } = require('ssr-plugin-react')

module.exports = {
  serverPlugin: midwayPlugin(),
  clientPlugin: reactPlugin()
}
