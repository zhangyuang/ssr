import { IndexData } from '~/typings/data'

export interface IApiService {
  index: () => Promise<IndexData>
}

export * from './detail'
