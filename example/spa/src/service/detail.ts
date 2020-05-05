import { provide } from '@midwayjs/faas'
import { IApiService } from '../interface/api'
import mock from '../mock'

@provide('ApiService')
export class ApiService implements IApiService {

  index (): Promise<any> {
    return Promise.resolve(mock)
  }
}
