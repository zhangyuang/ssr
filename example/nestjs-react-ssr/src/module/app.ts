import { join } from 'path'
import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { AppController } from '../controller/app'
import { ApiController } from '../controller/api'
import { ApiService } from '../service/index'
import { ApiDetailService } from '../service/detail'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), './build')
    })
  ],
  controllers: [AppController, ApiController],
  providers: [ApiService, ApiDetailService]
})

export class AppModule {}
