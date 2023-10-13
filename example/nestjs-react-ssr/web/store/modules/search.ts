
import { proxy } from 'valtio'

export const state = proxy({
  searchText: ''
})

export const actions = {
  setData (payload: any) {
    state.searchText = payload.text
  }
}
