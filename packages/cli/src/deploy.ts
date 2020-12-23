
import { CommandHookCore, loadSpec } from '@midwayjs/fcli-command-core'
import { PackagePlugin } from '@midwayjs/fcli-plugin-package'
import { DeployPlugin } from '@midwayjs/fcli-plugin-deploy'
import { AliyunFCPlugin } from '@midwayjs/fcli-plugin-fc'
import { TencentSCFPlugin } from '@midwayjs/fcli-plugin-scf'
import { getCwd } from 'ssr-server-utils'
import { Argv } from 'ssr-types'

const deploy = async (argv: Argv) => {
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
  const cwd = getCwd()
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
  const cwd = getCwd()
  const core: any = new CommandHookCore({
    config: {
      servicePath: cwd
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
