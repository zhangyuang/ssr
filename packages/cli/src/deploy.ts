
import { CommandHookCore, loadSpec } from '@midwayjs/fcli-command-core'
import { PackagePlugin } from '@midwayjs/fcli-plugin-package'
import { DeployPlugin } from '@midwayjs/fcli-plugin-deploy'
import { AliyunFCPlugin } from '@midwayjs/fcli-plugin-fc'
import { getCwd } from 'ssr-server-utils'

const deploy = async () => {
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
