import { promises as fs } from 'fs'
import { join } from 'path'
import { isFaaS, getCwd, execPromisify } from 'ssr-server-utils'

import { Argv } from 'ssr-types'

const cwd = getCwd()

const deploy = async (argv: Argv) => {
  if (!await isFaaS(true)) {
    console.log('检测到当前为首次发布，根目录下缺少 template.yml 文件，自动创建默认 yml 文件模版')
    const ymlContent = await fs.readFile(join(cwd, './node_modules/ssr-plugin-nestjs/src/f.yml'))
    await fs.writeFile(join(cwd, './template.yml'), ymlContent)
    const bootstrapContent = await fs.readFile(join(cwd, './node_modules/ssr-plugin-nestjs/src/bootstrap.tpl'))
    await fs.writeFile(join(cwd, './bootstrap'), bootstrapContent)
  }
  try {
    if (argv.tencent) {
      await deployTencent()
    } else {
      await deployAliyun(argv)
    }
  } catch (error) {
    console.error(error)
  }
}

const deployTencent = () => {
  console.log(' Nest.js 暂不支发布到腾讯云')
}

const deployAliyun = async (argv: Argv) => {
  console.log('正在构建中...')
  const deployFC = require('@alicloud/fun/lib/commands/deploy')
  const { stdout } = await execPromisify('npx fun build')
  console.log(stdout)

  deployFC({
    assumeYes: true,
    onlyConfig: false,
    ...argv
  })
}

export {
  deploy
}
