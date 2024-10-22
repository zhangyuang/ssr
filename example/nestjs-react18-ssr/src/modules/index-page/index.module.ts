import { Module } from '@nestjs/common'
import { ApiController } from './api.controller'
import { AppController } from './index.controller'
import { ApiService } from './index.service'

@Module({
	imports: [],
	controllers: [AppController, ApiController],
	providers: [ApiService]
})
export class indexModule {}
