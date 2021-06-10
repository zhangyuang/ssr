import { promises as fs } from 'fs'
import { join } from 'path'
import { CommandHookCore, loadSpec } from '@midwayjs/fcli-command-core'
import { PackagePlugin } from '@midwayjs/fcli-plugin-package'
import { DeployPlugin } from '@midwayjs/fcli-plugin-deploy'
import { AliyunFCPlugin } from '@midwayjs/fcli-plugin-fc'
import { TencentSCFPlugin } from '@midwayjs/fcli-plugin-scf'
import { getCwd, isFaaS } from 'ssr-server-utils'
import { Argv } from 'ssr-types'

const cwd = getCwd()

const deploy = async (argv: Argv) => {
  if (!await isFaaS()) {
    console.log('检测到当前为首次发布，根目录下缺少 f.yml 文件，自动创建默认 yml 文件模版')
    const ymlContent = await fs.readFile(join(cwd, './node_modules/ssr-plugin-midway/src/f.yml'))
    await fs.writeFile(join(cwd, './f.yml'), ymlContent)
  }
  try {
    if (argv.tencent) {
      await deployTencent()
    } else {
      await deployAliyun()
    }
  } catch (error) {
    console.error(error)
  }
}

const deployTencent = async () => {
  const core: any = new CommandHookCore({
    config: {
      servicePath: cwd
    },
    commands: ['deploy'],
    service: loadSpec(cwd),
    provider: 'tencent',
    log: console
  })
  core.addPlugin(PackagePlugin)
  core.addPlugin(DeployPlugin)
  core.addPlugin(TencentSCFPlugin)
  await core.ready()
  await core.invoke(['deploy'])
}

const deployAliyun = async () => {
  const core: any = new CommandHookCore({
    config: {
      servicePath: cwd
    },
    options: {
      yes: true
    },
    commands: ['deploy'],
    service: loadSpec(cwd),
    provider: 'aliyun',
    log: console
  })
  core.addPlugin(PackagePlugin)
  core.addPlugin(DeployPlugin)
  core.addPlugin(AliyunFCPlugin)
  await core.ready()
  await core.invoke(['deploy'])
}

export {
  deploy
}
