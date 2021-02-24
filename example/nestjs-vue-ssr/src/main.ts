import { join } from 'path'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { initialSSRDevProxy } from 'ssr-server-utils'

import { AppModule } from './module/app'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  initialSSRDevProxy(app, {
    express: true
  })
  app.useStaticAssets(join(process.cwd(), './build'))

  await app.listen(3000)
}
// eslint-disable-next-line
bootstrap()
