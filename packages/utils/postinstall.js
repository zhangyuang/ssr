const { accessSync } = require('fs')
const { resolve } = require('path')

const accessFileSync = (file) => {
  let res = true
  try {
    accessSync(file)
  } catch (error) {
    res = false
  }
  return res
}
const compatible = resolve(__dirname, './cjs/server/compatible.js')
if (accessFileSync(compatible)) {
  require(compatible)
}
