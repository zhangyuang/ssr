import { Controller, Get, Param } from '@nestjs/common'
import { ApiService } from '../service/index'
import { ApiDetailService } from '../service/detail'

@Controller('/api')
export class ApiController {
  constructor (private readonly apiService: ApiService, private readonly apiDetailService: ApiDetailService) {}

  @Get('/index')
  async getIndexData (): Promise<any> {
    return await this.apiService.index()
  }

  @Get('/detail/:id')
  async getDetailData (@Param() params) {
    const data = await this.apiDetailService.index(params.id)
    return data
  }
}
