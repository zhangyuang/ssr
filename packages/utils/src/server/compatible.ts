import { resolve } from 'path'
import { coerce } from 'semver'
import { accessFileSync, judgeServerFramework, getCwd } from './cwd'
import { mv } from 'shelljs'

export function checkForkTs () {
  try {
    const framework = judgeServerFramework()
    if (framework === 'ssr-plugin-midway') return
    const cwd = getCwd()
    const userCwd = cwd.slice(0, cwd.indexOf('node_modules'))
    const fork = resolve(userCwd, './node_modules/fork-ts-checker-webpack-plugin')
    const forkPackage = resolve(fork, './package.json')
    const nestCli = resolve(userCwd, './node_modules/@nestjs/cli/node_modules')
    const forkVersion = require(forkPackage).version
    if (
      coerce(forkVersion)!.major >= 7 &&
      !accessFileSync(resolve(nestCli, './fork-ts-checker-webpack-plugin'))) {
      mv(fork, nestCli)
    }
  } catch (error) {

  }
}

checkForkTs()
