import { resolve } from 'path'
import { exec } from 'shelljs'
import { Argv } from 'ssr-types'
import { getCwd } from 'ssr-common-utils'

import { getNormalizeArgv, morethan10 } from './utils'

const morethan = morethan10()
const spinner = require('ora')('Building')
const singleDash = ['c', 'p', 'w', 'h'].concat(morethan ? 'b' : '')
const doubleDash = ['config', 'path', 'watch', 'watchAssets', 'webpack', 'webpackPath', 'tsc', 'help'].concat(morethan ? 'builder' : '')
const build = (argv: Argv) => {
  const cwd = getCwd()
  spinner.start()
  if (morethan) {
    argv.b = argv.b || 'swc'
  } // use swc as default compiler when nestjs >=10
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
    if (!data.includes('has been deprecated')) {
      console.error(`error: ${data}`)
    }
    spinner.stop()
  })
}

export {
  build
}
