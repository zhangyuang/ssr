import { exec } from 'child_process'
import { Argv } from 'ssr-types'
import { getNormalizeArgv } from './utils'

const spinner = require('ora')('Building')
const singleDash = ['c', 'p', 'w', 'h']
const doubleDash = ['config', 'path', 'watch', 'watchAssets', 'webpack', 'webpackPath', 'tsc', 'help']
const build = (argv: Argv) => {
  spinner.start()
  const normalizeArgv = getNormalizeArgv(argv, {
    singleDash,
    doubleDash
  })
  const { stdout, stderr } = exec(`npx nest build ${normalizeArgv}`, () => {
    spinner.stop()
  })
  stdout?.on('data', function (data) {
    console.log(data)
  })
  stderr?.on('data', function (data) {
    console.error(`error: ${data}`)
  })
}

export {
  build
}
