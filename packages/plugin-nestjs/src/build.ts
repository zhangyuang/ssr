import { resolve } from 'path'
import { exec } from 'shelljs'
import { Argv } from 'ssr-types'
import { getCwd } from 'ssr-common-utils'

import { getNormalizeArgv } from './utils'

const spinner = require('ora')('Building')
const singleDash = ['c', 'p', 'w', 'h']
const doubleDash = ['config', 'path', 'watch', 'watchAssets', 'webpack', 'webpackPath', 'tsc', 'help']
const build = (argv: Argv) => {
  const cwd = getCwd()
  spinner.start()
  const normalizeArgv = getNormalizeArgv(argv, {
    singleDash,
    doubleDash
  })
  const { stdout, stderr } = exec(`${resolve(cwd, './node_modules/.bin/nest')} build  ${normalizeArgv}`, { async: true, silent: true, env: { ...process.env, FORCE_COLOR: '1' } })
  stdout?.on('data', function (data) {
    console.log(data)
  })
  stdout?.on('end', () => {
    spinner.stop()
  })
  stderr?.on('data', function (data) {
    if (!data.includes('getMutableClone')) {
      console.error(`error: ${data}`)
    }
    spinner.stop()
  })
}

export {
  build
}
