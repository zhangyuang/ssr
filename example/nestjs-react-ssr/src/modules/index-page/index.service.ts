import { Injectable } from '@nestjs/common'
import { IndexData } from '~/typings'
import mock from './index.mock'

@Injectable()
export class ApiService {
  async index (): Promise<IndexData> {
    return await Promise.resolve(mock)
  }
}
