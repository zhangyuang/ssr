import { createContext } from 'react'

const serverContext = (context?: any) => {
  return createContext(context)
}

const clientContext = createContext(null)

export {
  serverContext,
  clientContext
}
