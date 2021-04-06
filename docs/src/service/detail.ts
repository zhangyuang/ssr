import { Provide } from '@midwayjs/decorator'
import mock from '../mock/detail'

@Provide('ApiDetailService')
export class ApiDetailService {
  async index (id): Promise<any> {
    return await Promise.resolve(mock.data[id])
  }
}
