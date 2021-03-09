const searchStore = {
  namespaced: true,
  state: {
    searchText: ''
  },
  mutations: {
    setText (state, payload) {
      state.searchText = payload.text
    }
  },
  actions: {
    setText ({ commit }, { payload }) {
      commit('setText', payload)
    }
  }
}

export {
  searchStore
}
