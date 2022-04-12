import { resolve } from 'path'
import { coerce } from 'semver'
import { accessFileSync, judgeServerFramework } from './cwd'
import { mv } from 'shelljs'

export function checkForkTs () {
  try {
    const framework = judgeServerFramework()
    if (framework === 'ssr-plugin-midway') return
    const fork = resolve(__dirname, '../../fork-ts-checker-webpack-plugin')
    const nestCli = resolve(__dirname, '../../@nestjs/cli/node_modules')
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
