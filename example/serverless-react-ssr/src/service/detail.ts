import { provide } from '@midwayjs/faas'
import { IApiDetailService } from '../interface/detail'
import mock from '../mock/detail'

@provide('ApiDetailService')
export class ApiService implements IApiDetailService {
  async index (id): Promise<any> {
    return await Promise.resolve(mock.data[id])
  }
}
