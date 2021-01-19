import { provide } from '@midwayjs/faas'
import { IApiService } from '../interface'
import mock from '../mock'

@provide('ApiService')
export class ApiService implements IApiService {
  async index (): Promise<any> {
    return await Promise.resolve(mock)
  }
}
