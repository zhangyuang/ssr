import { Controller, Get } from '@nestjs/common'
import { ApiService } from './index.service'

@Controller('/api')
export class ApiController {
  constructor (private readonly apiService: ApiService) {}

  @Get('/index')
  async getIndexData (): Promise<any> {
    return await this.apiService.index()
  }
}
