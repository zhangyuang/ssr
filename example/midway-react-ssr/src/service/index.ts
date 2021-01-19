import { Provide } from '@midwayjs/decorator'
import mock from '../mock'

@Provide('ApiService')
export class IndexService {
  async index (): Promise<any> {
    return await Promise.resolve(mock)
  }
}
