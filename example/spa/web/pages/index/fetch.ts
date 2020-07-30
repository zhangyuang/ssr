import { useReducer } from 'react'

const initialState = {
  data: {}
}

function reducer (state, action) {
  switch (action.type) {
    case 'init':
      return { data: action.payload }
    default:
      throw new Error('action type is undefined')
  }
}

export default async ctx => {
  // const [state, dispatch] = useReducer(reducer, initialState)
  const data = __isBrowser__ ? (await window.fetch('/api/index')).json() : await ctx.apiService.index()
  // await dispatch({
  //   type: 'init',
  //   data
  // })
}
