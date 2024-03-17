import { promises as fs } from 'fs'
import { join } from 'path'
import { getCwd, isFaaS, judgeVersion, logGreen, accessFile } from 'ssr-common-utils'
import { Argv } from 'ssr-types'

const cwd = getCwd()

const deploy = async (argv: Argv) => {
  if (!await isFaaS()) {
    logGreen('f.yml is not found, create default template')
    let ymlContent: Buffer
    if (judgeVersion(require(join(cwd, './package.json')).dependencies['@midwayjs/decorator'])?.major === 2) {
      ymlContent = await fs.readFile(join(cwd, './node_modules/ssr-plugin-midway/src/f.yml'))
    } else {
      ymlContent = await fs.readFile(join(cwd, './node_modules/ssr-plugin-midway/src/f.koa.yml'))
    }
    await fs.writeFile(join(cwd, './f.yml'), ymlContent)
  }

  logGreen('If you find some problems when deploy, see http://doc.ssr-fc.com/docs/features$faq#Serverless%20%E5%8F%91%E5%B8%83%E5%A4%B1%E8%B4%A5')
  const { cli } = require('@midwayjs/cli/bin/cli')
  if (await accessFile(join(cwd, './package-lock.json'))) {
    process.env.NPM_CLIENT = 'npm'
  }
  if (await accessFile(join(cwd, './yarn.lock'))) {
    process.env.NPM_CLIENT = 'yarn'
  }
  if (await accessFile(join(cwd, './pnpm-lock.yaml'))) {
    process.env.NPM_CLIENT = 'pnpm'
  }
  argv._[0] = 'deploy'
  await cli(argv)
}

export {
  deploy
}
