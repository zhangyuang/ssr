import { Injectable } from '@nestjs/common'
import { Ddata } from '~/typings/data'
import mock from './detail.mock'

@Injectable()
export class ApiDetailService {
  async index (id): Promise<Ddata> {
    return await Promise.resolve(mock.data[id])
  }
}
