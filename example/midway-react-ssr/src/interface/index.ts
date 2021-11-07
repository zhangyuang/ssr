import { IndexData } from '~/typings'

export interface IApiService {
  index: () => Promise<IndexData>
}

export * from './detail'
