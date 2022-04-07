import { resolve } from 'path'
import { coerce } from 'semver'
import { accessFileSync, getCwd, judgeServerFramework } from './cwd'
import { mv } from 'shelljs'

const cwd = getCwd()
export function checkForkTs () {
  try {
    const framework = judgeServerFramework()
    if (framework === 'ssr-plugin-midway') return
    const fork = resolve(cwd, '../../node_modules/fork-ts-checker-webpack-plugin')
    const nestCli = resolve(cwd, '../../node_modules/@nestjs/cli/node_modules')
    const forkVersion = require(resolve(fork, './package.json')).version
    if (
      // @ts-expect-error
      coerce(forkVersion)?.major >= 7 &&
      !accessFileSync(resolve(nestCli, './fork-ts-checker-webpack-plugin'))) {
      mv(fork, nestCli)
    }
  } catch (error) {

  }
}

checkForkTs()
