const { accessSync } = require('fs')
const { resolve } = require('path')

if (process.env.SHOWLOG) {
  console.log('execute postinstall compatible')
}
const accessFileSync = (file) => {
  let res = true
  try {
    accessSync(file)
  } catch (error) {
    res = false
  }
  return res
}
const compatible = resolve(__dirname, './cjs/compatible.js')
if (accessFileSync(compatible)) {
  require(compatible)
}
