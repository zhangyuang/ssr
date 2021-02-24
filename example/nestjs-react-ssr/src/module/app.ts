import { Module } from '@nestjs/common'
import { AppController } from '../controller/app'
import { ApiController } from '../controller/api'
import { ApiService } from '../service/index'
import { ApiDetailService } from '../service/detail'

@Module({
  imports: [

  ],
  controllers: [AppController, ApiController],
  providers: [ApiService, ApiDetailService]
})

export class AppModule {}
