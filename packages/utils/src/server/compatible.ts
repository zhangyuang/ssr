import { resolve } from 'path'
import { coerce } from 'semver'
import { accessFileSync, judgeServerFramework, getCwd } from './cwd'
import { mv } from 'shelljs'

export function checkForkTs () {
  try {
    const framework = judgeServerFramework()
    if (framework === 'ssr-plugin-midway') return
    const cwd = getCwd()
    const fork = resolve(cwd, './node_modules/fork-ts-checker-webpack-plugin/package.json')
    const nestCli = resolve(cwd, './node_modules/@nestjs/cli/node_modules')
    const forkVersion = require(fork).version
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
