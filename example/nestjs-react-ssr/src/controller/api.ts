import { Controller, Get, Param } from '@nestjs/common'
import { ApiService } from '../service/index'
import { ApiDetailService } from '../service/detail'

@Controller('/api')
export class ApiController {
  constructor (private readonly ApiService: ApiService, private readonly ApiDetailService: ApiDetailService) {}

  @Get('/index')
  async getIndexData () {
    const data = await this.ApiService.index()
    return data
  }

  @Get('/detail/:id')
  async getDetailData (@Param() params) {
    const data = await this.ApiDetailService.index(params.id)
    return data
  }
}
