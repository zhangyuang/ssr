
import { CommandHookCore, loadSpec } from '@midwayjs/fcli-command-core'
import { PackagePlugin } from '@midwayjs/fcli-plugin-package'
import { DeployPlugin } from '@midwayjs/fcli-plugin-deploy'
import { AliyunFCPlugin } from '@midwayjs/fcli-plugin-fc'
import { TencentSCFPlugin } from '@midwayjs/fcli-plugin-scf'
import { getCwd, isFaaS, logRed } from 'ssr-server-utils'
import { Argv } from 'ssr-types'

const deploy = async (argv: Argv) => {
  if (!isFaaS()) {
    logRed('缺少 f.yml 文件 deploy 功能只支持 FaaS 场景下发布')
    logRed('我们提供传统 Node.js 框架，如 express koa egg midway 快速迁移至 Serverless 发布能力。详细做法请参考 https://www.yuque.com/midwayjs/faas/migrate_egg 或扫码进群了解')
    return
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
