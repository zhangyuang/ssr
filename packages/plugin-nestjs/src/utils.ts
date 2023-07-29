import type { Argv } from 'ssr-types'
import { getCwd } from 'ssr-common-utils'
import { resolve } from 'path'

const getNormalizeArgv = (argv: Argv, options: {
  singleDash?: string[]
  doubleDash?: string[]
}) => {
  const { singleDash, doubleDash } = options
  let normalizeArgv = ''
  for (const key in argv) {
    const val = argv[key]
    if (singleDash?.includes(key)) {
      normalizeArgv += `-${key} ${typeof val === 'boolean' ? '' : val}`
    } else if (doubleDash?.includes(key)) {
      normalizeArgv += `--${key} ${typeof val === 'boolean' ? '' : val}`
    }
    normalizeArgv += ' '
  }
  if (argv.showArgs) {
    console.log(normalizeArgv)
  }
  return normalizeArgv
}

export const getNestjsVersion = () => {
  const cwd = getCwd()
  const p = require(resolve(cwd, './package.json'))
  const v = p['devDependencies']?.['@nestjs/cli']
  return v
}
export {
  getNormalizeArgv
}
