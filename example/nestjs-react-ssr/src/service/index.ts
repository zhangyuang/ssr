import { Injectable } from '@nestjs/common'
import mock from '../mock'

@Injectable()
export class ApiService {
  async index (): Promise<any> {
    return await Promise.resolve(mock)
  }
}
