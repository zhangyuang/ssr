import { Module } from '@nestjs/common'
import { ApiController } from './api.controller'
import { DetailController } from './detail.controller'
import { ApiDetailService } from './detail.service'

@Module({
  imports: [

  ],
  controllers: [DetailController, ApiController],
  providers: [ApiDetailService]
})

export class DetailModule {}
