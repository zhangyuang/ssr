import { DetailData } from '~/typings'
export interface IApiDetailService {
  index: (id: string) => Promise<DetailData>
}
