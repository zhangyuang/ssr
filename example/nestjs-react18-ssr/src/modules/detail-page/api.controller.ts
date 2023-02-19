import { Controller, Get, Param } from '@nestjs/common'
import { ApiDetailService } from './detail.service'

@Controller('/api')
export class ApiController {
  constructor (private readonly apiDetailService: ApiDetailService) {}

  @Get('/detail/:id')
  async getDetailData (@Param() params) {
    const data = await this.apiDetailService.index(params.id)
    return data
  }
}
