import { promises as fs } from 'fs'
import { join } from 'path'
import { getCwd, isFaaS } from 'ssr-server-utils'
import { Argv } from 'ssr-types'

const cwd = getCwd()

const deploy = async (argv: Argv) => {
  if (!await isFaaS()) {
    console.log('检测到当前为首次发布，根目录下缺少 f.yml 文件，自动创建默认 yml 文件模版')
    const ymlContent = await fs.readFile(join(cwd, './node_modules/ssr-plugin-midway/src/f.yml'))
    await fs.writeFile(join(cwd, './f.yml'), ymlContent)
  }
  console.log('发布过程中遇到发布失败超时/包体积过大等问题请查看文档 http://doc.ssr-fc.com/docs/features$faq#Serverless%20%E5%8F%91%E5%B8%83%E5%A4%B1%E8%B4%A5')
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
  const { CommandHookCore, loadSpec } = await import('@midwayjs/fcli-command-core')
  const { PackagePlugin } = await import('@midwayjs/fcli-plugin-package')
  const { DeployPlugin } = await import('@midwayjs/fcli-plugin-deploy')
  const { TencentSCFPlugin } = await import('@midwayjs/fcli-plugin-scf')
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
  const { AliyunFCPlugin } = await import('@midwayjs/fcli-plugin-fc')
  const { CommandHookCore, loadSpec } = await import('@midwayjs/fcli-command-core')
  const { PackagePlugin } = await import('@midwayjs/fcli-plugin-package')
  const { DeployPlugin } = await import('@midwayjs/fcli-plugin-deploy')
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
