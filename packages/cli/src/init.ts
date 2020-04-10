import { join } from 'path'
import * as inquirer from 'inquirer'
import * as Shell from 'shelljs'
import { getCwd } from 'ssr-server-utils'
import { dclone } from 'dclone'

const init = async () => {
  const cwd = getCwd()
  const spaUrl = 'https://github.com/ykfe/ssr/tree/dev/example/spa'

  const answers: any = await inquirer.prompt([{
    type: 'input',
    message: '应用名称:',
    name: 'appName',
    default: 'ssr'
  }, {
    type: 'list',
    message: '选择应用类型',
    name: 'type',
    default: 'SPA(SinglePage Web Application)',
    choices: [
      'SPA(SinglePage Web Application)'
      // 'MPA(MultiPage Application，MPA)'
    ]
  }])
  const { type, appName } = answers
  const dir = type.match('SPA') ? spaUrl : spaUrl
  await dclone({
    dir
  })
  Shell.mv(`${join(cwd, './example/spa/*')}`, `${join(cwd, `../${appName}`)}`)
}

export {
  init
}
