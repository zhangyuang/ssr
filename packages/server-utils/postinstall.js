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

if (accessFileSync(resolve('./cjs/compatible.js'))) {
  require(resolve('./cjs/compatible.js'))
}
