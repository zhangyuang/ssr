
interface Reducers {
  [key: string]: [(state: any, action: any) => any, any]
}

export const combineReducers = (reducers: Reducers) => {
  const reducerKeys = Object.keys(reducers)
  const reducerValues = Object.values(reducers)
  const combineState = { ...reducerValues[0][1], ...reducerValues[1][1] }

  let finalReducers = {}
  reducerValues.forEach((value, index) => {
    finalReducers = { ...finalReducers, [reducerKeys[index]]: value[0] }
  })
  return [
    (state: any, action: any) => {
      let newState = {}
      for (let i = 0; i < reducerKeys.length; i++) {
        for (const item of reducerValues) {
          const reducer = item[0]
          const result = reducer(
            state,
            action
          )
          if (result) {
            newState = result
            break
          }
        }
      }
      return newState
    },
    combineState
  ]
}
