import { Provide } from '@midwayjs/decorator'
import { IndexData } from '~/typings/data'
import mock from '../mock'

@Provide('ApiService')
export class ApiIndexService {
  async index (): Promise<IndexData> {
    return await Promise.resolve(mock)
  }
}
