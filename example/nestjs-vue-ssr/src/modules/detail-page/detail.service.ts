import { Injectable } from '@nestjs/common'
import mock from './detail.mock'

@Injectable()
export class ApiDetailService {
  async index (id): Promise<any> {
    return await Promise.resolve(mock.data[id])
  }
}
