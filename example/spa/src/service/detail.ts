import { provide } from '@midwayjs/faas'
import { IApiDetailService } from '../interface/detail'
import mock from '../mock/detail'

@provide('ApiDetailService')
export class ApiService implements IApiDetailService {

  index (id): Promise<any> {
    return Promise.resolve(mock.data[id])
  }
}
