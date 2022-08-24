import { defineStore } from 'pinia'

export const useSearchStore = defineStore('searchStore', {
  state: () => {
    return { searchText: '' }
  },
  actions: {
    setData (payload: any) {
      this.searchText = payload.text
    }
  }
})
