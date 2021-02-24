import { NestFactory } from '@nestjs/core'
import { initialSSRDevProxy } from 'ssr-server-utils'
import { AppModule } from './module/app'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)
  initialSSRDevProxy(app, {
    express: true
  })
  await app.listen(3000)
}
// eslint-disable-next-line
bootstrap()
