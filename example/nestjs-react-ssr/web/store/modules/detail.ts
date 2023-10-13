import { Ddata } from '~/typings/data'

import { proxy } from 'valtio'

export const state = proxy({
  data: {} as Ddata
})

export const actions = {
  setData (payload: any) {
    state.data = payload.data
  }
}
