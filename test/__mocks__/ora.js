'use strict'

const ora = jest.fn(() => {
  const start = jest.fn()
  const succeed = jest.fn()
  ora.start = start
  ora.succeed = succeed
  return ora
})
module.exports = ora
