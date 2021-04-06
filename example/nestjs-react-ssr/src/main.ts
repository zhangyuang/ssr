import { join } from 'path'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { initialSSRDevProxy, loadConfig } from 'ssr-server-utils'

import { AppModule } from './app.module'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  initialSSRDevProxy(app, {
    express: true
  })
  app.useStaticAssets(join(process.cwd(), './build'))

  const config = loadConfig()
  await app.listen(config.serverPort)
}

bootstrap().catch(err => {
  console.log(err)
  process.exit(1)
})
